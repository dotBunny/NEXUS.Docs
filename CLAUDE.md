# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a [Docusaurus 3](https://docusaurus.io/) static documentation site for the **NEXUS Framework** — a collection of Unreal Engine plugins by dotBunny. It is documentation-only; no plugin source code lives here. The site is deployed to GitHub Pages at https://nexus-framework.com.

## Commands

```bash
npm ci           # Install dependencies (Node 18+ required)
npm run start    # Start dev server with hot reload
npm run build    # Build static site to /build
npm run serve    # Serve the pre-built /build output locally
npm run typecheck  # TypeScript validation
npm run clear    # Clear Docusaurus cache (use when builds behave unexpectedly)
```

There are no tests in this repository.

## Architecture

### Content Structure
- `docs/` — Main plugin documentation. The sidebar is **auto-generated** from the filesystem via `sidebars.ts`.
- `community/` — Contributing guides, roadmap, coding standards, and changelog. Uses a manually-configured sidebar in `sidebarsCommunity.js`.
- `community/changelog.md` — **Do not edit manually.** It is fetched at build time from the main `dotBunny/NEXUS` repo via the `@docusaurus/plugin-content-pages` remote-content plugin configured in `docusaurus.config.ts`.

### Custom Components (`src/components/`)
Reusable TSX components used in `.mdx` files across docs:
- `PluginDetails` — Displays plugin metadata cards.
- `TypeDetails` — Renders type definition info blocks.
- `VersionBadge` — Shows version compatibility badges.
- Other components for image markup and structured content.

Import them in `.mdx` files directly; Docusaurus handles MDX compilation.

### Styling (`src/css/`)
11 CSS files scoped by feature (navigation, landing page, plugin display, version badges, dev banner, etc.). The site supports Docusaurus light/dark theming. Mermaid diagrams are also theme-aware.

### Key Config Files
- `docusaurus.config.ts` — Site metadata, navbar (plugin dropdown menus), footer, Google Analytics (`GA-988WNKTWNF`), Algolia search (`appId: D8GP244DEM`), remote-content plugin.
- `sidebars.ts` — Auto-sidebar for `docs/`.
- `sidebarsCommunity.js` — Explicit sidebar for `community/`.

### Deployment
CI/CD via `.github/workflows/build-deploy.yml` on push to `main`: `npm ci` → `npm run build` → GitHub Pages. Runs on a self-hosted runner with Node 20.

## Plugin Source Code
The actual plugin source code can be found locally in `../NEXUS/Plugins` or remotely from the git repository `https://github.com/dotBunny/NEXUS`.
