import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  claudeHubSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'configuration/environment-variables',
        'configuration/aws-setup',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/auto-tagging',
        'features/pr-reviews',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/webhooks',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/common-issues',
      ],
    },
  ],
};

export default sidebars;