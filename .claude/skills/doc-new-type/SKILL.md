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
- `sidebar_position`: pick the next free integer in the target folder. Glob the folder's existing `.md` files, read their frontmatter, take max + 1. If the folder is empty (only `index.mdx`), start at `2` (the index is `1`).

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

The relative `import` path depends on depth — `types/foo.md` is 4 levels deep, so `../../../../src/components/TypeDetails`. Count from the new file's location, don't hardcode.

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

## Cross-linking

When the new type's header references other NEXUS types (other `N*` symbols), link them as `[Other Type](other-type.md)` if they live in the same plugin's `types/` folder. Don't fabricate cross-links to types you haven't verified exist — glob the sibling `.md` files first.

## What NOT to do

- Don't add the page to any sidebar config — the sidebar is auto-generated from the filesystem.
- Don't write `.mdx` for a type page; existing convention is `.md` even when it imports `TypeDetails`.
- Don't include code samples, tabs, or screenshots in the initial scaffold — keep the page minimal so the user can flesh it out.
- Don't guess the `tags` version. If you can't determine it from `.uplugin` or the user, ask.
- Don't run `npm run build` after generating — fast feedback is `npm run start`, and the user will run it themselves.

## When done

Report: the path of the new file, the resolved plugin slug, the next `sidebar_position` you used, and whether you cross-linked any sibling types. Note if the user still needs to fill in the `What It Is` / `What It Does` bullets.
