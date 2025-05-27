# Automated PR Reviews

Claude Hub provides comprehensive automated code reviews for pull requests, analyzing code quality, security, performance, and adherence to best practices.

## Overview

The automated PR review system:
- **Triggers** automatically when all CI checks pass
- **Analyzes** code changes comprehensively
- **Provides** detailed feedback and suggestions
- **Posts** review comments directly to GitHub
- **Integrates** seamlessly with your existing workflow

## Trigger Mechanism

### Check Suite Completion

Reviews are triggered by the `check_suite` webhook event with `conclusion: 'success'`:

```javascript
// Trigger conditions
if (event === 'check_suite' && 
    payload.check_suite.conclusion === 'success') {
  // Find all PRs associated with this check suite
  // Trigger comprehensive review for each PR
}
```

### Configuration Options

#### Wait for All Checks (Default)
```bash
PR_REVIEW_WAIT_FOR_ALL_CHECKS=true
PR_REVIEW_DEBOUNCE_MS=5000
```

- **Waits** for all check suites to complete successfully
- **Prevents** duplicate reviews from multiple check suites
- **Debounces** for 5 seconds to handle eventual consistency

#### Specific Workflow Trigger
```bash
PR_REVIEW_WAIT_FOR_ALL_CHECKS=false
PR_REVIEW_TRIGGER_WORKFLOW="Pull Request CI"
```

- **Triggers** only on specific workflow completion
- **Useful** for repositories with multiple CI workflows
- **Reduces** noise from non-critical checks

## Review Analysis

### Code Quality Assessment

#### Code Smells Detection
- **Long methods/functions**: Complexity analysis
- **Duplicate code**: Pattern recognition
- **Dead code**: Unused variable/function detection
- **Code formatting**: Style consistency checks
- **Naming conventions**: Variable/function naming review

#### Best Practices Enforcement
- **Design patterns**: Appropriate pattern usage
- **SOLID principles**: Architecture adherence
- **Code organization**: File structure and modularity
- **Documentation**: Comment quality and coverage
- **Error handling**: Exception management review

### Security Analysis

#### Vulnerability Detection
- **SQL injection**: Query parameterization checks
- **XSS prevention**: Input sanitization review
- **Authentication**: Session management analysis
- **Authorization**: Access control verification
- **Secrets exposure**: Credential scanning

#### Security Best Practices
- **Input validation**: Data sanitization checks
- **Output encoding**: XSS prevention measures
- **Cryptography**: Secure algorithm usage
- **Dependencies**: Known vulnerability scanning
- **Configuration**: Security setting review

### Performance Optimization

#### Efficiency Analysis
- **Algorithm complexity**: Big O analysis
- **Database queries**: N+1 problem detection
- **Memory usage**: Memory leak identification
- **Caching opportunities**: Performance optimization suggestions
- **Resource management**: Connection and resource cleanup

#### Scalability Considerations
- **Concurrent execution**: Thread safety analysis
- **Resource contention**: Bottleneck identification
- **Load handling**: Capacity planning insights
- **Optimization patterns**: Performance improvement suggestions

## Review Output

### Line-Specific Comments

Claude posts targeted comments on specific lines:

```markdown
**🔍 Code Quality Issue**

This method is quite long (45 lines) and handles multiple responsibilities. 
Consider breaking it down into smaller, focused methods:

1. Extract user validation logic
2. Separate database operations
3. Create dedicated response formatting

This would improve readability and testability.
```

### General Review Comments

Overall assessment posted as PR review:

```markdown
## 🤖 Automated Code Review

### ✅ Strengths
- Good error handling implementation
- Comprehensive test coverage
- Clear variable naming

### ⚠️ Areas for Improvement
- Consider adding input validation for user data
- Database connection could benefit from connection pooling
- Some methods could be extracted for better modularity

### 🔒 Security Notes
- Verify SQL query parameterization in user service
- Consider rate limiting for API endpoints

### 🚀 Performance Suggestions
- Add caching for frequently accessed user data
- Consider pagination for large result sets

**Overall Assessment**: ✅ Approved with suggestions
```

### Review Actions

Claude can:
- **Approve** PRs that meet quality standards
- **Request changes** for significant issues
- **Comment** with suggestions and feedback
- **Flag** security or critical issues

## Integration with GitHub

### GitHub CLI Usage

Reviews are posted using GitHub CLI commands:

```bash
# Post review with overall feedback
gh pr review 123 --approve --body "Automated review feedback..."

# Add line-specific comments
gh pr review 123 --comment --body "Suggestion for line 45..."
```

### Review Status Integration

- **Check runs**: Creates check run for review status
- **Status checks**: Integrates with branch protection rules
- **Review requirements**: Satisfies review requirements if approved
- **Merge blocking**: Can block merges for critical issues

## Workflow Integration

### Branch Protection Rules

