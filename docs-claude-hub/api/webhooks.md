# Webhook API Reference

This document provides comprehensive documentation for Claude Hub's webhook endpoints and API integration.

## Base URL

```
https://your-claude-hub-domain.com
```

## Authentication

All webhook requests must be authenticated using GitHub's webhook signature verification.

### Webhook Signature Verification

GitHub signs webhook payloads with a secret token using HMAC-SHA256:

```http
X-Hub-Signature-256: sha256=<signature>
```

**Verification Process**:
1. Compute HMAC-SHA256 hash of request body using your webhook secret
2. Compare with signature in `X-Hub-Signature-256` header
3. Use constant-time comparison to prevent timing attacks

### Example Verification (Node.js)

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = 'sha256=' + 
    crypto.createHmac('sha256', secret)
          .update(payload, 'utf8')
          .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Endpoints

### GitHub Webhook Endpoint

**Endpoint**: `POST /api/webhooks/github`

**Description**: Receives GitHub webhook events and processes them for automated responses.

#### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` |
| `X-GitHub-Event` | Yes | GitHub event type |
| `X-GitHub-Delivery` | Yes | Unique delivery ID |
| `X-Hub-Signature-256` | Yes | HMAC signature for verification |
| `User-Agent` | Yes | GitHub webhook user agent |

#### Supported Events

##### Issue Comment Created
```json
{
  "action": "created",
  "issue": {
    "number": 123,
    "title": "Bug in authentication",
    "body": "Users unable to login...",
    "state": "open",
    "html_url": "https://github.com/owner/repo/issues/123"
  },
  "comment": {
    "body": "@ClaudeBot help debug this authentication issue",
    "user": {
      "login": "developer123"
    }
  },
  "repository": {
    "full_name": "owner/repo",
    "clone_url": "https://github.com/owner/repo.git"
  }
}
```

##### Pull Request Comment Created
```json
{
  "action": "created",
  "pull_request": {
    "number": 456,
    "title": "Add user authentication",
    "head": {
      "ref": "feature/auth"
    },
    "base": {
      "ref": "main"
    }
  },
  "comment": {
    "body": "@ClaudeBot review this authentication implementation"
  },
  "repository": {
    "full_name": "owner/repo"
  }
}
```

##### Check Suite Completed (for PR Reviews)
```json
{
  "action": "completed",
  "check_suite": {
    "conclusion": "success",
    "pull_requests": [
      {
        "number": 789,
        "head": {
          "sha": "abc123"
        }
      }
    ]
  },
  "repository": {
    "full_name": "owner/repo"
  }
}
```

##### Issues Opened (for Auto-Tagging)
```json
{
  "action": "opened",
  "issue": {
    "number": 321,
    "title": "Login page crashes on mobile",
    "body": "When users try to login on mobile devices, the page crashes...",
    "user": {
      "login": "user123"
    }
  },
  "repository": {
    "full_name": "owner/repo"
  }
}
```

#### Response Format

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Command processed successfully",
  "data": {
    "command": "help debug this authentication issue",
    "repository": "owner/repo",
    "issue_number": 123,
    "response": "I've analyzed the authentication issue...",
    "processing_time_ms": 2340,
    "claude_response": {
      "analysis": "The issue appears to be related to...",
      "recommendations": [
        "Check session configuration",
        "Verify database connections"
      ]
    }
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": "Invalid webhook signature",
  "message": "The webhook signature could not be verified",
  "code": "INVALID_SIGNATURE"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "error": "Unauthorized user",
  "message": "User 'unauthorized-user' is not authorized to use this bot",
  "code": "UNAUTHORIZED_USER"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to process command",
  "code": "PROCESSING_ERROR",
  "details": {
    "container_error": "Claude container failed to start",
    "retry_possible": true
  }
}
```

### Health Check Endpoint

**Endpoint**: `GET /health`

**Description**: Returns service health status and configuration.

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime_seconds": 3600,
  "configuration": {
    "bot_username": "@ClaudeBot",
    "container_mode": true,
    "aws_configured": true,
    "github_configured": true
  },
  "services": {
    "claude_api": {
      "status": "healthy",
      "last_check": "2024-01-15T10:29:45Z",
      "response_time_ms": 450
    },
    "github_api": {
      "status": "healthy",
      "last_check": "2024-01-15T10:29:50Z",
      "rate_limit_remaining": 4850
    }
  }
}
```

### Direct Claude API Endpoint

**Endpoint**: `POST /api/claude`

**Description**: Direct access to Claude processing for manual testing and integration.

#### Request Body

```json
{
  "repository": "owner/repo",
  "command": "analyze the authentication module",
  "issue_number": 123,
  "branch": "feature/auth",
  "context": {
    "pr_number": 456,
    "user": "developer123"
  }
}
```

#### Response

