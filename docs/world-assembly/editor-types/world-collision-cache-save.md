---
sidebar_class_name: type native-class
description: Keeps each level's baked world-collision cache current by re-baking whatever changed when the level is saved.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Collision Cache Save

<TypeDetails icon="native-class" base="class" type="FNWorldCollisionCacheSave" typeExtra="" headerFile="NexusWorldAssemblyEditor/Public/NWorldCollisionCacheSave.h" />

Keeps each level's [world-collision](../world-collision.md) cache current by re-baking whatever changed when you **save** the level. It does nothing unless `Cache On Save` is on in the [World Collision Cache settings](../project-settings.md#world-collision-cache), which it is by default.

Two layers decide whether a save does any work, and they answer different questions:

| Layer | Answers | Role |
| :-- | :-- | :-- |
| A per-world **dirty flag** | *Has any collision-relevant geometry been touched since the last bake?* | Makes saving an untouched level free: a clean world skips the pass entirely. |
| Each organ's stored **fingerprint** | *Is this organ's cache still correct?* | The authority. It is rechecked per organ during the bake, and it is also what the runtime checks. |

Correctness never depends on the flag. A world the editor hasn't seen an edit to **this session** counts as **dirty**, so a change made before these hooks were active (by a commandlet, a script, or a previous session) costs one fingerprint pass rather than being missed.

The flag is set by the same editor change events the [preview](world-collision-preview.md) watches: actor added or deleted, finished moving an object, a completed property change, and undo/redo. It is cleared when a **whole-level** bake finishes without being cancelled. That happens on save, and from the World rail or the cache actor when nothing is selected. A bake of selected organs leaves the rest of the level unchecked, and a cancelled bake leaves the organs it never reached unchecked, so neither clears the flag.

A save during a cook never bakes. Baking is authoring, and creating the cache actor mid-cook would put it into a cooked package.

## Public API

```cpp
static void Register();
static void Unregister();
static void OnPreSaveWorld(UWorld* World, FObjectPreSaveContext ObjectPreSaveContext);
static void MarkDirty(const UWorld* World);
static void MarkClean(const UWorld* World);
static bool IsDirty(const UWorld* World);
```

- **`Register` / `Unregister`** hook up the save and change events. The editor module calls them at startup and shutdown.
- **`OnPreSaveWorld`** runs the save-time bake. The bake only writes to things inside the level being saved (its organs and its cache actor), so there is no second package to save afterwards.
- **`IsDirty`** returns true for a world it has never seen, since assuming dirty is the safe answer.

This is editor glue. You would normally only call `MarkDirty` yourself, from a tool that changes collision-relevant geometry without going through the editor's usual change events.
