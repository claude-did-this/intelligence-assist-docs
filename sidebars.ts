import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Projects',
      items: [
        'projects/overview',
        'projects/claude-hub',
      ],
    },
  ],
};

export default sidebars;