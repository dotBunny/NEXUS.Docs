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
  - **Page screenshots are never co-located with the page.** They live under `static/assets/images/docs/`, mirroring the page's path inside `docs/`, and are referenced by **absolute** URL. A screenshot for `docs/plugins/world-assembly/types/junction-component.md` lives at `static/assets/images/docs/plugins/world-assembly/types/<name>.webp` and is written `![Alt](/assets/images/docs/plugins/world-assembly/types/<name>.webp)`. Never write a relative image reference (`![Alt](foo.webp)`) — see below for why.
  - Plugin landing-card icons live at `static/assets/images/plugins/<slug>-icon.webp` and are referenced from the `Plugins` map's `icon` field. Note this is a *different* tree from the `docs/` mirror above — don't put page screenshots here.
  - Plugin-branded type/overlay SVGs live at `static/assets/svg/<slug>/<file>.svg` and are referenced from `<TypeDetails icon="/assets/svg/<slug>/<file>.svg" iconType="img" />`.
  - The shared type-icon vocabulary (`ue-object`, `ue-widget`, `ue-world-subsystem`, etc.) lives at `static/assets/svg/types/` — glob this folder before inventing a new icon key.

  **Why absolute:** the docs are versioned. `docusaurus docs:version` copies the whole `docs/` tree into `versioned_docs/version-<x>/`, so co-located images would be duplicated into every snapshot (~13 MB each) and relative paths would shift depth. Absolute paths into `static/` are stable across snapshots and shared by every version, which keeps a snapshot to ~1.1 MB of text. Docusaurus still webpack-processes these absolute refs, so images keep content-hashing, lazy-loading, and automatic `width`/`height`.

  **Consequence — images are NOT versioned.** `static/` is a single pool shared by every version, so replacing a screenshot changes it retroactively in every archived version. When a period-accurate screenshot actually matters, archive-on-change: copy the outgoing file to `static/assets/images/docs/_archive/<version>/<same path>`, repoint that one reference inside `versioned_docs/version-<version>/`, then overwrite the live file.

  **`onBrokenLinks: 'throw'` does not validate image sources** — a bad image path fails silently at build time and only shows up as a missing image in the browser. After bulk image work, verify refs resolve on disk rather than trusting a green build.
