import { readFileSync } from 'fs';
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type { Options as DocsOptions } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Archived doc versions, newest first. Written by `npm run docusaurus docs:version <x>`.
// Tolerates the file being absent or empty, which is the valid "no releases archived
// yet" state you land in after removing a version (see Versioning in README.md).
const DOC_VERSIONS: string[] = (() => {
  try {
    return JSON.parse(readFileSync('./versions.json', 'utf8'));
  } catch {
    return [];
  }
})();

// The newest archived version becomes the default served at /docs/. When nothing is
// archived this stays undefined, which Docusaurus reads as "current is the default",
// so /docs/ serves the in-development docs and /docs/dev/ is not generated.
const LAST_VERSION = DOC_VERSIONS[0];

// Building every archived version on each hot reload gets slow as the archive grows,
// so in development we build only `current` plus the newest archive. Production is
// left undefined so a release build always contains the complete set. Filtering keeps
// this valid when there is nothing archived yet.
const DEV_ONLY_VERSIONS =
  process.env.NODE_ENV === 'development'
    ? ['current', LAST_VERSION].filter(Boolean)
    : undefined;

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
  // For Cloudflare pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: true,

  // Cloudflare pages deployment config.
  organizationName: 'dotBunny',
  projectName: 'NEXUS.Docs',
  onBrokenLinks: 'throw',


  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true
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

          // The newest released version, served at /docs/ as the default.
          // Bump this each time a new version is cut.
          lastVersion: LAST_VERSION,

          versions: {
            // Unreleased work on main, served at /docs/dev/.
            current: {
              label: 'main 🚧',
              path: 'dev',
            },
          },

          // Dev-only: build just the two newest versions so `npm run start` stays
          // fast as the archive grows. Derived from versions.json so it cannot go
          // stale, and always undefined in production so a release build is complete.
          onlyIncludeVersions: DEV_ONLY_VERSIONS,
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
            './src/css/plugin-image-markup.css',
            './src/css/responsive.css'
          ]
        },
        gtag: {
          trackingID: 'G-988WNKTWNF',
          anonymizeIP: true
        }
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },
    docs: {
      sidebar: {
        hideable: true
      },
    },
    mermaid: {
      theme: {
        light: 'neutral',
        dark: 'dark'
      },
      // options: { ... mermaid.js options }
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
          to: '/community/discord/',
          position: 'left',
          label: 'Community',
          activeBaseRegex: `/community/`
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: 'https://github.com/dotBunny/NEXUS/issues/new/choose',
          label: 'Report Issue',
          position: 'right',
        },
        // Plugin dropdown. These use `type: 'doc'` rather than raw `to:` paths so a
        // reader browsing an older version (or /docs/dev/) stays inside that version
        // when they jump between plugins. docIds keep the trailing `/index`.
        {
          type: 'doc',
          docId: 'plugins/index',
          label: 'NEXUS Plugins',
          className: 'plugin-menu plugin-menu-base'
        },
        {
          type: 'doc',
          docId: 'plugins/core/index',
          label: 'Core',
          className: 'plugin-menu'
        },
        {
          type: 'doc',
          docId: 'plugins/actor-pools/index',
          label: 'Actor Pools',
          className: 'plugin-menu'
        },
        {
          type: 'doc',
          docId: 'plugins/blockout/index',
          label: 'Blockout',
          className: 'plugin-menu'
        },
        {
          type: 'doc',
          docId: 'plugins/dynamic-references/index',
          label: 'Dynamic References',
          className: 'plugin-menu'
        },
        {
          type: 'doc',
          docId: 'plugins/guardian/index',
          label: 'Guardian',
          className: 'plugin-menu'
        },
        {
          type: 'doc',
          docId: 'plugins/picker/index',
          label: 'Picker',
          className: 'plugin-menu'
        },
        {
          type: 'doc',
          docId: 'plugins/tooling/index',
          label: 'Tooling',
          className: 'plugin-menu'
        },
        {
          type: 'doc',
          docId: 'plugins/ui/index',
          label: 'User Interface',
          className: 'plugin-menu'
        },
        {
          type: 'doc',
          docId: 'plugins/world-assembly/index',
          label: 'World Assembly 🚧',
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
            {
              label: 'Changelog',
              to: '/community/changelog/',
            }
          ],
        },
        {
          title: 'GitHub',
          items: [
            {
              label: 'Milestones',
              href: 'https://github.com/dotBunny/NEXUS/milestones?sort=due_date&direction=asc'
            },
            {
              label: 'Roadmap',
              href: 'https://github.com/orgs/dotBunny/projects/6/views/2',
            },
            {
              label: 'Issues',
              href: 'https://github.com/orgs/dotBunny/projects/6/views/3',
            }
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
              to: 'https://dotbunny.com/dethol/',
              label: 'DETHOL',
            },
          ],
        },
        {
          title: 'Static Analysis',
          items: [
            {
              html: '<a href="https://sonarcloud.io/summary/overall?id=dotBunny_NEXUS&branch=main"><img src="https://sonarcloud.io/api/project_badges/measure?project=dotBunny_NEXUS&metric=alert_status" alt="Quality Gate" /></a>',
            },
            {
              html: '<a href="https://sonarcloud.io/summary/overall?id=dotBunny_NEXUS&branch=main"><img src="https://sonarcloud.io/api/project_badges/measure?project=dotBunny_NEXUS&metric=code_smells" alt="Code Smells" /></a>',
            },
            {
              html: '<a href="https://sonarcloud.io/summary/overall?id=dotBunny_NEXUS&branch=main"><img src="https://sonarcloud.io/api/project_badges/measure?project=dotBunny_NEXUS&metric=sqale_rating" alt="Maintainability" /></a>',
            },
            {
              html: '<a href="https://sonarcloud.io/summary/new_code?id=dotBunny_NEXUS&branch=main"><img src="https://sonarcloud.io/api/project_badges/measure?project=dotBunny_NEXUS&metric=ncloc" alt="Lines Of Code" /></a>',
            }
          ]
        }
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
      // Required now that docs are versioned: scopes results to the version the
      // reader is currently browsing. With this false, a search from /docs/ would
      // return hits from /docs/dev/ and every archived version, mixed together.
      // NOTE: this only works once the Algolia crawler is emitting version facets
      // (docusaurus_tag / docusaurus_version) — that is configured at algolia.com,
      // not here. Until the index is re-crawled, results may look sparse.
      contextualSearch: true,
      searchPagePath: 'search',
    }
  } satisfies Preset.ThemeConfig,
  plugins: [
    function silenceMermaidUmdWarning() {
      return {
        name: 'silence-mermaid-umd-warning',
        configureWebpack() {
          return {
            ignoreWarnings: [
              {
                module: /vscode-languageserver-types[\\/]lib[\\/]umd[\\/]main\.js$/,
                message: /Critical dependency: require function is used/,
              },
            ],
          };
        },
      };
    },
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
title: Changelog
description: A semantic versioned changelog.
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 2
---

${content}`
            }
          }
          return undefined
        },
      },
    ]
  ]
};

export default config;
