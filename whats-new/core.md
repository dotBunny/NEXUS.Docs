---
description: A highlight reel for the Core plugin and it's additions over time.
---

# Core

## 0.4.0

:::warning Game-only subsystems now stay game-only
`N_WORLD_SUBSYSTEM_GAME_ONLY` and `N_TICKABLE_WORLD_SUBSYSTEM_GAME_ONLY` had separate editor and cooked-build
definitions, and they disagreed. In a cooked game, the Actor Pools, Dynamic References, Guardian and World Assembly
subsystems were created in worlds they were meant to skip, such as a GamePreview world. The condition you passed in was
also expanded without parentheses, which is how Guardian's `Build Availability` came to be ignored entirely (see
[Guardian](guardian.md)). There is now one definition for every build, so what the editor's tests check is what ships.
If you use these macros in your own subsystems, the behavior you already expected is now the behavior you get.
:::

### A Menu Map In Two Clicks

Every project needs a boot map or a front-end with no gameplay in it, and every project writes the same small game
mode for it. [`ANNullGameMode`](/docs/dev/core/types/framework/null-game-mode) is that game mode. It hands the player an
[`ANMenuPlayerController`](/docs/dev/core/types/framework/menu-player-controller): UI input only, no tick, and when you
leave, it clears the viewport's ignore-input flag, which would otherwise swallow all input in the map you travel to.
Set it as a map's **GameMode Override** and get on with the menu.

### Tag A Component, Measure The Rest

[`FNActorUtils::GetFilteredComponentsBoundingBox`](/docs/dev/core/types/actor-utils#filtering-by-component-tag),
`FNLevelBoundsFilter::ComponentIgnoreTags`, and a `ComponentIgnoreTags` argument on
[`FNRawMeshFactory::FromActorsInBounds`](/docs/dev/core/types/types/raw-mesh-factory) all leave out individual
**primitives** by tag while still measuring the actor. This is the plumbing behind World Assembly's component-level
ignore tags, and it is there for anything else of yours that measures PCG output.

### Also

- [`FNStringUtils::IsValidEmail`](/docs/dev/core/types/string-utils), a pragmatic "does this look like an email
  address" check for sign-up forms.

## 0.3.5

### Target Point Markers You Can Actually See

[Target Point Components](/docs/core/types/pcg/target-point-component) now have a presence in the level viewport:
scaled axes plus a world-down reference arrow, drawn as a screen-space handle so they stay visible and clickable at any
zoom, and labelled with the component tags `Get Component Points` filters on.

### Mesh Merging Got A Lot Faster

`CombineMesh` was recomputing the centre and bounds of everything merged so far on every single call. One merge, fine. A
loop of them — which is what merging a level's collision is — quadratic. Measured at roughly a hundred million vector
adds and a twelve second editor stall on toggling the collision visualizer. Centre and bounds are now accumulated over
the vertices being appended, in the same pass that appends them.
