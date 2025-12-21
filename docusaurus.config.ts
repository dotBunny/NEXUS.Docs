import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type { Options as DocsOptions } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NEXUS Framework',
  tagline: 'A battle-tested collection of game-ready plugins for Unreal Engine.',
  favicon: 'assets/favicon/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://nexus-framework.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dotBunny', // Usually your GitHub org/user name.
  projectName: 'NEXUS.Docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw'
    }
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          showLastUpdateTime: true,
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dotBunny/NEXUS.Docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: [
            './src/css/base.css',
            './src/css/nav.css',
            './src/css/lander.css',
            './src/css/category.css',
            './src/css/type-details.css',
            './src/css/type-definitions.css',
            './src/css/plugin-details.css',
            './src/css/version-badge.css',
            './src/css/dev-banner.css',
            './src/css/responsive.css'
          ]
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    docs: {
      sidebar: {
        hideable: true
      },
    },

    // Replace with your project's social card
    image: 'assets/images/social/social-square.png',
    navbar: {
      title: 'EXUS Framework',
      logo: {
        alt: 'NEXUS Framework Logo',
        src: 'assets/svg/nexus.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs'
        },
        {
          to: '/community/contributing/',
          position: 'left',
          label: 'Community',
          activeBaseRegex: `/community/`
        },
        {
          href: 'https://github.com/dotBunny/NEXUS/issues/new/choose',
          label: 'Report Issue',
          position: 'right',
        },
        {
          label: 'NEXUS Plugins',
          to: "/docs/plugins/",
          className: 'plugin-menu plugin-menu-base'
        },
        {
          to: '/docs/plugins/core',
          label: 'Core',
          className: 'plugin-menu'
        },
        {
          to: '/docs/plugins/actor-pools',
          label: 'Actor Pools',
          className: 'plugin-menu'
        },
        {
          to: '/docs/plugins/blockout',
          label: 'Blockout',
          className: 'plugin-menu'
        },
        {
          to: '/docs/plugins/dynamic-references',
          label: 'Dynamic References',
          className: 'plugin-menu'
        },
        {
          to: '/docs/plugins/fixers',
          label: 'Fixers',
          className: 'plugin-menu'
        },
        {
          to: '/docs/plugins/multiplayer',
          label: 'Multiplayer',
          className: 'plugin-menu'
        },
        {
          to: '/docs/plugins/picker',
          label: 'Picker',
          className: 'plugin-menu'
        },
        {
          to: '/docs/plugins/ui',
          label: 'User Interface',
          className: 'plugin-menu'
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/',
            },
            {
              label: 'Contributing',
              to: '/community/contributing/',
            },
          ],
        },
        {
          title: 'GitHub',
          items: [
            {
              label: 'Roadmap',
              href: 'https://github.com/orgs/dotBunny/projects/6/views/2',
            },
            {
              label: 'Issues',
              href: 'https://github.com/orgs/dotBunny/projects/6/views/3',
            },

          ],
        },
        {
          title: 'Extras',
          items: [
            {
              to: 'https://discord.gg/2M9HczHanW',
              label: 'Discord',
            },
            {
              to: '/license',
              label: 'License',
            },
            {
              to: '/docs/tags',
              label: 'Tags',

            },
          ],
        },
      ],
      copyright: `<a class="muted" href="https://dotbunny.com">&copy; dotBunny</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: 'D8GP244DEM',
      apiKey: 'bd75718f03cda407bf3d9fb59f637d96',
      indexName: 'nexus_framework_com_d8gp244dem_articles',
      contextualSearch: false,
      searchPagePath: 'search',
    },

    markdown: {
      mermaid: true,
    },

  } satisfies Preset.ThemeConfig,
  plugins: [
    [
      'content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        editCurrentVersion: false,
        sidebarPath: './sidebarsCommunity.js',
      } satisfies DocsOptions,
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "changelog",
        sourceBaseUrl: "https://raw.githubusercontent.com/dotBunny/NEXUS/refs/heads/main/",
        outDir: "community",
        documents: ["CHANGELOG.md"],
        modifyContent(filename, content) {
          if (filename.includes("CHANGELOG")) {
            return {
              filename: "changelog.md",
              content: `---
title: Changelog (Main)
description: A semantic versioned changelog.
hide_table_of_contents: false
sidebar_position: 4
---

${content}`
            }
          }
          return undefined
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "changelog-dev",
        sourceBaseUrl: "https://raw.githubusercontent.com/dotBunny/NEXUS/refs/heads/dev/",
        outDir: "community",
        documents: ["CHANGELOG.md"],
        modifyContent(filename, content) {
          if (filename.includes("CHANGELOG")) {
            return {
              filename: "changelog-dev.md",
              content: `---
title: Changelog (Dev)
description: A semantic versioned changelog.
hide_table_of_contents: false
sidebar_position: 5
---

${content}`
            }
          }
          return undefined
        },
      },
    ],
  ]
};

export default config;