Configure branch protection to require PR reviews:

```yaml
# .github/branch-protection.yml
protection_rules:
  main:
    required_status_checks:
      strict: true
      contexts:
        - "claude-hub/pr-review"
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
```

### CI/CD Pipeline Integration

```yaml
# .github/workflows/pr.yml
name: Pull Request CI
on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      
  # Claude Hub review triggers automatically after all checks pass
```

## Customization

### Review Focus Areas

Customize review emphasis by file patterns:

```javascript
const reviewConfig = {
  security: {
    patterns: ['**/auth/**', '**/security/**', '**/*auth*'],
    weight: 'high'
  },
  performance: {
    patterns: ['**/api/**', '**/services/**'],
    weight: 'medium'
  },
  documentation: {
    patterns: ['**/docs/**', '**/*.md'],
    weight: 'low'
  }
};
```

### Language-Specific Rules

Different analysis for different languages:

```javascript
const languageRules = {
  javascript: {
    focus: ['async/await patterns', 'error handling', 'security'],
    tools: ['eslint', 'security-audit']
  },
  python: {
    focus: ['PEP 8 compliance', 'type hints', 'documentation'],
    tools: ['pylint', 'mypy', 'black']
  },
  java: {
    focus: ['design patterns', 'exception handling', 'performance'],
    tools: ['spotbugs', 'pmd', 'checkstyle']
  }
};
```

### Team Preferences

Configure review style for your team:

```bash
# Review strictness level
PR_REVIEW_STRICTNESS=balanced  # strict, balanced, lenient

# Focus areas
PR_REVIEW_FOCUS=security,performance,maintainability

# Review tone
PR_REVIEW_TONE=constructive  # constructive, detailed, brief
```

## Quality Metrics

### Review Effectiveness

Track review impact:

- **Issue Prevention**: Bugs caught before merge
- **Code Quality Improvement**: Metrics over time
- **Security Enhancement**: Vulnerabilities identified
- **Learning Acceleration**: Team skill development

### Performance Metrics

Monitor review system:

- **Review Time**: Average time from trigger to completion
- **Coverage**: Percentage of PRs reviewed
- **Accuracy**: Manual override rate
- **Team Adoption**: Developer feedback and usage

## Best Practices

### For Developers

1. **Small PRs**: Keep changes focused and reviewable
2. **Clear Descriptions**: Provide context for changes
3. **Self-Review**: Review your own code before submitting
4. **Address Feedback**: Respond to review suggestions promptly
5. **Learn from Reviews**: Use feedback to improve coding practices

### for Teams

1. **Review Guidelines**: Establish team standards for reviews
2. **Training**: Educate team on review feedback interpretation
3. **Feedback Culture**: Encourage constructive discussion
4. **Continuous Improvement**: Regularly assess review effectiveness
5. **Tool Integration**: Combine with other quality tools

### For Organizations

1. **Consistent Standards**: Maintain consistent review criteria
2. **Security Focus**: Prioritize security review feedback
3. **Metrics Tracking**: Monitor code quality trends
4. **Tool Evolution**: Regularly update review configurations
5. **Knowledge Sharing**: Share learnings across teams

## Troubleshooting

### Common Issues

#### 1. Reviews Not Triggering
```
PR created but no automated review posted
```

**Check**:
- CI checks are completing successfully
- Webhook events are being received
- PR review configuration is enabled
- GitHub token has review permissions

#### 2. Incomplete Reviews
```
Review posted but missing analysis sections
```

**Possible Causes**:
- Large PR size causing timeout
- Complex code analysis taking too long
- API rate limits being hit
- Container resource constraints

#### 3. False Positives
```
Review flags correct code as problematic
```

**Solutions**:
- Adjust review strictness settings
- Add project-specific context
- Implement allow-list for known patterns
- Provide feedback for model improvement

### Debug Configuration

Enable detailed review logging:

```bash
LOG_LEVEL=debug
PR_REVIEW_DEBUG=true
PR_REVIEW_VERBOSE=true
```

### Manual Review Trigger

Test review functionality manually:

```bash
# Trigger review for specific PR
./cli/claude-webhook owner/repo "Review this PR" -p -b feature-branch

# Test with specific focus
./cli/claude-webhook owner/repo "Review security aspects of this PR" -p -b feature-branch
```

## Future Enhancements

Planned improvements:

- **Learning from Feedback**: Adapt based on developer responses
- **Custom Rule Engine**: Repository-specific review rules
- **Integration Webhooks**: Notify external systems of review results
- **Review Templates**: Standardized review formats
- **Multi-Language Support**: Enhanced analysis for various languages
- **Performance Optimization**: Faster review processing
- **Review Summaries**: Team-wide code quality reports

The automated PR review system continuously evolves to provide more accurate, helpful, and contextually relevant feedback for your development workflow.