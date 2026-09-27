---
sidebar_position: 5
sidebar_label: World Collision
description: The geometry an assembly places cells against — what it is, how it is baked into the level, how a run reads it back, and how to tell whether it is current.
---

# World Collision

An assembly doesn't place cells into empty space. It places them into **your level**, and it must not push a corridor through a cliff or put a room inside a building you placed by hand. The geometry it checks against is **world collision**. It is made of:

- the simple collision of every actor that passes World Assembly's world-actor filter,
- player starts, so generated content keeps clear of them,
- optionally, the sampled surface of any landscapes.

Gathering all of that is real work, and it all happens on the game thread. Each actor's collision is extracted, converted to convex hulls, and checked. So World Assembly doesn't gather it on every run. It **bakes** the result into the level ahead of time and reads it back later. A cache that still matches the world skips the gather entirely. A cache that doesn't match is never an error: that organ falls back to gathering fresh, as if no cache existed.

:::tip[The short version]

Leave the defaults alone and **save your level**. Saving bakes whatever changed. The **Cache World Collision** button on the [World rail](editor-mode/world.md) forces a full bake, and it shows a warning badge whenever the level's cache is out of date.

:::

## What Counts As World Collision

What gets gathered is set by the `World Collisions` group in [Project Settings](project-settings.md). The main levers:

