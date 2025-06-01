# Claude Did This Documentation

This repository contains the official documentation site for Claude Did This, built with [Docusaurus](https://docusaurus.io/).

## 🌐 Live Site

Visit the documentation at: [claude-did-this.com](https://claude-did-this.com)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/claude-did-this/intelligence-assist-docs.git
cd intelligence-assist-docs

# Install dependencies
npm install

# Start the development server
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## 📁 Project Structure

```
intelligence-assist-docs/
├── docs/                    # Main documentation
│   ├── intro.md            # Landing page
│   ├── projects/           # Project overviews
│   ├── getting-started/    # General getting started guides
│   └── contributing/       # Contributing guidelines
├── docs-claude-hub/        # Claude Hub specific docs
│   ├── overview.md         # Claude Hub overview
│   ├── getting-started/    # Installation and setup
│   ├── features/          # Feature documentation
│   ├── configuration/     # Configuration guides
│   ├── api/              # API reference
│   └── troubleshooting/   # Troubleshooting guides
├── blog/                  # Blog posts
├── src/                   # Custom components and pages
├── static/               # Static assets
└── .github/workflows/    # GitHub Actions for deployment
```

## 🔧 Configuration

### Multi-Project Setup

This documentation site is configured to support multiple projects:

- **Main Documentation**: General Intelligence Assist information
- **Claude Hub**: Dedicated section for Claude Hub project
- **Future Projects**: Easily extensible for new projects

### Custom Domain

The site is configured to deploy to `docs.intelligence-assist.com` with:

- GitHub Pages deployment via GitHub Actions
- Custom domain configuration in `static/CNAME`
- SSL/TLS automatically handled by GitHub Pages

### Search

The site includes Algolia search configuration. To enable search:

1. Set up an Algolia account
2. Update the search configuration in `docusaurus.config.ts`
3. Configure the Algolia crawler

## 🎨 Features

### Professional Theme
- Custom color scheme optimized for technical documentation
- Dark/light mode support
- Enhanced typography with Inter and Fira Code fonts
- Responsive design for all devices

### Enhanced Content
- YouTube video embedding support
- Syntax highlighting for multiple languages
- Interactive code blocks
- Professional styling for tables and admonitions

### Developer Experience
- Hot reload during development
- TypeScript support
- ESLint and Prettier configuration
- Automated deployment

## 📚 Adding Documentation

### New Project Documentation

To add documentation for a new project:

1. **Create project directory**:
   ```bash
   mkdir docs-{project-name}
   ```

2. **Add plugin configuration** to `docusaurus.config.ts`:
   ```javascript
   [
     '@docusaurus/plugin-content-docs',
     {
       id: 'project-name',
       path: 'docs-project-name',
       routeBasePath: 'project-name',
       sidebarPath: './sidebars-project-name.ts',
     },
   ]
   ```

3. **Create sidebar configuration**:
   ```bash
   cp sidebars-claude-hub.ts sidebars-project-name.ts
   ```

4. **Update navigation** in `docusaurus.config.ts`

### Content Guidelines

- Use clear, concise language
- Include code examples where applicable
- Add screenshots and diagrams for complex concepts
- Follow the established document structure
- Test all links and code examples

## 🚀 Deployment

### Automatic Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions.

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🤝 Contributing

We welcome contributions to improve the documentation! Please see our [Contributing Guidelines](docs/contributing/guidelines.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm start`
5. Submit a pull request

## 📄 License

This documentation is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🆘 Support

- 📖 [Documentation Issues](https://github.com/claude-did-this/intelligence-assist-docs/issues)
- 💬 [Discussions](https://github.com/orgs/claude-did-this/discussions)
- 🐛 [Submit an Issue](https://github.com/claude-did-this/intelligence-assist-docs/issues/new)

---

Built with ❤️ using [Docusaurus](https://docusaurus.io/) by the Intelligence Assist team.