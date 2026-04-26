---
name: doc-new-type
description: Scaffold a new NEXUS type documentation page (.md) under docs/plugins/<plugin>/types/ or editor-types/ from a UCLASS / USTRUCT / UINTERFACE / UENUM header in ../NEXUS/Plugins. Use whenever the user asks to "document a type", "add a type page", "create docs for <TypeName>", or hands you a header path/symbol from the NEXUS source tree.
---

# doc-new-type

Generate a single type page that matches the project's existing convention. The output is one `.md` file (NOT `.mdx`) placed next to `index.mdx` in the appropriate `types/` or `editor-types/` folder.

## Inputs you need

Ask the user only for what you cannot infer:

1. **Header path** under `../NEXUS/Plugins/<Plugin>/Source/...` (or a symbol name to grep for).
2. **Plugin slug** — derive from the header's plugin folder, then resolve via `src/components/PluginDetails/index.tsx` (`link` field). Slugs are NOT mechanical — `NexusProcGen` → `procedural-generation`, `NexusDynamicRefs` → `dynamic-references`, `NexusUserInterface` → `ui`. If unsure, ask.
3. **Runtime vs editor** — if the module name ends in `Editor` or the header lives under an `Editor` module, target `editor-types/`; otherwise `types/`.
4. **Subfolder** — `types/` and `editor-types/` mirror the source `Public/` layout. If the header lives in a `Public/<Subfolder>/` (e.g. `Public/Math/`, `Public/Components/`, `Public/Widgets/`, `Public/Developer/`, `Public/Collections/`, `Public/Types/`, `Public/ComponentVisProxies/`, `Public/DelayedEditorTasks/`), the page goes in the matching `types/<subfolder>/` or `editor-types/<subfolder>/` folder. Top-level headers (directly under `Public/`) go at the folder root. If the matching subfolder doesn't exist yet, create it (lower-case the source folder name) and scaffold its `index.mdx` — see [docs/plugins/core/types/math/index.mdx](docs/plugins/core/types/math/index.mdx) for the shape.

Everything else comes from the header.

## What to extract from the header

- **`base`** — the engine class/struct the documented type derives from, written exactly as it appears in the header (e.g. `UObject`, `UTickableWorldSubsystem`, `UWorldSubsystem`, `UUserWidget`, `UBlueprintAsyncActionBase`, `AActor`, `UActorComponent`). For `USTRUCT` use `struct`, for `UENUM` use `enum`, for `UINTERFACE` use `interface`. The base may also be a NEXUS abstract (`UNDeveloperOverlay`) when the type subclasses one.
- **Primary type name** — the symbol on the line after the macro (e.g. `class NEXUSACTORPOOLS_API INActorPoolItem` → `INActorPoolItem`).
- **`typeExtra`** — for interfaces, the `U*` companion class (`/ UNActorPoolItem`). For others, leave empty (`""`) unless there's a meaningful pair.
- **`headerFile`** — relative path from the module's `Source/` folder, e.g. `NexusActorPools/Public/INActorPoolItem.h`.
- **`description`** — the first sentence of the doxygen comment immediately above the macro. If none, ask.
- **Initial-release version for `tags`** — read the plugin's `.uplugin` `VersionName` if the type is brand-new, OR ask the user. Do not invent a version.

## Icon and `sidebar_class_name`

`sidebar_class_name` is `type <icon-key>`. The `icon-key` should match a file in `static/assets/svg/types/` and is keyed off the **engine base class**, not the reflection macro. The set is constrained — glob `static/assets/svg/types/*.svg` to confirm a key exists before using it. Common mappings:

| Base class | Icon key |
| :-- | :-- |
| `UObject` (plain wrapper, async action, etc.) | `ue-object` |
| `UTickableWorldSubsystem`, `UWorldSubsystem` | `ue-world-subsystem` |
| `UUserWidget` | `ue-widget` |
| `AActor` | `ue-actor` |
| `APawn` | `ue-pawn` |
| `UActorComponent` | `ue-actor-component` |
| `USceneComponent` | `ue-scene-component` |
| `UDataAsset` | `ue-data-asset` |
| `UBlueprintFunctionLibrary` | `ue-blueprint-function-library` |
| `UDeveloperSettings` | `ue-settings` |
| `IInterface` | `ue-interface` |
| `UENUM` | `ue-enum` |
| `USTRUCT` | `native-struct` |
| Plain C++ class (no UCLASS) | `native-class` / `native-cpp` |

The `<TypeDetails icon="...">` attribute supports two modes:

1. **Icon class** — `icon="ue-object"` resolves to the matching SVG in `static/assets/svg/types/`. This is the default for type pages.
2. **Custom SVG** — `icon="/assets/svg/<plugin>/<file>.svg" iconType="img"` renders the plugin's branded SVG instead. Used for the per-plugin developer overlay class and other "branded" types where a plugin-specific icon already exists under `static/assets/svg/<plugin>/`.