```json
{
  "success": true,
  "response": "I've analyzed the authentication module...",
  "processing_time_ms": 1850,
  "metadata": {
    "container_id": "claude-abc123",
    "model_used": "claude-3-sonnet",
    "tokens_used": 1250
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_SIGNATURE` | 400 | Webhook signature verification failed |
| `MISSING_HEADERS` | 400 | Required headers missing from request |
| `INVALID_PAYLOAD` | 400 | Malformed JSON payload |
| `UNAUTHORIZED_USER` | 401 | User not authorized to use bot |
| `REPOSITORY_ACCESS_DENIED` | 403 | No access to specified repository |
| `BOT_NOT_MENTIONED` | 404 | Bot username not found in comment |
| `PROCESSING_ERROR` | 500 | Internal error during command processing |
| `CONTAINER_FAILED` | 500 | Docker container execution failed |
| `CLAUDE_API_ERROR` | 502 | Claude API unavailable or error |
| `GITHUB_API_ERROR` | 502 | GitHub API unavailable or error |

## Rate Limiting

### GitHub API Limits

Claude Hub respects GitHub's API rate limits:
- **Authenticated requests**: 5,000 per hour
- **Search API**: 30 requests per minute
- **Abuse detection**: Dynamic throttling

### Claude API Limits

Depends on your Anthropic/AWS Bedrock plan:
- **Anthropic API**: Varies by plan tier
- **AWS Bedrock**: Region and model specific
- **Token limits**: Per-request maximums

### Rate Limit Headers

Responses include rate limit information:

```http
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4750
X-RateLimit-Reset: 1642694400
X-RateLimit-Resource: core
```

## Webhook Configuration

### GitHub Repository Setup

1. **Go to Repository Settings** → Webhooks
2. **Add webhook** with these settings:
   - **Payload URL**: `https://your-domain.com/api/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Your webhook secret
   - **Events**: Select specific events or "Send me everything"

### Required Events

Enable these webhook events:
- ✅ **Issue comments** - For @mentions in issues
- ✅ **Pull request review comments** - For @mentions in PR reviews
- ✅ **Pull request comments** - For @mentions in PR conversations
- ✅ **Check suites** - For automated PR reviews
- ✅ **Issues** - For auto-tagging new issues

### Optional Events

Additional useful events:
- **Pull requests** - For PR creation notifications
- **Push** - For branch update notifications
- **Repository** - For repository changes

## Security Considerations

### Request Validation

1. **Verify webhook signature** for every request
2. **Validate GitHub headers** (`X-GitHub-Event`, etc.)
3. **Check user authorization** against allowed users list
4. **Sanitize all inputs** before processing

### Container Security

1. **Isolated execution** - Each request runs in separate container
2. **No persistent state** - Containers are ephemeral
3. **Limited capabilities** - Restricted tool access
4. **Resource limits** - CPU, memory, and time constraints

### Data Privacy

1. **No persistent storage** of repository content
2. **Logs scrubbed** of sensitive information
3. **Credentials managed** via secure providers
4. **Network isolation** between requests

## Monitoring and Logging

### Request Logging

All webhook requests are logged with:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "event_type": "issue_comment.created",
  "repository": "owner/repo",
  "user": "developer123",
  "issue_number": 123,
  "command": "help debug authentication",
  "processing_time_ms": 2340,
  "success": true,
  "container_id": "claude-abc123"
}
```

### Error Tracking

Errors include context for debugging:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "error",
  "message": "Container execution failed",
  "error": {
    "type": "ContainerExecutionError",
    "code": "EXIT_CODE_1",
    "details": "Repository clone failed: authentication error"
  },
  "context": {
    "repository": "owner/repo",
    "user": "developer123",
    "command": "analyze code"
  }
}
```

### Performance Metrics

Track key performance indicators:

- **Request volume** - Requests per hour/day
- **Response times** - P50, P95, P99 latencies
- **Success rates** - Percentage of successful requests
- **Container utilization** - Resource usage patterns
- **API quotas** - GitHub and Claude API usage

## Testing

### Webhook Testing

Use ngrok for local development:

```bash
# Start local server
npm run dev

# Expose local server
ngrok http 3003

# Update GitHub webhook URL
https://abc123.ngrok.io/api/webhooks/github
```

### Manual Testing

Test webhook processing directly:

```bash
# Test GitHub webhook
curl -X POST https://your-domain.com/api/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: issue_comment" \
  -H "X-Hub-Signature-256: sha256=signature" \
  -d @test-payload.json

# Test direct Claude API
curl -X POST https://your-domain.com/api/claude \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "owner/repo",
    "command": "help with authentication",
    "issue_number": 123
  }'
```

### Integration Testing

Use the test utilities:

```bash
# Test full workflow
./test/test-full-flow.sh

# Test specific webhook event
node test/test-webhook-response.js

# Test Claude container execution
./test/test-claudecode-docker.sh
```

This completes the comprehensive webhook API documentation for Claude Hub integration.