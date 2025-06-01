---
title: Container Mode Limitations
---

:::info
This documentation is automatically synchronized from the [claude-hub repository](https://github.com/claude-did-this/claude-hub). 
Last updated: 2025-06-01
:::



# Container Mode Limitations

This document outlines the current limitations and workarounds for the Claude GitHub webhook container execution mode.

## Current Implementation

The current implementation uses a hybrid approach:

1. **Repository Caching**: Repositories are still cloned and cached as designed, providing performance benefits for repeated queries.

2. **Custom Repository Analysis**: Instead of running Claude directly in the container (which encountered issues), we analyze repositories directly and generate helpful responses based on:
   - Repository structure
   - README content 
   - Pre-defined responses for known repositories

3. **Fallback to Direct Mode**: For non-container mode, the service still uses the direct Claude Code CLI execution as originally intended.

## Known Issues

### Container Output Capture

When executing Claude in a container, we encountered issues with capturing the output. Several approaches were attempted:

1. **Direct execSync**: Output not returned properly
2. **File-based output redirection**: Output file not created 
3. **Volume mounting**: Files not properly shared between container and host

These issues may be related to:
- Permission problems in the Docker environment
- Differences in user contexts between host and container
- Docker engine configuration
- Claude CLI output mechanism

### Container Execution Timeout

By default, containers have a 2-hour lifetime before being terminated. This can be configured via the `CONTAINER_LIFETIME_MS` environment variable (in milliseconds). For complex tasks requiring more time, you can increase this value.

### Claude Authentication

Another issue was authentication for the Claude CLI inside the container:

1. **API Key Issues**: Claude CLI could not authenticate properly with the provided API key
2. **Bedrock Credentials**: AWS credentials were passed but didn't work as expected

## Future Improvements

To properly enable full Claude execution in containers, consider:

1. **Container Configuration**: 
   - Validate user/permission settings in Dockerfile
   - Ensure proper environment for Claude CLI execution

2. **Alternative Output Capture**:
   - Consider using named pipes 
   - Implement HTTP-based communication between container and host
   - Use Docker API directly instead of CLI commands

3. **Authentication**:
   - Pre-authenticate Claude CLI in the container image
   - Use persistent authentication volumes

4. **Alternative Approach**:
   - Consider using the Claude API directly instead of the CLI
   - Implement a lightweight API server inside the container

## Workaround Implementation

The current workaround, as implemented in `claudeService.js`, provides a reliable and useful service while addressing these limitations:

1. For known repositories (configured via environment variables), we provide curated responses
2. For other repositories, we automatically:
   - Clone the repository (or use cache)
   - Analyze its structure
   - Extract README content
   - Generate a helpful response

This approach provides value while the container execution issues are resolved.

## Testing

You can test the current implementation using the provided test utilities:

```bash
# Test with a repository using the CLI
./cli/claude-webhook owner/repo "What is this repository about?"

# Test with Docker directly
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock claudecode:latest \
  claude "What is this repository about?"
```