- **Tagging an actor out.** Give an actor the [`NWorldCollision_Ignore`](tagging.md#world-collision-markup-tags) tag, or one of your project's `Actor Ignore Tags`.
- **Tagging part of an actor out.** Tag just a **component** with `NWorldCollision_Ignore`, or with one of your `Component Ignore Tags`. This is the tool for generated content. A PCG graph writes its whole output onto one container actor, so tagging the actor removes all of it. Tagging the spawner's components individually lets you keep some of the output as collision and leave the rest as set dressing. PCG's mesh-spawner descriptors have a `Component Tags` list for exactly this. The [World rail's tag button](editor-mode/world.md#tagging) works on selected components.
- **Collision switched off.** `Exclude Non-Collision Enabled Actors` (on by default) skips actors whose collision is disabled.
- **Terrain.** Landscapes and Mesh Terrains are opt-in. See [Terrain Is Opt-In](project-settings.md#terrain-is-opt-in).

To see the result, turn on the [Collision Visualizer](editor-mode/world.md#visualizers). It draws the baked geometry exactly as an assembly will collide with it.

## Where It Lives

- **One cache actor per level.** An [ANWorldCollisionCacheActor](types/world-collision-cache-actor.md) holds the level's [pool](types/world-collision-pool.md): every baked hull, stored once and looked up by a stable [key](types/world-collision-source-key.md). Nobody places this actor by hand; a bake creates it when needed. It is a separate actor rather than data on the World Settings so that World Partition gives it **its own external package**. Otherwise every bake would check out the persistent level, which is the most contested file in a team's stream.
- **Each organ holds a small record.** Every [organ](types/organ-component.md) keeps an [FNOrganCollisionCache](types/organ-collision-cache.md): a list of keys into the pool and a [fingerprint](types/world-collision-fingerprint.md) of the world it was baked against. It holds no geometry. Two overlapping organs, or two unbounded organs that both cover the whole level, cost one key list each rather than two copies of the same geometry.
- **Landscape is stored separately.** A landscape is sampled across the whole level, not per organ volume, so it has its own section in the pool with its own fingerprint.

Deleting the cache actor loses nothing you authored. The next bake rebuilds it.

## When It Bakes

| Trigger | Scope | Forced? |
| :-- | :-- | :-- |
| **Saving the level**, with `Cache On Save` on | Every organ in the level | No: organs whose fingerprint still matches are skipped |
| **Cache World Collision** on the [World rail](editor-mode/world.md#cache) | The selected organs, or every organ if none are selected | Yes |
| **Bake World Collision** on the [cache actor's details panel](types/world-collision-cache-actor.md#details-panel) | The whole level | Yes |
| **Bake** on an [organ's](types/organ-component.md#world-collision-cache) `World Collision Cache` row | The selected organ(s) | Yes |

Saving is cheap on a level you haven't touched. The editor keeps a per-level "something collision-relevant changed" flag, updated when actors are added, deleted, moved or edited, and after undo or redo. A clean level skips even the fingerprint check. A level the editor hasn't watched this session (edited by a script, a commandlet, or a previous session) is treated as dirty, so it costs one fingerprint pass rather than being missed. Saves during a cook never bake.

A bake runs synchronously on the game thread. It flushes pending static-mesh compilation, and landscape sampling does one physics trace per sample. On a large level it takes seconds to minutes, so it shows a progress dialog **you can cancel**. Organs baked before you cancel keep their new cache, and the rest keep their old one, so the level is never left half-written.

:::note[Levels with no organs don't get a cache]

Only a level that holds organs, meaning a level assemblies are placed **into**, gets a cache actor. Cell levels, and levels opened for level-instance editing, never have one created by saving.

:::

## How A Run Reads It

When an assembly starts, it asks the pool about each of its organs:

1. **Is caching on?** If `Use Cache` is off, the run gathers the world fresh every time.
2. **Is there a cache actor?** If not, the level has never been baked, and the run gathers fresh.
3. **Was it baked at this world origin?** The hulls are stored in world space, so if the world origin has moved since the bake, every hull would be misplaced without any actor changing. That cache is ignored, with a log warning.
4. **Does this organ's fingerprint still match?** With `Validate Cache` on (the default), each organ's fingerprint is recomputed against the live world. A match reads that organ's hulls from the pool. A mismatch gathers fresh **for that organ only**. One moved organ doesn't cause the others to re-gather.
5. **Is the landscape section current?** It is checked against its own fingerprint, and sampled fresh if it has changed.

Because a mismatch just means gathering fresh, **a stale cache never produces wrong results. It only costs time.** The one exception is turning `Validate Cache` off. That trusts whatever was baked, which is only correct for a level whose geometry is fixed by the time anything reads it.

:::warning[Validate Cache off means runtime actors are invisible]

With validation off, anything spawned or streamed in before the assembly runs is not part of the cache. The run can't see it, and will happily place a cell straight through it. Leave validation on unless you have measured the fingerprint cost and know your level is static.

:::

## Is My Cache Current?

The status appears in several places. They all come from the same memoized check, so they always agree.

- **The World rail's `Cache World Collision` button** shows a **warning badge** while the level is unbaked or stale.
- **The Collision Visualizer** keeps drawing what it was showing when an edit made the cache stale, with a **wireframe overlay** in the `Stale` color (orange by default) so you can see it is out of date. If the editor hasn't drawn a current bake of the level this session (it was never baked, or was already stale when opened), there is nothing to draw and no visualizer is created.
- **A notification** appears the first time a level's collision is found unbaked or stale while the visualizer is up, and offers to bake. It appears once when the level becomes stale, not repeatedly while it stays stale, and a bake dismisses it. Turn it off under `World Assembly (User) > Notifications > World Collision Unavailable`.
- **Bones** are drawn in the `Unverified` color (grey by default) instead of valid or invalid. Without a current bake, the penetration readout has nothing trustworthy to measure against, and a bone reporting zero penetration in the valid color would be claiming a check that never happened.
- **The organ's details panel** shows `World Collision Cache`: the element count, whether it is **current** or **stale**, and when it was baked.
- **The cache actor's details panel** shows the pool's element count and whether it is current, stale, or not baked.

Colors and the notification toggle are per-user settings. See [User Settings](user-settings.md).

## What Makes A Cache Stale

A fingerprint summarizes everything a gather would read. Anything that would change the gathered geometry changes it:

- Adding, removing or renaming an actor within an organ's volume (anywhere in the level, for an unbounded organ).
- Moving an actor or a component, including a single instance of an instanced mesh.
- Changing a primitive's collision: its body setup, its collision-enabled setting, or whether it traces.
- Adding or removing an ignore tag on an actor or component that the gather would otherwise have included.
- Resizing an organ's volume.
- Changing a `World Collisions` project setting. Every field there affects what is gathered, so each is part of the fingerprint.

These do **not** make a cache stale:

- The `World Collision Cache` settings. They control caching, not what is gathered, so toggling one never invalidates every cache in the project.
- Tags that the gather ignores anyway. The fingerprint records whether each component is *excluded*, not which tags it carries. Tools that rewrite component tags on every run (PCG stamps every component it spawns each time it generates) don't invalidate the cache unless they change what is excluded.

## When A Cache Never Validates

A run that finds a stale cache logs it to `LogNexusWorldAssembly`:

```text
Organ 'Organ_Main' world collision cache is stale (baked 1234…, world is 5678… over 412 actors in 1 bounds); gathering fresh for it.
```

The **actor count** is the first clue. The fingerprint only covers actors that are *loaded*, so in a World Partition level it depends on which regions and data layers are loaded at that moment. If the bake saw a different number of actors than the run, it wasn't really the same world. The fix is to bake with the regions loaded that a run will see. If the count matches but the fingerprint differs, some geometry changed.

A layer-by-layer breakdown is logged immediately after, as warnings. Capture it from two sessions and compare them. The **first layer that differs** tells you what changed:

| Layer | Covers | If It Differs |
| :-- | :-- | :-- |
| `Identity` | Actor and component names | The run saw a different set of actors: something was added, removed, renamed, or not loaded. |
| `Bodies` | The above, plus each body's cooked-collision ID and collision flags | A body setup is being **built at runtime** instead of loaded. Runtime bodies get a new ID every session. |
| `Tags` | The above, plus whether each component is excluded | Something is changing *what is excluded* between sessions. |
| `Placement` | Every transform, ignoring order | Something actually moved. |
| `Transforms` | Every transform, in index order (this is the fingerprint itself) | If `Placement` matches and this doesn't, instances were **reordered**, not moved. Hierarchical meshes and generated output can rebuild their instance lists on load. |

## Settings

In `Edit > Project Settings`, open the **World Assembly** section and find `World Collision Cache` in the `Assembly` group. See also [Project Settings](project-settings.md#world-collision-cache). These control whether and how the cache is used. They are **not** part of the fingerprint, so changing them never invalidates a bake.

| Setting | Description | Default |
| :-- | :-- | :-- |
| `Cache On Save` | Bake world collision into the level when it is saved. Organs whose geometry hasn't changed are skipped. | `true` |
| `Use Cache` | Let an assembly read baked world collision instead of gathering the world again. Turn it off to always gather fresh. | `true` |
| `Validate Cache` | Check a cache against the live world before trusting it, and gather fresh when it no longer matches. Turning it off trusts whatever was baked. | `true` |

:::info[Upgrading to 0.4.0]

Every existing cache reads as stale **once** after upgrading, because the fingerprint now records whether each component is excluded from the gather. You don't need to do anything. Organs gather fresh until the next save or bake, and that first bake per level does more work than usual.

:::

## Under The Hood

For contributors, or anyone writing their own tools against the cache:

- [FNWorldCollisionBaker](types/world-collision-baker.md) is the single place that turns a live world into pooled hulls, and the single implementation of reading the cache (`ResolvePooled`). The assembly pipeline and the editor preview both use it, so a cache hit and a cache miss can't produce different worlds.
- [FNWorldCollisionFingerprint](types/world-collision-fingerprint.md) decides validity. It is **order-independent**, because the order an editor and a packaged game walk a level in isn't stable.
- [FNWorldCollisionSourceKey](types/world-collision-source-key.md) gives each element a stable identity: level package, actor name, component name, instance, and element. A stale reference is then detectable instead of silently pointing at whatever now occupies that array slot.
- In the editor, [FNWorldCollisionPreview](editor-types/world-collision-preview.md) serves the visualizer and the bone readout, and [FNWorldCollisionCacheSave](editor-types/world-collision-cache-save.md) handles the save-time bake.
- How the gathered geometry enters an operation is described in [Virtual World](architecture/virtual-world.md).
