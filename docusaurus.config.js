// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
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
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dotBunny/NEXUS.Docs/tree/main/docusaurus/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      respectPrefersColorScheme: true,

      // Replace with your project's social card
      image: 'assets/images/social/social-square.png',
      navbar: {
        title: 'NEXUS Framework',
        logo: {
          alt: 'NEXUS Framework Logo',
          src: 'assets/svg/nexus.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/docs/contributing', 
            label: 'Contributing', 
            position: 'left'
          },
          {
            to: '/docs/license', 
            label: 'License', 
            position: 'left'
          },
          {
            to: '/docs/changelog', 
            label: 'Changelog', 
            position: 'left'
          },
          {
            href: 'https://github.com/dotBunny/NEXUS',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://github.com/dotBunny/NEXUS/issues/new/choose',
            label: 'Report A Bug',
            position: 'right',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/category/getting-started/',
              },
            ],
          },
          {
            title: 'Project',
            items: [
              {
                label: 'Agile Board',
                href: 'https://github.com/orgs/dotBunny/projects/6/views/1',
              },
              {
                label: 'Roadmap',
                href: 'https://github.com/orgs/dotBunny/projects/6/views/2',
              },
              {
                label: 'Issues',
                href: 'https://github.com/orgs/dotBunny/projects/6/views/3',
              },
              {
                label: 'Bugs',
                href: 'https://github.com/orgs/dotBunny/projects/6/views/9',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/dotBunny/NEXUS',
              },
              {
                label: 'Report A Bug',
                href: 'https://github.com/dotBunny/NEXUS/issues/new/choose',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} dotBunny Inc.`,
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

    }),
};

export default config;