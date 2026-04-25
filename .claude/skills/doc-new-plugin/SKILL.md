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

### 4. Edit `src/components/PluginDetails/index.tsx`

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