If the engine base doesn't match any existing icon, ask the user — don't invent a new icon key.

## File location and naming

- Filename: kebab-case of the type name with the Unreal prefix stripped. `INActorPoolItem` → `actor-pool-item.md`. `FNActorPool` → `actor-pool.md`. `UNActorPoolSubsystem` → `actor-pool-subsystem.md`. `ENActorOperationalState` → `actor-operational-state.md`.
- Strip these prefixes when generating the slug AND the H1/`sidebar_label`: `I`, `U`, `F`, `A`, `E`, plus the `N` namespace letter that always follows (`IN`, `UN`, `FN`, `AN`, `EN`).
- **Collapse verbose engine suffixes** when the raw kebab-case would be unwieldy. The convention is to keep the descriptive part and drop the engine-noise suffix:
  - `UNGetActorBlueprintAsyncAction` → `get-actor-async.md` (NOT `get-actor-blueprint-async-action.md`); H1 / sidebar_label `Get Actor Async`.
  - `UNSpawnActorBlueprintAsyncAction` → `spawn-actor-async.md`; H1 `Spawn Actor Async`.
  - `BlueprintAsyncAction` → `Async`. `Component`, `Subsystem`, `Settings`, `Object` are descriptive and **kept**.
  - When unsure whether to collapse, ask the user — match an existing sibling page if one is present.
- `sidebar_label` and H1: Title Case with spaces (`Actor Pool Item`, not `INActorPoolItem`).
- **`sidebar_position`** — within any folder, subfolders sort first (alphabetical), then at-level `.md` files. Concretely:
  - Subfolder `index.mdx` files use positions `1..N` (alpha among themselves).
  - At-level `.md` files start at `N+1`. Glob the folder's existing `.md` files, take max + 1 as the new page's position.
  - If the new page lives in a subfolder, `N` is the number of sibling subfolders inside that subfolder (usually 0), so the page typically uses `1`+ relative to that subfolder.
  - If you create a NEW subfolder, you must bump every at-level page's position by one and assign the new subfolder index a position that keeps the alphabetical order. See [CLAUDE.md](CLAUDE.md) Sidebar ordering for the full rule.

## Frontmatter and header

Every page starts with the same scaffold:

```markdown
---
sidebar_position: <next integer>
sidebar_label: <Title Case Name>
sidebar_class_name: type <icon-key>
description: <one-sentence description from doxygen comment>
tags: [<version>]
---

import TypeDetails from '<relative path to src/components/TypeDetails>';

# <Title Case Name>

<TypeDetails icon="<icon-key-or-svg-path>" base="<EngineBase>" type="<FullTypeName>" typeExtra="<companion or empty>" headerFile="<Module>/Public/<...>.h" />

<Lead paragraph: 1-2 sentences explaining the type's purpose. Cross-link related types in the same plugin using relative links like [Actor Pool](actor-pool.md).>
```

- The tags `<version>` is an array of version tags which have had changes to the page and its content , for example on the documentation page for actor-pool-settings, because there were changes in version 0.1.0, and 0.2.6, they are included in the tag array as follows: [0.1.0,0.2.6]

The relative `import` path depends on depth — count from the new file's location, don't hardcode:

- `types/foo.md` (or `editor-types/foo.md`) → `../../../../src/components/TypeDetails` (4-deep)
- `types/<subfolder>/foo.md` (or `editor-types/<subfolder>/foo.md`) → `../../../../../src/components/TypeDetails` (5-deep)

The same depth rule applies to any other `src/components/` import (e.g. `VersionBadge`).

If the type has a custom plugin SVG (rare; mainly developer overlays), use the `iconType="img"` form for the `TypeDetails`:

```mdx
<TypeDetails icon="/assets/svg/<plugin>/<file>.svg" iconType="img" base="<EngineBase>" type="<FullTypeName>" ... />
```

## Page body — pick the structure that fits

The repo uses a few different body shapes depending on the kind of type. Pick the closest match and adapt; don't force "What It Is / What It Does" onto every page.

### Default — straightforward classes/structs

```markdown
## What It Is
- **<Aspect>**: <description>
- **<Aspect>**: <description>

## What It Does
- **<Capability>**: <description>
  - `MethodName()`: <what it does>
```

### Wrapper UObject (e.g. `UNActorPoolObject`, `UNDynamicRefObject`)

A `UObject` that bridges a native type to Blueprint/UMG. Body shape: What It Is bullets, What It Does bullets, then a `## Creation` section with a code-titled block showing the static factory call. End with a `:::warning` or `:::info` admonition about lifetime/usage caveats.

### UMG ListView entry (e.g. `UNActorPoolListViewEntry`, `UNDynamicRefListViewEntry`)

