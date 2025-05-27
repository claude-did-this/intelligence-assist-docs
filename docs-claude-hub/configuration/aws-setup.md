# AWS Configuration for Claude Hub

This guide covers setting up AWS authentication for Claude Hub to use AWS Bedrock for Claude API access.

## Overview

Claude Hub supports two methods for accessing Claude AI:
1. **Direct Anthropic API** - Using `ANTHROPIC_API_KEY`
2. **AWS Bedrock** - Using AWS credentials for Bedrock service

AWS Bedrock offers several advantages:
- Enterprise-grade security and compliance
- AWS IAM integration
- Better cost control and billing
- Regional data residency
- Integration with AWS services

## Authentication Methods

### 1. AWS Profiles (Recommended)

AWS profiles provide the most secure authentication method using stored credentials.

#### Setup AWS Profile

1. **Install AWS CLI**:
   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

2. **Configure AWS credentials**:
   ```bash
   aws configure --profile claude-hub
   ```
   
   Enter your:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region name (e.g., `us-west-2`)
   - Default output format (`json`)

3. **Set environment variable**:
   ```bash
   AWS_PROFILE=claude-hub
   ```

#### Using the Setup Script

The project includes a helper script to create AWS profiles:

```bash
./scripts/aws/create-aws-profile.sh
```

This script will:
- Prompt for AWS credentials
- Set up the profile configuration
- Validate the setup
- Test Bedrock access

### 2. IAM Roles (EC2/ECS)

For deployments on AWS infrastructure, use IAM roles for automatic credential management.

#### EC2 Instance Profile

1. **Create IAM role** with Bedrock permissions
2. **Attach to EC2 instance**
3. **No environment variables needed** - credentials are automatic

#### ECS Task Role

1. **Create IAM role** with Bedrock permissions
2. **Assign to ECS task definition**
3. **Container inherits credentials** automatically

### 3. Environment Variables (Not Recommended)

For development or legacy setups only:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-west-2
```

> ⚠️ **Security Warning**: Avoid using static credentials in production

## Required AWS Permissions

Your AWS user/role needs the following permissions for Claude Hub:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-opus-20240229-v1:0"
            ]
        }
    ]
}
```

### Creating IAM Policy

1. **Go to AWS IAM Console**
2. **Create Policy** → JSON tab
3. **Paste the permissions** above
4. **Name**: `ClaudeHubBedrockAccess`
5. **Create Policy**

### Attaching to User/Role

1. **Find your user/role** in IAM
2. **Attach Policies**
3. **Select** `ClaudeHubBedrockAccess`
4. **Attach Policy**

## Regional Configuration

### Supported Regions

Claude models are available in these AWS regions:
- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-3` (Paris)
- `ap-southeast-1` (Singapore)
- `ap-northeast-1` (Tokyo)

### Setting Region

```bash
AWS_REGION=us-west-2
```

Choose the region closest to your deployment for best performance.

## Migration from Anthropic API

If you're currently using the direct Anthropic API, you can migrate to AWS Bedrock:

### 1. Setup AWS Credentials

Follow the AWS profile setup above.

### 2. Update Environment Variables

**Remove**:
```bash
# ANTHROPIC_API_KEY=sk-ant-...
```

**Add**:
```bash
AWS_PROFILE=claude-hub
AWS_REGION=us-west-2
```

### 3. Test Configuration

```bash
# Test AWS credential access
node test/test-aws-credential-provider.js

# Test Claude API via Bedrock
node test/test-claude-api.js your-org/your-repo
```

### 4. Verify Functionality

1. **Create test issue** in your repository
2. **Mention the bot** with a simple command
3. **Check response** - should work identically

## Troubleshooting

### Common Issues

#### 1. "Credentials not found"
```
Error: Unable to locate credentials
```

**Solutions**:
- Verify AWS profile exists: `aws configure list-profiles`
- Check profile configuration: `aws configure list --profile claude-hub`
- Ensure `AWS_PROFILE` environment variable is set

#### 2. "Access Denied"
```
Error: User is not authorized to perform: bedrock:InvokeModel
```

**Solutions**:
- Verify IAM permissions are attached
- Check model ARNs in policy match your region
- Ensure Bedrock service is enabled in your region

#### 3. "Model not found"
```
Error: Could not find model anthropic.claude-3-sonnet-20240229-v1:0
```

**Solutions**:
- Verify model is available in your region
- Check model ARN format
- Ensure you have access to the specific model

#### 4. "Region not supported"
```
Error: Bedrock is not available in region
```

**Solutions**:
- Use a supported region (see list above)
- Update `AWS_REGION` environment variable
- Check AWS Bedrock service availability

### Debugging Commands

```bash
# Check AWS configuration
aws configure list --profile claude-hub

# Test AWS credentials
aws sts get-caller-identity --profile claude-hub

# List available Bedrock models
aws bedrock list-foundation-models --region us-west-2 --profile claude-hub

# Test Bedrock access directly
aws bedrock invoke-model \
    --model-id anthropic.claude-3-sonnet-20240229-v1:0 \
    --body '{"messages":[{"role":"user","content":"Hello"}],"max_tokens":100}' \
    --region us-west-2 \
    --profile claude-hub \
    output.json
```

### Log Analysis

Enable debug logging to troubleshoot AWS issues:

```bash
LOG_LEVEL=debug
```

Look for AWS-related log entries:
```
DEBUG: AWS credential provider: using profile claude-hub
DEBUG: AWS region: us-west-2
DEBUG: Bedrock model: anthropic.claude-3-sonnet-20240229-v1:0
```

## Security Best Practices

1. **Use AWS profiles** instead of environment variables
2. **Rotate credentials** regularly (every 90 days)
3. **Monitor usage** with AWS CloudTrail
4. **Set up billing alerts** for unexpected usage
5. **Use least privilege** IAM policies
6. **Enable MFA** for AWS console access
7. **Review access logs** periodically

## Cost Optimization

1. **Choose appropriate models**:
   - Haiku: Fastest, cheapest for simple tasks
   - Sonnet: Balanced performance/cost
   - Opus: Most capable, highest cost

2. **Monitor usage**:
   - Set up AWS Budgets
   - Track costs in AWS Cost Explorer
   - Review usage patterns

3. **Optimize requests**:
   - Use efficient prompts
   - Implement request caching where appropriate
   - Set reasonable token limits

## Advanced Configuration

### Cross-Account Access

For enterprise setups with multiple AWS accounts:

1. **Create cross-account role** in target account
2. **Configure assume role** permissions
3. **Update AWS profile** to assume role:

```ini
[profile claude-hub-cross-account]
role_arn = arn:aws:iam::TARGET-ACCOUNT:role/ClaudeHubRole
source_profile = claude-hub-base
region = us-west-2
```

### VPC Endpoints

For enhanced security, use VPC endpoints for Bedrock:

1. **Create VPC endpoint** for Bedrock
2. **Update security groups** to allow traffic
3. **No code changes required** - AWS SDK automatically uses endpoints

This completes the AWS configuration for Claude Hub. The service will automatically detect and use AWS credentials when available, falling back to Anthropic API if needed.