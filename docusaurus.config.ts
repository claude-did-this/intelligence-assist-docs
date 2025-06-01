import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Claude Did This',
  tagline: 'Autonomous AI development - because sometimes Claude just does things',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://claude-did-this.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config
  organizationName: 'intelligence-assist',
  projectName: 'intelligence-assist-docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/intelligence-assist/intelligence-assist-docs/tree/main/',
          // Multi-instance docs for different projects
          id: 'default',
          path: 'docs',
          routeBasePath: 'docs',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/intelligence-assist/intelligence-assist-docs/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Plugin for YouTube video embedding
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'claude-hub',
        path: 'docs-claude-hub',
        routeBasePath: 'claude-hub',
        sidebarPath: './sidebars-claude-hub.ts',
        editUrl: 'https://github.com/intelligence-assist/intelligence-assist-docs/tree/main/',
      },
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },
  themeConfig: {
    image: 'img/intelligence-assist-social-card.jpg',
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    navbar: {
      title: 'Intelligence Assist',
      logo: {
        alt: 'Intelligence Assist Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'doc',
          docId: 'overview',
          docsPluginId: 'claude-hub',
          position: 'left',
          label: 'Claude Hub',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/intelligence-assist',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Claude Hub',
              to: '/claude-hub/overview',
            },
          ],
        },
        {
          title: 'Projects',
          items: [
            {
              label: 'Claude Hub',
              href: 'https://github.com/intelligence-assist/claude-hub',
            },
            {
              label: 'All Projects',
              href: 'https://github.com/intelligence-assist',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub Organization',
              href: 'https://github.com/intelligence-assist',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Intelligence Assist. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'typescript', 'javascript'],
    },
    // Enhanced search configuration
    algolia: {
      // You'll need to configure this with Algolia search later
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'intelligence-assist-docs',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
    },
    // Color mode configuration for professional appearance
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;