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

- **Reflection macro** → base:
  - `UCLASS` → `class`
  - `USTRUCT` → `struct`
  - `UINTERFACE` → `interface` (the `I*` interface is the documented type; the `U*` companion goes in `typeExtra`)
  - `UENUM` → `enum`
- **Primary type name** — the symbol on the line after the macro (e.g. `class NEXUSACTORPOOLS_API INActorPoolItem` → `INActorPoolItem`).
- **`typeExtra`** — for interfaces, the `U*` companion class (`/ UNActorPoolItem`). For others, leave empty unless there's a meaningful pair.
- **`headerFile`** — relative path from the module's `Source/` folder, e.g. `NexusActorPools/Public/INActorPoolItem.h`.
- **`description`** — the first sentence of the doxygen comment immediately above the macro. If none, ask.
- **Initial-release version for `tags`** — read the plugin's `.uplugin` `VersionName` if the type is brand-new, OR ask the user. Do not invent a version.

## File location and naming

- Filename: kebab-case of the type name with the Unreal prefix stripped. `INActorPoolItem` → `actor-pool-item.md`. `FNActorPool` → `actor-pool.md`. `UNActorPoolSubsystem` → `actor-pool-subsystem.md`. `ENActorOperationalState` → `actor-operational-state.md`.
- Strip these prefixes when generating the slug AND the H1/`sidebar_label`: `I`, `U`, `F`, `A`, `E`, plus the `N` namespace letter that always follows (`IN`, `UN`, `FN`, `AN`, `EN`).
- `sidebar_label` and H1: Title Case with spaces (`Actor Pool Item`, not `INActorPoolItem`).
- `sidebar_position`: pick the next free integer in the target folder. Glob the folder's existing `.md` files, read their frontmatter, take max + 1. If the folder is empty (only `index.mdx`), start at `2` (the index is `1`).

## Template

```markdown
---
sidebar_position: <next integer>
sidebar_label: <Title Case Name>
sidebar_class_name: type ue-<base>
description: <one-sentence description from doxygen comment>
tags: [<version>]
---

import TypeDetails from '<relative path to src/components/TypeDetails>';

# <Title Case Name>

<TypeDetails icon="ue-<base>" base="<base>" type="<FullTypeName>" typeExtra="<companion or empty>" headerFile="<Module>/Public/<...>.h" />

<Lead paragraph: 1-2 sentences explaining the type's purpose. Cross-link related types in the same plugin using relative links like [Actor Pool](actor-pool.md).>

## What It Is
- **<Aspect>**: <description>
- **<Aspect>**: <description>

## What It Does
- **<Capability>**: <description>
  - `MethodName()`: <what it does>
  - `MethodName()`: <what it does>
```

The relative `import` path depends on depth — `types/foo.md` is 4 levels deep, so `../../../../src/components/TypeDetails`. Count from the new file's location, don't hardcode.

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
