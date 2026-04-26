---
name: doc-new-plugin
description: Scaffold the docs folder, index.mdx, types/ and (if applicable) editor-types/ subfolders for a new NEXUS plugin under docs/plugins/<slug>/, plus the required Plugins map entry in src/components/PluginDetails/index.tsx. Use when the user asks to "document a new plugin", "scaffold docs for <PluginName>", or points you at a new folder under ../NEXUS/Plugins.
---

# doc-new-plugin

Stand up the documentation skeleton for a brand-new NEXUS plugin so the user can immediately start writing prose. Mirrors the existing structure of plugins like `actor-pools/` and `guardian/`.

## Inputs you need

1. **Plugin source folder** — `../NEXUS/Plugins/<PluginName>/` containing a `.uplugin` file. If the user gave you a name only, glob to find it.
2. **Docs slug** — the URL path component (e.g. `actor-pools`, `procedural-generation`). Slugs are NOT mechanical:
   - `NexusActorPools` → `actor-pools`
   - `NexusDynamicRefs` → `dynamic-references`
   - `NexusProcGen` → `procedural-generation`
   - `NexusUserInterface` → `ui`
   - Most others lowercase + kebab-case the FriendlyName suffix.
   Ask the user to confirm the slug before creating files.
3. **`shortName`** for the `Plugins` map entry — the `N*` shorthand (e.g. `NActorPools`, `NGuardian`). Ask if not obvious.
4. **`category`** — one of the values already used in `PluginDetails/index.tsx` (`Systems`, `Helpers`, `Content`, `Editor`, `N/A`). Ask.
5. **`blueprintCategory`** — string like `"NEXUS > Actor Pools"` or empty `""` if the plugin has no Blueprint surface. Ask.

## What to read from the `.uplugin`

- `VersionName` → `initialRelease` for the Plugins map entry.
- `FriendlyName` → strip `NEXUS: ` prefix to get the page H1 (e.g. `NEXUS: Core` → `Core`).
- `Description` → both the `description` frontmatter and the Plugins map `description` field.
- `Modules[].Name` → the runtime module's `Name` (the one with `Type: Runtime`) is the `moduleName` for the Plugins map entry.
- `Modules` containing an `Editor`-typed module → flag that you need to scaffold an `editor-types/` folder too.

## Files to create

### 1. `docs/plugins/<slug>/index.mdx`

```mdx
---
description: <Description from .uplugin>
sidebar_position: <next integer — read existing docs/plugins/*/index.mdx files, take max sidebar_position + 1>
---

import DocCardList from '@theme/DocCardList';
import PluginDetails from '../../../src/components/PluginDetails';

# <Friendly name without "NEXUS: " prefix>

<PluginDetails moduleName="<Runtime module name>" />

<TODO: 1-2 paragraph overview of what the plugin does and when to use it.>

## Samples

<TODO: Describe sample maps if any, otherwise remove this section.>
```

### 2. `docs/plugins/<slug>/types/index.mdx`

```mdx
---
description: Some of the runtime types added by <ShortName>.
sidebar_position: 1
---

import DocCardList from '@theme/DocCardList';

# Types

Some of the runtime types added by <ShortName>.

<DocCardList />
```

### 3. (Only if the plugin has an Editor module) `docs/plugins/<slug>/editor-types/index.mdx`

Same as `types/index.mdx` but with `sidebar_position: 2` and `editor types added by <ShortName>` wording — match phrasing in [docs/plugins/core/editor-types/index.mdx](docs/plugins/core/editor-types/index.mdx).

### 4. (Optional) Subfolder `index.mdx` files

If the plugin's `Public/` directory organizes headers into subfolders (e.g. `Public/Math/`, `Public/Components/`, `Public/Widgets/`, `Public/Developer/`, `Public/Collections/`, `Public/Types/`), the docs mirror that layout — `types/<subfolder>/` for each one, plus `editor-types/<subfolder>/` for any editor-side subfolders. Glob the source first to see what subfolders exist; create an `index.mdx` for each that has at least one header you'll be documenting.

```mdx
---
description: <one-line summary of what this group contains>
sidebar_position: <alpha order — see Sidebar ordering below>
---

import DocCardList from '@theme/DocCardList';

# <Title Case Folder Name>

<One-paragraph lead>. Mirrors the layout of `<Module>/Public/<Subfolder>/`.

<DocCardList />
```

**Sidebar ordering inside `types/` and `editor-types/`**: subfolders sort first (alphabetical among themselves), then at-level pages. Concretely, if `types/` will have `N` subfolders, their `index.mdx` files take positions `1..N` (alpha), and any at-level `.md` files start at `N+1`. Adding a new subfolder later means bumping every at-level page's `sidebar_position` by one. See [CLAUDE.md](CLAUDE.md) Sidebar ordering for the full rule. For canonical subfolder shapes see [docs/plugins/core/types/math/index.mdx](docs/plugins/core/types/math/index.mdx) and [docs/plugins/ui/types/components/index.mdx](docs/plugins/ui/types/components/index.mdx).

