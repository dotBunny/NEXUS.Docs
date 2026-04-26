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
The actual plugin source code can be found locally in `../NEXUS/Plugins` or remotely from the git repository `https://github.com/dotBunny/NEXUS`. **This is the source of truth for type pages** — when documenting a `UCLASS` / `USTRUCT` / `UINTERFACE` / `UENUM`, read the actual header (`Source/<Module>/Public/*.h`) and matching `.uplugin`. Do not invent API shapes, method signatures, or version numbers.

## Conventions

- **Type pages are `.md`, not `.mdx`** — even though they import the `TypeDetails` component. Docusaurus handles MDX-in-Markdown for these. Plugin landing pages (`index.mdx`) and folder index pages (`types/index.mdx`, `editor-types/index.mdx`, and any subfolder `index.mdx`) are the exceptions.
- **`src/components/PluginDetails/index.tsx`** holds the canonical `Plugins` map — every plugin documented in `docs/plugins/<slug>/` must have a matching entry keyed by its runtime module name (e.g. `"NexusActorPools"`). Adding or renaming a plugin requires editing this file.
- **Static asset paths**:
  - Plugin landing-card icons live at `static/assets/images/plugins/<slug>-icon.webp` and are referenced from the `Plugins` map's `icon` field.
  - Plugin-branded type/overlay SVGs live at `static/assets/svg/<slug>/<file>.svg` and are referenced from `<TypeDetails icon="/assets/svg/<slug>/<file>.svg" iconType="img" />`.
  - The shared type-icon vocabulary (`ue-object`, `ue-widget`, `ue-world-subsystem`, etc.) lives at `static/assets/svg/types/` — glob this folder before inventing a new icon key.
- **Per-plugin Developer Overlay pages** live at the plugin root (e.g. `docs/plugins/actor-pools/developer-overlay.md`), not inside `types/`. They subclass `UNDeveloperOverlay` and follow a shared structure — see existing overlays under actor-pools, dynamic-references, and guardian.
- **Verification loop**: `npm run start` for fast iteration; reserve `npm run build` for catching link/MDX errors before pushing. Avoid `npm run build` during scaffolding — it is slow and the dev server surfaces the same errors.

### Type-folder layout

`types/` and `editor-types/` mirror the source's `Public/` layout. When the source organizes headers into subfolders (`Public/Math/`, `Public/Components/`, `Public/Widgets/`, `Public/Developer/`, `Public/Collections/`, `Public/Types/`, `Public/ComponentVisProxies/`, `Public/DelayedEditorTasks/`, …), the docs mirror that structure under `types/<subfolder>/` or `editor-types/<subfolder>/`. Top-level headers (those directly under `Public/`) keep their pages at the root of `types/` or `editor-types/`.

Each subfolder needs its own `index.mdx` describing the group — see [docs/plugins/core/types/math/index.mdx](docs/plugins/core/types/math/index.mdx) for the canonical shape. The `Plugins` map's `link` field still points at the plugin root; subfolders are never surfaced there.

### Sidebar ordering

The auto-generated sidebar sorts items by `sidebar_position` ascending. Within any folder containing both subfolders and at-level pages, **subfolders appear first, alphabetical among themselves, then at-level pages in their existing order**. Concretely:

- Each subfolder's `index.mdx` uses `sidebar_position: 1..N` where `N` is the number of subfolders, ordered alphabetically by folder name.
- At-level `.md` files use `sidebar_position` starting at `N+1`.
- Adding a new subfolder requires bumping every at-level page's `sidebar_position` by one.
- Files with no `sidebar_position` sort last by filename — leave them alone unless they need to be reordered.

### Import-path depth in subfolders

A type page's `TypeDetails` import is relative to `src/components/`, so the `../` count depends on depth:

- `types/foo.md` → `../../../../src/components/TypeDetails` (4-deep)
- `types/<subfolder>/foo.md` → `../../../../../src/components/TypeDetails` (5-deep)

Same rule applies to `VersionBadge` and any other `src/components/` import. Cross-plugin links (`../../<other-plugin>/index.mdx`) likewise gain an extra `../` from a subfolder, becoming `../../../<other-plugin>/index.mdx`.

## Documentation Skills

Two skills automate doc scaffolding — invoke them by user prompt rather than writing pages from scratch:

- `doc-new-plugin` — scaffolds the `docs/plugins/<slug>/` folder, `index.mdx`, `types/index.mdx`, optional `editor-types/index.mdx`, optional `developer-overlay.md`, and the `Plugins` map entry in `PluginDetails/index.tsx`.
- `doc-new-type` — scaffolds a single type page from a header file, choosing the appropriate body shape (default / wrapper UObject / list-view entry / async action / subsystem) based on the engine base class.
