# Installation

This guide will walk you through setting up Claude Hub for your GitHub repository.

## Prerequisites

Before installing Claude Hub, ensure you have:

- A GitHub repository with admin access
- A Claude API key from Anthropic
- Node.js 18+ (for local development)
- Basic understanding of GitHub webhooks

## Installation Methods

### Option 1: GitHub App (Recommended)

The easiest way to get started is by installing our GitHub App:

1. Visit [Claude Hub GitHub App](https://github.com/apps/claude-hub)
2. Click "Install" and select your repositories
3. Configure your Claude API key in the app settings
4. You're ready to go!

### Option 2: Self-Hosted Deployment

For more control or enterprise use, you can self-host Claude Hub:

#### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/intelligence-assist/claude-hub)

#### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/claude-hub)

#### Manual Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/intelligence-assist/claude-hub.git
   cd claude-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Deploy to your preferred platform**
   - Vercel, Railway, or AWS deployment guides available in repository

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Claude AI Configuration
CLAUDE_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-sonnet-20240229

# GitHub Configuration
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
GITHUB_APP_ID=your_github_app_id
GITHUB_PRIVATE_KEY=your_github_private_key

# Optional: Database (for logging)
DATABASE_URL=postgresql://user:password@localhost:5432/claude_hub

# Optional: Redis (for caching)
REDIS_URL=redis://localhost:6379
```

## Verification

After installation, verify Claude Hub is working:

1. Create a test PR in your repository
2. Check that Claude Hub provides a review within 2-3 minutes
3. Try mentioning `@claude-hub` in a comment
4. Check the logs in your deployment platform

## Next Steps

- Configure GitHub webhook settings
- Set up authentication tokens
- Explore Claude Hub features
- Read troubleshooting guides if needed

## Troubleshooting

If you encounter issues during installation:

- Check the Claude Hub repository for troubleshooting guides
- Review the README for common setup issues
- [Report a bug](https://github.com/intelligence-assist/claude-hub/issues/new)