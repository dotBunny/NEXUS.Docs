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
  onBrokenMarkdownLinks: 'throw',

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
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dotBunny/NEXUS.Docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
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
          sidebarId: 'defaultSidebar',
          position: 'left',
          label: 'Docs',
          className: 'header-docs-link'
        },
        {
          to: '/community/contributing/',
          position: 'left',
          label: 'Community',
          activeBaseRegex: `/community/`,
          className: 'header-community-link',
        },
        {
          href: 'https://github.com/dotBunny/NEXUS/issues/new/choose',
          label: 'Report Issue',
          position: 'right',
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
              to: '/docs/category/getting-started/',
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
              to: '/license',
              label: 'License',

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
      // The application ID provided by Algolia
      appId: 'D8GP244DEM',

      // Public API key: it is safe to commit it
      apiKey: 'bd75718f03cda407bf3d9fb59f637d96',

      indexName: 'nexus_framework_com_d8gp244dem_articles',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
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
sidebar_position: 3
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
sidebar_position: 4
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
