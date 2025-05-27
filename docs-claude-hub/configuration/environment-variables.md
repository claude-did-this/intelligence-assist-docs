# Environment Variables

This document provides a comprehensive reference for all environment variables used by Claude Hub.

## Required Environment Variables

### GitHub Configuration

#### `BOT_USERNAME` (Required)
- **Description**: GitHub username that the bot responds to when mentioned
- **Format**: Should include the `@` symbol (e.g., `@ClaudeBot`)
- **Example**: `@ClaudeBot`
- **Usage**: Used to detect mentions in GitHub comments and issue discussions

#### `GITHUB_TOKEN` (Required)
- **Description**: GitHub Personal Access Token for API access
- **Scopes Required**: 
  - `repo` - Full repository access
  - `read:org` - Read organization membership (if used in organization repos)
- **Example**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Security**: Never commit this token to version control

#### `GITHUB_WEBHOOK_SECRET` (Required)
- **Description**: Secret used to verify GitHub webhook payloads
- **Format**: Random string (recommended: 64+ characters)
- **Example**: `your_secure_webhook_secret_here`
- **Usage**: Ensures webhook requests are genuinely from GitHub

### Authentication

#### `ANTHROPIC_API_KEY` (Required)
- **Description**: Anthropic API key for Claude access
- **Format**: Starts with `sk-ant-`
- **Example**: `sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx`
- **Alternative**: Can use AWS Bedrock instead (see AWS configuration)

#### `BOT_EMAIL` (Required)
- **Description**: Email address used for git commits made by the bot
- **Example**: `claude-bot@yourcompany.com`
- **Usage**: Git operations require a valid email for commit attribution

### Authorization

#### `DEFAULT_AUTHORIZED_USER` (Optional)
- **Description**: Default GitHub username authorized to use the bot
- **Usage**: Used when `AUTHORIZED_USERS` is not set
- **Example**: `your-github-username`

#### `AUTHORIZED_USERS` (Optional)
- **Description**: Comma-separated list of GitHub usernames authorized to use the bot
- **Format**: `user1,user2,user3`
- **Example**: `admin,developer1,maintainer2`
- **Fallback**: Uses `DEFAULT_AUTHORIZED_USER` if not set

## Optional Environment Variables

### PR Review Configuration

#### `PR_REVIEW_WAIT_FOR_ALL_CHECKS` (Optional)
- **Description**: Wait for all check suites to complete before triggering PR review
- **Default**: `"true"`
- **Values**: `"true"` or `"false"`
- **Usage**: Prevents duplicate reviews from different check suites

#### `PR_REVIEW_TRIGGER_WORKFLOW` (Optional)
- **Description**: Name of specific GitHub Actions workflow that should trigger PR reviews
- **Example**: `"Pull Request CI"`
- **Usage**: Only used if `PR_REVIEW_WAIT_FOR_ALL_CHECKS` is `"false"`

#### `PR_REVIEW_DEBOUNCE_MS` (Optional)
- **Description**: Delay in milliseconds before checking all check suites status
- **Default**: `"5000"`
- **Range**: 1000-30000 (1-30 seconds)
- **Usage**: Accounts for GitHub's eventual consistency

### AWS Configuration (Alternative to ANTHROPIC_API_KEY)

#### `AWS_ACCESS_KEY_ID` (Optional)
- **Description**: AWS access key for Bedrock access
- **Alternative**: Use AWS profiles or IAM roles (recommended)
- **Security**: Prefer profile-based authentication

#### `AWS_SECRET_ACCESS_KEY` (Optional)
- **Description**: AWS secret key for Bedrock access
- **Alternative**: Use AWS profiles or IAM roles (recommended)
- **Security**: Prefer profile-based authentication

#### `AWS_REGION` (Optional)
- **Description**: AWS region for Bedrock service
- **Default**: `us-west-2`
- **Example**: `us-east-1`

#### `AWS_PROFILE` (Recommended)
- **Description**: AWS profile name for authentication
- **Example**: `claude-hub-prod`
- **Security**: More secure than static credentials

### Container Configuration

