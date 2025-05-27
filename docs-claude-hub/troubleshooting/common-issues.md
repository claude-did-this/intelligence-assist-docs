# Common Issues and Solutions

This guide covers the most frequently encountered issues when setting up and using Claude Hub, along with their solutions.

## Setup and Configuration Issues

### 1. Bot Not Responding to Mentions

**Problem**: Bot username is mentioned in comments but no response is received.

**Symptoms**:
- Comments with `@BotName` don't trigger responses
- No logs showing webhook processing
- Health check passes but functionality doesn't work

**Solutions**:

#### Check Bot Username Configuration
```bash
# Verify BOT_USERNAME is set correctly
echo $BOT_USERNAME
# Should show: @YourBotName (with @ symbol)
```

#### Verify Webhook Configuration
1. **GitHub webhook URL** points to correct endpoint
2. **Secret** matches `GITHUB_WEBHOOK_SECRET`
3. **Events** include `Issue comments` and `Pull request review comments`

#### Check User Authorization
```bash
# Verify user is authorized
echo $AUTHORIZED_USERS
# Should include the commenting user's GitHub username
```

#### Review Logs
```bash
# Check webhook reception
docker logs claude-hub-webhook -f | grep "webhook"

# Look for authentication errors
docker logs claude-hub-webhook -f | grep "unauthorized"
```

### 2. Webhook Signature Verification Fails

**Problem**: GitHub webhook requests are rejected with signature verification errors.

**Error Message**:
```
Error: Invalid webhook signature
```

**Solutions**:

#### Verify Webhook Secret
1. **Check GitHub webhook configuration** has correct secret
2. **Verify environment variable** `GITHUB_WEBHOOK_SECRET` matches
3. **Ensure no extra whitespace** in secret value

#### Test Signature Locally
```bash
# Generate test signature
node test/generate-signature.js "your-webhook-secret" "test-payload"

# Test with real payload
node test/test-webhook-credentials.js
```

### 3. Container Execution Failures

**Problem**: Docker containers fail to start or execute properly.

**Error Messages**:
```
Container execution failed: Exit code 1
Docker daemon not available
Permission denied accessing Docker socket
```

**Solutions**:

#### Check Docker Daemon
```bash
# Verify Docker is running
docker ps

# Test container creation
docker run --rm hello-world
```

#### Fix Permission Issues
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Restart session or use newgrp
newgrp docker
```

#### Verify Container Image
```bash
# Check if image exists
docker images | grep claudecode

# Build image if missing
./scripts/build/build-claudecode.sh
```

## Authentication Issues

### 4. GitHub API Authentication Failures

**Problem**: GitHub API calls fail with authentication errors.

**Error Messages**:
```
HTTP 401: Bad credentials
API rate limit exceeded
Token does not have required scopes
```

**Solutions**:

#### Verify GitHub Token
```bash
# Test token validity
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Check token scopes
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user -I | grep "X-OAuth-Scopes"
```

#### Required Token Scopes
Ensure your GitHub token has:
- ✅ `repo` - Full repository access
- ✅ `read:org` - Organization membership (if needed)

#### Rate Limit Management
```bash
# Check current rate limit
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit
```

### 5. Claude API Authentication Issues

**Problem**: Claude API calls fail with authentication or quota errors.

**Error Messages**:
```
Invalid API key
Rate limit exceeded
Model not found
AWS credentials not found
```

**Solutions**:

#### For Anthropic API
```bash
# Verify API key format
echo $ANTHROPIC_API_KEY | head -c 20
# Should start with: sk-ant-

# Test API access
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
  -H "Content-Type: application/json" \
  https://api.anthropic.com/v1/messages
```

#### For AWS Bedrock
```bash
# Check AWS configuration
aws configure list --profile claude-hub

# Test Bedrock access
aws bedrock list-foundation-models --region us-west-2 --profile claude-hub

# Verify credentials
aws sts get-caller-identity --profile claude-hub
```

## Repository Access Issues

### 6. Repository Clone Failures

**Problem**: Unable to clone private repositories or access repository content.

**Error Messages**:
```
Repository not found
Permission denied (publickey)
Authentication failed
```

**Solutions**:

#### For Public Repositories
```bash
# Test direct clone
git clone https://github.com/owner/repo.git

# Verify repository exists and is accessible
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo
```

#### For Private Repositories
```bash
# Verify token has repo access
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/private-repo

# Test clone with token
git clone https://$GITHUB_TOKEN@github.com/owner/private-repo.git
```

### 7. Branch Checkout Issues

**Problem**: Unable to checkout specific branches for PR analysis.

**Error Messages**:
```
Branch not found
Failed to checkout branch
Merge conflicts during checkout
```

**Solutions**:

#### Verify Branch Exists
```bash
# List all branches
gh api repos/owner/repo/branches

# Check specific branch
gh api repos/owner/repo/branches/feature-branch
```

#### Clean Repository State
The system automatically handles repository cleanup, but you can manually verify:

```bash
# Check repository cache
ls -la $REPO_CACHE_DIR

