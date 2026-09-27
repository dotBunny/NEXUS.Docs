---
sidebar_class_name: type ue-actor
description: Level-scoped holder for the baked world-collision pool — one per level, created by a bake, never placed by hand.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Collision Cache Actor

<TypeDetails icon="ue-actor" base="AInfo" type="ANWorldCollisionCacheActor" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldCollisionCacheActor.h" />

The level's holder for its baked [world collision](../world-collision.md): one per level, holding one [FNWorldCollisionPool](world-collision-pool.md). Its class displays as **NEXUS | World Collision Cache**.

- **It is created by a bake.** The class is `NotPlaceable` and `NotBlueprintable`. A bake (from the [World rail](../editor-mode/world.md#cache), a level save, or an organ's details panel) creates it when needed and finds it again by searching the level.
- **It holds no authored state.** Deleting it loses nothing you made. It costs one re-bake.
- **It is an actor so that it gets its own package.** The cache could have lived on `AWorldSettings`, but as an actor, World Partition gives it its own external package. Otherwise every bake would check out the persistent level, which is the most contested file in a team's stream.
- **A known issue in 0.3.5:** the save-time bake creates one in *any* level it runs on, including a cell level or a level opened for level-instance editing, which will never read it. The empty actor is harmless, and 0.4.0 stops creating it.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Pool` | [FNWorldCollisionPool](world-collision-pool.md) | The level's baked collision geometry. Reflected so it is saved, but not editable. |

## Finding It

```cpp
static ANWorldCollisionCacheActor* Find(const UWorld* World);
```

Returns the cache actor in `World`, or `nullptr` when the level has never been baked. Instanced levels are skipped, so a level opened as a level instance reads its own cache rather than its host's.

```cpp
static ANWorldCollisionCacheActor* FindOrCreate(UWorld* World);
```

Editor-only (`WITH_EDITOR`). Returns the cache actor, spawning one into the persistent level if there is none. Only a bake calls it, and bakes only happen at author time.