#### `CLAUDE_USE_CONTAINERS` (Optional)
- **Description**: Enable container mode for Claude execution
- **Default**: `0` (disabled)
- **Values**: `1` (enabled) or `0` (disabled)
- **Recommended**: Enable for production deployments

#### `CLAUDE_CONTAINER_IMAGE` (Optional)
- **Description**: Docker image to use for Claude containers
- **Default**: `claudecode:latest`
- **Example**: `your-registry/claudecode:v1.2.3`

#### `REPO_CACHE_DIR` (Optional)
- **Description**: Directory for repository caching
- **Example**: `/app/cache/repos`
- **Usage**: Improves performance by caching cloned repositories

#### `REPO_CACHE_MAX_AGE_MS` (Optional)
- **Description**: Maximum age for cached repositories in milliseconds
- **Default**: `3600000` (1 hour)
- **Example**: `7200000` (2 hours)

### Logging Configuration

#### `LOG_LEVEL` (Optional)
- **Description**: Logging verbosity level
- **Default**: `info`
- **Values**: `error`, `warn`, `info`, `debug`, `trace`
- **Development**: Use `debug` or `trace`
- **Production**: Use `info` or `warn`

#### `LOG_FORMAT` (Optional)
- **Description**: Log output format
- **Default**: `json`
- **Values**: `json`, `pretty`
- **Development**: Use `pretty` for readable logs
- **Production**: Use `json` for structured logging

### Server Configuration

#### `PORT` (Optional)
- **Description**: Port number for the webhook service
- **Default**: `3003`
- **Example**: `8080`
- **Usage**: Configure based on your deployment environment

#### `NODE_ENV` (Optional)
- **Description**: Node.js environment
- **Default**: `development`
- **Values**: `development`, `production`, `test`
- **Production**: Always set to `production` in prod deployments

## Environment File Template

Create a `.env` file in your project root with the following template:

```bash
# Required Configuration
BOT_USERNAME=@YourBotName
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_WEBHOOK_SECRET=your_secure_webhook_secret
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
BOT_EMAIL=bot@yourcompany.com

# Authorization (Optional)
DEFAULT_AUTHORIZED_USER=your-github-username
# AUTHORIZED_USERS=user1,user2,user3

# PR Review Settings (Optional)
PR_REVIEW_WAIT_FOR_ALL_CHECKS=true
# PR_REVIEW_TRIGGER_WORKFLOW=Pull Request CI
PR_REVIEW_DEBOUNCE_MS=5000

# AWS Alternative (Optional - instead of ANTHROPIC_API_KEY)
# AWS_PROFILE=claude-hub
# AWS_REGION=us-west-2

# Container Configuration (Optional)
# CLAUDE_USE_CONTAINERS=1
# CLAUDE_CONTAINER_IMAGE=claudecode:latest
# REPO_CACHE_DIR=/app/cache/repos
# REPO_CACHE_MAX_AGE_MS=3600000

# Logging (Optional)
# LOG_LEVEL=info
# LOG_FORMAT=json

# Server (Optional)
# PORT=3003
# NODE_ENV=production
```

## Security Best Practices

1. **Never commit secrets**: Use `.env` files and add them to `.gitignore`
2. **Use AWS profiles**: Prefer profile-based authentication over static credentials
3. **Rotate tokens regularly**: Refresh GitHub tokens and webhook secrets periodically
4. **Limit token scopes**: Only grant minimum required permissions
5. **Use strong secrets**: Generate webhook secrets with high entropy
6. **Monitor usage**: Track API usage and set up alerts for unusual activity

## Validation

The service validates required environment variables on startup. Missing required variables will cause the service to fail with descriptive error messages.

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
LOG_LEVEL=debug
LOG_FORMAT=pretty
CLAUDE_USE_CONTAINERS=0
```

### Production
```bash
NODE_ENV=production
LOG_LEVEL=info
LOG_FORMAT=json
CLAUDE_USE_CONTAINERS=1
```

### Testing
```bash
NODE_ENV=test
LOG_LEVEL=warn
CLAUDE_USE_CONTAINERS=0
```