You can defer subfolder creation to `doc-new-type` — it knows how to scaffold a new subfolder on demand when the first type belonging in one is added.

### 5. Edit `src/components/PluginDetails/index.tsx`

Insert a new entry into the `Plugins` map. Place it alphabetically by key among the existing entries. Required fields, all from the inputs above:

```ts
"<RuntimeModuleName>": {
  icon: "/assets/images/plugins/<slug>-icon.webp",
  moduleName: "<RuntimeModuleName>",
  shortName: "<NShortName>",
  category: "<Category>",
  initialRelease: "<VersionName from .uplugin>",
  owner: "reapazor",
  description: "<Description from .uplugin>",
  link: "/docs/plugins/<slug>/",
  blueprintCategory: "<Blueprint category or empty>"
},
```

The icon file at `static/assets/images/plugins/<slug>-icon.webp` is **the user's responsibility** — flag in your final report that they need to add it (or copy a placeholder) before the page renders correctly.

## Optional — Developer Overlay page

If the plugin ships a developer overlay (a `UN<Plugin>DeveloperOverlay` class deriving from `UNDeveloperOverlay`, surfaced via `Tools > NEXUS > <PluginName>` in the editor), scaffold a page at the **plugin root** — NOT inside `types/`. Existing examples:
- [docs/plugins/actor-pools/developer-overlay.md](docs/plugins/actor-pools/developer-overlay.md)
- [docs/plugins/dynamic-references/developer-overlay.md](docs/plugins/dynamic-references/developer-overlay.md)
- [docs/plugins/guardian/developer-overlay.md](docs/plugins/guardian/developer-overlay.md)

### File: `docs/plugins/<slug>/developer-overlay.md`

```markdown
---
sidebar_label: Developer Overlay
sidebar_position: 3
description: <one-sentence summary of what the overlay shows>
---

import TypeDetails from '../../../src/components/TypeDetails';

# Developer Overlay

<TypeDetails icon="/assets/svg/<slug>/<icon>.svg" iconType="img" base="UNDeveloperOverlay" type="UN<Plugin>DeveloperOverlay" typeExtra="" headerFile="Nexus<Plugin>/Public/N<Plugin>DeveloperOverlay.h" />

By going to `Tools > NEXUS > <PluginName>`, you can create an [UNEditorUtilityWidget](/docs/plugins/ui/editor-types/editor-utility-widget/) wrapped version of `/Nexus<Plugin>/WB_N<Plugin>DeveloperOverlay` which will <TODO: short description of what it shows>.

<div class="image-split">
![No <Things>](<slug>-developer-overlay-none.webp)
![<Things>](<slug>-developer-overlay.webp)
</div>

<TODO: Layout, color states, behavior sections — see the existing overlays for shape.>
```

### Conventions

- `base="UNDeveloperOverlay"` — overlays subclass the NEXUS abstract, not a stock Unreal class.
- `icon` is the **custom plugin SVG** (`iconType="img"` form), not a `ue-*` icon class. If the plugin doesn't have a branded SVG yet, use `icon="ue-widget"` (no `iconType`) as a fallback and flag in the report that the user should add a branded SVG to `static/assets/svg/<slug>/`.
- The two screenshots (`<slug>-developer-overlay-none.webp` and `<slug>-developer-overlay.webp`) are the user's responsibility — flag them as TODOs.
- Common follow-on sections seen across the existing three overlays: `## What It Shows` (table), `## Layout`, `## Color States` (table), `## Idle vs. Runtime`, `## Click Handling`, `## Tooltips`, `## Editor-Only Features`. Pick what applies; don't include empty sections.
- Most overlays also document a list-view entry widget and a `UObject` wrapper as separate type pages under `types/` — those go through `doc-new-type` separately.

## What NOT to do

- Don't add the plugin to any sidebar config — `docs/` sidebar is auto-generated.
- Don't add a navbar dropdown entry in `docusaurus.config.ts` unless asked. Most plugins are reachable via the auto-sidebar; the navbar is curated.
- Don't write any type pages in this skill — that's `doc-new-type`. Just create the empty `types/` (and possibly `editor-types/`) shells.
- Don't run `npm run build` — let the user verify with `npm run start`.
- Don't fill in the TODO prose. Leaving explicit `<TODO: ...>` markers is more useful than fabricated content the user has to rewrite.

## When done

Report:
- Slug used and confirmation it matches the user's expectation.
- All files created (paths).
- The `Plugins` map entry that was added (and where alphabetically).
- A reminder that the user must drop `<slug>-icon.webp` into `static/assets/images/plugins/`.
- Whether an `editor-types/` folder was scaffolded and why (based on `.uplugin` modules).
