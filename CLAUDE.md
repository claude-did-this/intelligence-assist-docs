# CLAUDE.md

This file provides guidance to Claude Code when working with this documentation repository.

## Project Structure

This is a Docusaurus documentation site that serves as the central hub for Intelligence Assist project documentation.

### Key Directories

- `docs/` - General documentation and tutorials
- `docs-claude-hub/` - **Automatically synchronized** documentation from the claude-hub repository
- `blog/` - Blog posts and announcements
- `src/` - React components and custom pages
- `static/` - Static assets (images, files)
- `scripts/` - Automation and utility scripts

### Important Files

- `docusaurus.config.ts` - Main Docusaurus configuration
- `sidebars.ts` - Navigation structure for main docs
- `sidebars-claude-hub.ts` - Navigation for claude-hub documentation
- `scripts/sync-claude-hub-docs.js` - **Automated documentation sync script**

## Documentation Sync System

### Automated Claude Hub Documentation

The `docs-claude-hub/` directory contains documentation automatically synchronized from the [claude-hub repository](https://github.com/claude-did-this/claude-hub). 

**⚠️ IMPORTANT**: Do NOT manually edit files in `docs-claude-hub/` as they will be overwritten during the next sync.

### Sync Process

1. **Automated Daily Sync**: GitHub Actions runs daily at 2 AM UTC
2. **Manual Sync**: Run `npm run sync:claude-hub` locally
3. **Workflow Trigger**: GitHub Actions workflow can be manually triggered

### File Mappings

The sync script (`scripts/sync-claude-hub-docs.js`) maintains mappings from claude-hub documentation to the appropriate locations in this site:

- `README.md` → `docs-claude-hub/overview.md`
- `docs/complete-workflow.md` → `docs-claude-hub/getting-started/complete-workflow.md`
- `docs/claude-authentication-guide.md` → `docs-claude-hub/configuration/authentication.md`
- And many more (see script for full mappings)

### Adding New Documentation

1. **For claude-hub**: Add documentation to the claude-hub repository - it will be automatically synced
2. **For general documentation**: Add files to the `docs/` directory
3. **Update navigation**: Modify `sidebars.ts` or `sidebars-claude-hub.ts` as needed

## Build & Development Commands

### Development
- **Start dev server**: `npm start`
- **Build for production**: `npm build`
- **Serve production build**: `npm run serve`
- **Type checking**: `npm run typecheck`

### Documentation Sync
- **Sync claude-hub docs**: `npm run sync:claude-hub`
- **View sync report**: Check `sync-report.md` after running sync

### AI DocOps Steward
- **Full steward analysis**: `npm run steward:full`
- **Monitor source changes**: `npm run steward:monitor`
- **Quality analysis**: `npm run steward:quality`
- **Drift detection**: `npm run steward:drift`
- **Generate improvements**: `npm run steward:improve`
- **Apply automatic fixes**: `npm run steward:fix`
- **View steward report**: Check `docops-steward-report.md` after running

### Content Management
- **Clear Docusaurus cache**: `npm run clear`
- **Generate translations**: `npm run write-translations`
- **Generate heading IDs**: `npm run write-heading-ids`

## Configuration

### Docusaurus Configuration
The main configuration is in `docusaurus.config.ts` and includes:
- Site metadata and branding
- Theme configuration
- Plugin settings (including Mermaid diagram support)
- Multiple documentation instances for different projects

### Navigation Configuration
- `sidebars.ts` - Main documentation navigation
- `sidebars-claude-hub.ts` - Claude Hub documentation navigation

## Content Guidelines

### Markdown Features
- Standard Markdown with MDX support
- Mermaid diagrams enabled
- Docusaurus-specific features (admonitions, tabs, etc.)
- Live code blocks supported

### Writing Style
- Clear, concise documentation
- Use appropriate headings and structure
- Include code examples where relevant
- Add frontmatter with title and description

### Images and Assets
- Store images in `static/img/`
- Reference with `/img/filename.ext`
- Optimize images for web delivery

## Automation

### GitHub Actions
- **Documentation Sync**: Automatically syncs claude-hub documentation
- **Deployment**: Automatically deploys to GitHub Pages on main branch changes

### Pre-commit Hooks
- Code formatting and linting (if configured)
- Link checking (if configured)

## Troubleshooting

### Sync Issues
- Check that claude-hub repository is accessible
- Verify file mappings in sync script
- Review sync-report.md for detailed results

### Build Issues
- Clear cache with `npm run clear`
- Check for broken links or invalid Markdown
- Verify frontmatter syntax

### Development Issues
- Ensure Node.js version >= 18
- Clear node_modules and reinstall if needed
- Check TypeScript compilation errors

## Contributing

### Documentation Updates
1. For claude-hub docs: Contribute to the claude-hub repository
2. For general docs: Edit files in `docs/` directory
3. For site improvements: Modify components in `src/`

### Code Quality
- Follow existing code patterns
- Test changes locally before committing
- Ensure TypeScript compilation succeeds
- Verify all documentation builds successfully

## Security

- No sensitive information should be committed
- API keys and tokens should use environment variables
- All external links should be verified for safety