A `UUserWidget` that implements `INListViewEntry`. Body shape: What It Is bullets, then a **Bound Widgets** table (`| Widget | Type | Role |`) for `meta=(BindWidget)` members, then a **Behavior** section listing the native callbacks (`NativeOnListItemObjectSet`, `NativeDestruct`, `Refresh`, etc.).

### Async Blueprint action (e.g. `UNGetActorBlueprintAsyncAction`)

A `UBlueprintAsyncActionBase`. Body shape: `## When To Use It` bullets (decoupling, cost-hiding, comparison to sibling actions), then `## Blueprint Surface` with an Inputs table and a Pins table (`| Pin | Fires When | Payload |`), then `## Notes` for caveats.

### Subsystem (e.g. `UNActorPoolSubsystem`, `UNGuardianSubsystem`)

A `UTickableWorldSubsystem` / `UWorldSubsystem`. Body shape: lead paragraph → `## What It Does` bullets → `## Usage` with `<Tabs>` (Blueprint iframe + C++ code block) for each top-level operation → `## UFunctions` with the doxygen comment + signature for each Blueprint-exposed method → optional `## Reading State` table for accessor methods used by HUDs/tests.

The Tabs pattern requires:

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/<id>/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '325px' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="<title>"
// snippet
```
  </TabItem>
</Tabs>
```

Don't fabricate `blueprintue.com` IDs — leave a `<TODO: blueprint render id>` marker for the user to fill in.

## Creating a new subfolder

If the source header lives in a `Public/<Subfolder>/` that doesn't yet have a docs counterpart, create the subfolder before writing the type page.

1. **Folder name** — lowercase the source subfolder name. `Public/Math/` → `math/`. `Public/ComponentVisProxies/` → `component-vis-proxies/` (kebab-case multi-word names).
2. **Create `index.mdx`** at `docs/plugins/<slug>/types/<subfolder>/index.mdx` (or `editor-types/<subfolder>/index.mdx`):

   ```mdx
   ---
   description: <one-line summary of what this group contains>
   sidebar_position: <position — see step 3>
   ---

   import DocCardList from '@theme/DocCardList';

   # <Title Case Folder Name>

   <One-paragraph lead>. Mirrors the layout of `<Module>/Public/<Subfolder>/`.

   <DocCardList />
   ```
3. **Pick the new `sidebar_position`** so subfolders stay alphabetical at the top:
   - List existing sibling subfolders (their `index.mdx` files) plus the new one, sort alphabetically.
   - Renumber every sibling subfolder index `1..N` in that alpha order.
   - Bump every at-level `.md` file in the parent folder so its `sidebar_position` becomes `N + (its previous offset above the old subfolder block)`.

   In practice: if the parent had 3 subfolders (positions 1, 2, 3) and 5 at-level pages (positions 4-8), and you're inserting a new subfolder that alphabetizes between #1 and #2, the new layout is subfolders 1, 2, 3, 4 (alpha), then at-level pages 5-9.
4. **Don't run `npm run build`** — `npm run start` will surface any sidebar issues.

For the canonical shape, see [docs/plugins/core/types/math/index.mdx](docs/plugins/core/types/math/index.mdx) and [docs/plugins/ui/types/components/index.mdx](docs/plugins/ui/types/components/index.mdx).

## Cross-linking

When the new type's header references other NEXUS types (other `N*` symbols), link them via relative paths. Don't fabricate cross-links to types you haven't verified exist — glob the sibling `.md` files first.

- **Sibling in the same folder**: `[Other Type](other-type.md)`
- **Sibling at the parent (you're in a subfolder)**: `[Other Type](../other-type.md)`
- **Sibling in a different subfolder of the same plugin**: `[Other Type](../<other-subfolder>/other-type.md)` (or from the root, `[Other Type](<subfolder>/other-type.md)`)
- **Cross-plugin (root → root)**: `[Other Type](../../<other-plugin>/types/other-type.md)`
- **Cross-plugin from a subfolder**: add an extra `../` — `[Other Type](../../../<other-plugin>/types/other-type.md)`
- **Cross-plugin landing pages** (e.g. ProcGen, Blockout, Guardian): same depth rule — `../../<plugin>/index.mdx` from a root page, `../../../<plugin>/index.mdx` from a subfolder page.

## What NOT to do

- Don't add the page to any sidebar config — the sidebar is auto-generated from the filesystem.
- Don't write `.mdx` for a type page; existing convention is `.md` even when it imports `TypeDetails`.
- Don't include code samples, tabs, or screenshots in the initial scaffold — keep the page minimal so the user can flesh it out.
- Don't guess the `tags` version to add. If you can't determine it from `.uplugin` or the user, ask.
- Don't run `npm run build` after generating — fast feedback is `npm run start`, and the user will run it themselves.

## When done

Report: the path of the new file, the resolved plugin slug, the next `sidebar_position` you used, and whether you cross-linked any sibling types. Note if the user still needs to fill in the `What It Is` / `What It Does` bullets.