# Clear cache if needed
rm -rf $REPO_CACHE_DIR/*
```

## Performance Issues

### 8. Slow Response Times

**Problem**: Bot responses take too long or timeout.

**Symptoms**:
- Responses take > 30 seconds
- Timeout errors in logs
- Users report slow performance

**Solutions**:

#### Optimize Container Resources
```bash
# Check container resource usage
docker stats

# Increase container limits
export CONTAINER_MEMORY_LIMIT=2g
export CONTAINER_CPU_LIMIT=2
```

#### Enable Repository Caching
```bash
# Configure repository cache
REPO_CACHE_DIR=/app/cache/repos
REPO_CACHE_MAX_AGE_MS=3600000
```

#### Monitor Processing Times
```bash
# Check processing metrics
grep "processing_time_ms" /var/log/claude-hub.log | tail -10

# Identify slow operations
grep "processing_time_ms.*[5-9][0-9][0-9][0-9]" /var/log/claude-hub.log
```

### 9. High Memory Usage

**Problem**: Service consumes excessive memory.

**Solutions**:

#### Monitor Memory Usage
```bash
# Check service memory
ps aux | grep "node.*claude"

# Monitor Docker containers
docker stats --no-stream
```

#### Configure Resource Limits
```bash
# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=1024"

# Configure container limits
CONTAINER_MEMORY_LIMIT=1g
```

## Auto-Tagging Issues

### 10. Labels Not Applied to Issues

**Problem**: New issues don't receive automatic labels.

**Symptoms**:
- Issues created without labels
- No auto-tagging logs
- Manual labeling works fine

**Solutions**:

#### Verify Webhook Events
Ensure GitHub webhook includes:
- ✅ `Issues` events
- ✅ Specifically `issues.opened`

#### Check Label Setup
```bash
# Verify repository has required labels
gh label list --repo owner/repo

# Create missing labels
GITHUB_TOKEN=your_token node scripts/utils/setup-repository-labels.js owner/repo
```

#### Review Auto-Tagging Logs
```bash
# Check auto-tagging container logs
docker logs $(docker ps -q --filter "name=claude-tagging") -f

# Look for analysis results
grep "auto_tagging" /var/log/claude-hub.log
```

## PR Review Issues

### 11. Automated Reviews Not Triggered

**Problem**: PR reviews don't trigger automatically after CI completion.

**Solutions**:

#### Verify Check Suite Events
Ensure webhook receives:
- ✅ `Check suites` events
- ✅ Events with `conclusion: 'success'`

#### Check PR Review Configuration
```bash
# Verify configuration
echo $PR_REVIEW_WAIT_FOR_ALL_CHECKS
echo $PR_REVIEW_TRIGGER_WORKFLOW
```

#### Test Manual Review Trigger
```bash
# Trigger review manually
./cli/claude-webhook owner/repo "Review this PR" -p -b feature-branch
```

## Network and Connectivity Issues

### 12. External API Timeouts

**Problem**: Connections to GitHub or Claude API timeout.

**Solutions**:

#### Check Network Connectivity
```bash
# Test GitHub API
curl -I https://api.github.com

# Test Anthropic API
curl -I https://api.anthropic.com

# Test AWS Bedrock (if using)
curl -I https://bedrock.us-west-2.amazonaws.com
```

#### Configure Timeout Settings
```bash
# Increase timeout values
export API_TIMEOUT_MS=30000
export CONTAINER_TIMEOUT_MS=60000
```

### 13. Firewall Issues

**Problem**: Firewall blocking required connections.

**Solutions**:

#### Initialize Firewall Rules
```bash
# Run firewall setup
./scripts/security/init-firewall.sh

# Check firewall status
sudo ufw status
```

#### Allow Required Ports
```bash
# Allow webhook port
sudo ufw allow 3003

# Allow Docker communications
sudo ufw allow from 172.16.0.0/12
```

## Logging and Debugging

### Enable Debug Logging

For detailed troubleshooting, enable debug logging:

```bash
# Set debug log level
LOG_LEVEL=debug

# Enable specific debug flags
PR_REVIEW_DEBUG=true
AUTO_TAGGING_DEBUG=true
CONTAINER_DEBUG=true

# Restart service
docker compose restart webhook
```

### Log Analysis

#### Common Log Patterns

**Successful Processing**:
```json
{
  "level": "info",
  "message": "Command processed successfully",
  "processing_time_ms": 2340,
  "success": true
}
```

**Authentication Errors**:
```json
{
  "level": "error",
  "message": "User not authorized",
  "user": "unauthorized-user",
  "error": "UNAUTHORIZED_USER"
}
```

**Container Failures**:
```json
{
  "level": "error",
  "message": "Container execution failed",
  "exit_code": 1,
  "container_id": "claude-abc123"
}
```

#### Log Locations

```bash
# Service logs
docker logs claude-hub-webhook -f

# Container execution logs
docker logs $(docker ps -a -q --filter "name=claude-") --tail 100

# System logs
tail -f /var/log/claude-hub.log
```

## Getting Help

### Support Channels

1. **GitHub Issues**: [Report bugs and request features](https://github.com/intelligence-assist/claude-hub/issues)
2. **GitHub Discussions**: [Community support and questions](https://github.com/intelligence-assist/claude-hub/discussions)
3. **Documentation**: [Full documentation site](https://docs.intelligence-assist.dev)

### Before Reporting Issues

Include this information:
- **Version**: Claude Hub version (`git rev-parse HEAD`)
- **Environment**: Deployment method (Docker, manual, cloud)
- **Configuration**: Relevant environment variables (redacted)
- **Logs**: Recent error logs and stack traces
- **Steps to reproduce**: Clear reproduction steps
- **Expected vs actual behavior**: What should happen vs what happens

### Diagnostic Commands

Run these to gather diagnostic information:

```bash
# Service status
./scripts/utils/health-check.sh

# Configuration check
./scripts/utils/config-check.sh

# Full diagnostic
./scripts/utils/diagnostic-report.sh > claude-hub-diagnostic.txt
```

This comprehensive troubleshooting guide should help resolve most common issues with Claude Hub setup and operation.