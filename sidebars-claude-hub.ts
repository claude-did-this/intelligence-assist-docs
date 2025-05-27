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
  ],
};

export default sidebars;