- **Per-plugin Developer Overlay pages** live at the plugin root (e.g. `docs/plugins/actor-pools/developer-overlay.md`), not inside `types/`. They subclass `UNDeveloperOverlay` and follow a shared structure — see existing overlays under actor-pools, dynamic-references, and guardian. The **abstract base `UNDeveloperOverlay` itself** is the exception: it is documented as a type page at [docs/plugins/ui/types/widgets/developer-overlay.md](docs/plugins/ui/types/widgets/developer-overlay.md) (it lives in the UI plugin) and subclasses `UCommonUserWidget`, not a stock `UUserWidget` — the UI plugin is built on CommonUI.
- **Macro headers are intentionally undocumented.** `*Macros.h` files in any plugin's `Public/Macros/` (or editor equivalents like `Public/Macros/NEditor*Macros.h`) are header-only convenience and not part of the public type surface. Do not scaffold pages for them — the doc-new-type skill should skip them, and any audit that lists them as "missing" is reporting policy, not a gap.

  **But a macro header can still hold behaviour worth documenting.** `Math/NRangeMacros.h` defines `FNRangeSampler`, whose scalar-type dispatch is what makes float/double range sampling half-open and integer sampling inclusive — a semantic difference every consumer needs. The rule is "no page for the macro header", not "the behaviour goes undocumented": explain it on the pages of the types that mix the macro in ([double-range.md](docs/plugins/core/types/math/double-range.md#sampler-dispatch) is the canonical write-up, with the other two ranges linking to it). Check a macro header for support types before assuming it is pure boilerplate.
- **Out of scope for a type page.** These are deliberate exclusions, not backlog. An audit listing them is reporting policy:
  - `*Macros.h`, plus **macro-only headers not named that way** (`NPickerUtils.h` is macros only — either rename it or treat it as one).
  - `*Minimal.h` (include aggregators) and `*Module.h` (module boot classes).
  - `*Style.h`, `*Commands.h`, `*GameplayTags.h` — near-identical per-plugin boilerplate. Core documents its own as the reference pattern; the other plugins' copies are skipped.
  - `*Tests` modules.
  - **Engine-contract overrides** — `OnRegister`, `Tick`, `IsTickable`, `PostEditChangeProperty`, `GetPaletteCategory`, `GetMouseCursor`, latent-command `Update`, PCG's `CreateElement`/`ExecuteInternal`. Their meaning comes from the base class; documenting them is noise.
  - World Assembly's pipeline internals, which are covered as prose under `docs/plugins/world-assembly/architecture/` rather than one page per header.
  - **Editor-type parity is settled, in favour of documenting them.** Visualizers, asset definitions, and factories *do* get pages — ActorPools and World Assembly both ship a full `editor-types/` tree (`visualizers/`, `asset-definitions/`, and the factory at the root). This resolves what was previously recorded as an open inconsistency: a plugin adding one of these should add the page too, not treat it as skipped boilerplate. `*Style.h` / `*Commands.h` / customizations remain excluded.
- **A property's edit scope belongs in the docs.** `EditInstanceOnly` and `EditDefaultsOnly` change where a user can set a value, and readers hit this repeatedly (bone `Socket Size`/`Type`/`Requirements`, kill-zone properties, the spawner's `Spline Component Name`). Say so in the settings table rather than leaving someone hunting for a field on a Blueprint default.
- **Verification loop**: `npm run audit:coverage` first — it is fast and catches far more than a build (see below). Then `npm run start` for fast iteration; reserve `npm run build` for catching MDX errors before pushing. Avoid `npm run build` during scaffolding — it is slow and the dev server surfaces the same errors.
- **`npm run audit:coverage`** checks the docs against the plugin source: code quoted in a page vs the header it cites, all three link mechanisms (`@see`, `UFUNCTION meta=(DocsURL=…)`, page-to-page) including `#anchors`, static asset refs, `@param` accuracy, headers with no page, and types with no doc comment. `scripts/coverage-baseline.json` records accepted state so the run exits non-zero only on *new* findings; `-- --update` re-snapshots it. `scripts/` needs no build exclusion — Docusaurus only scans `docs/`, `community/`, and `versioned_docs/`, and `tsc` ignores `.mjs`.

  It exists because name-level checks are not enough: a page can cite a real type and a real header and still describe neither correctly. Treat its raw counts as a triage queue, not a findings list — roughly two-thirds of "missing function" hits are false positives (locals in inline bodies, cross-class calls, display-name headings, engine overrides). The `doc-audit` skill documents each class.

### Type-folder layout

`types/` and `editor-types/` mirror the source's `Public/` layout. When the source organizes headers into subfolders (`Public/Math/`, `Public/Components/`, `Public/Widgets/`, `Public/Developer/`, `Public/Collections/`, `Public/Types/`, `Public/ComponentVisProxies/`, `Public/DelayedEditorTasks/`, …), the docs mirror that structure under `types/<subfolder>/` or `editor-types/<subfolder>/`. Top-level headers (those directly under `Public/`) keep their pages at the root of `types/` or `editor-types/`.

Each subfolder needs its own `index.mdx` describing the group — see [docs/plugins/core/types/math/index.mdx](docs/plugins/core/types/math/index.mdx) for the canonical shape. The `Plugins` map's `link` field still points at the plugin root; subfolders are never surfaced there.

### Component imports always use `@site`

Import components from `src/components/` via the **`@site` alias**, never a relative path:

```mdx
import TypeDetails from '@site/src/components/TypeDetails';
```

`@site` resolves to the project root from any file depth, so the same line is correct in `types/foo.md`, `types/<subfolder>/foo.md`, and inside a `versioned_docs/version-<x>/` snapshot. Relative imports (`../../../../src/components/…`) are **broken by versioning**: snapshotting shifts every page one directory deeper, so a path that resolved to the repo root from `docs/` resolves to `versioned_docs/` instead, and the build fails with "Module not found".

Note this applies to **component imports only**. Cross-page markdown *links* stay relative (`[Other Type](../other-type.md)`, `[Plugin](../../<other-plugin>/index.mdx)`) — source and target move together inside a snapshot, so those keep working.

## Versioning

Docs are versioned; `community/` is not. `versions.json` lists archived versions newest-first, and `docusaurus.config.ts` derives `lastVersion` from it, so the newest archive is served at `/docs/` and unreleased work on main is served at `/docs/dev/` under the label `main 🚧`.

### Cutting a release

```bash
npm run docusaurus docs:version <x.y.z>   # snapshot docs/ -> versioned_docs/version-<x.y.z>/
npm run build                             # verify
```

`lastVersion` updates itself from `versions.json`; nothing in the config needs editing.

### What this means when writing docs

- **Editing `docs/` only changes `/docs/dev/`.** Released versions are frozen copies in `versioned_docs/`. To correct an error in a shipped version you must edit that snapshot directly.
- **A snapshot is text-only (~1.2 MB).** Images live in `static/` and are shared by every version — see the static-asset conventions above, including the archive-on-change recipe when a screenshot must stay period-accurate.
- **Never use relative component imports** (see `@site` above) — this is the one thing that silently breaks every future snapshot.
- **Navbar plugin links use `type: 'doc'` + `docId`**, not raw `to:` paths, so a reader stays inside the version they're browsing. docIds keep the trailing `/index` (e.g. `plugins/core/index`). Adding a plugin means adding a `docId` entry, not a URL.
- **`onlyIncludeVersions` is dev-only** and derived from `versions.json`; production builds always contain every version.
- **Algolia `contextualSearch` is on**, which scopes results to the active version. It depends on the crawler emitting version facets — that is configured at algolia.com, not in this repo.

## Documentation Skills

Three skills cover doc work — invoke them by user prompt rather than working from scratch:

- `doc-new-plugin` — scaffolds the `docs/plugins/<slug>/` folder, `index.mdx`, `types/index.mdx`, optional `editor-types/index.mdx`, optional `developer-overlay.md`, and the `Plugins` map entry in `PluginDetails/index.tsx`.
- `doc-new-type` — scaffolds a single type page from a header file, choosing the appropriate body shape (default / wrapper UObject / list-view entry / async action / subsystem) based on the engine base class.
- `doc-audit` — verifies existing pages against the source and repairs drift. Read it before trusting `npm run audit:coverage` output, and for the housekeeping every doc edit needs (versioned-snapshot sync, `@see` backlink, `DocsURL` meta, baseline update).

**Writing or fixing a page is not finished when the file is saved.** `docs/` only serves `/docs/dev/`; `versioned_docs/version-<x>/` is a separate copy that does not inherit fixes, so a correction usually means editing both. A header that gains a page needs its `@see` backlink, and a `UFUNCTION` whose page gains a section can take a `DocsURL`. `doc-audit` has the full checklist.
