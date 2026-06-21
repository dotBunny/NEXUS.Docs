---
description: A breakdown of World Assembly features, their availability, and the release each is targeted for.
sidebar_position: 7
tags: [0.3.0, 0.3.1]
---

# Feature Matrix

## Shipped

| Feature | Description |
| --- | --- |
| Off-Thread Processing | Minimizes impact on game-thread running the assembly operations on task threads, outside of an initial world capture (collision) and the actual spawning of level instances (time-sliced). |
| Penetrated Matching | Allow junctions to match to other junctions / bones penetrating into the the collision meshes of either side, with defined limits.|
| Rotational Matching | Constraint-based matching of junctions allows for non-uniform build out. |
| Runtime Regeneration | Support for being able to tear down and regenerate at runtime. |
| Network Support | Replicated `ANCellLevelInstance` support, with client status (`ANWorldAssemblyRelay`) support. |
| Tag-Based Rules | Supports `Unique`, `RequireAny`, and `BadNeighbors` grouping tags (as well as user-defined groups), and behavioral tags `Starter`, `StarterOnly`, `NotStarter`, `Finisher`, `FinisherOnly`, `NotFinisher`. |
| Context Tag Rules | [Cell](types/cell.md) placement can require or contribute `Context Tags`, enabling lock-key style gating determined during generation. A placed cell's `Added Context Tags` accumulate and are queryable via `INCellInitialized`. |
| Tag Counters | Associates `int32` values with tags, seeded per-operation (or from project settings), filterable for cell selection (`Tag Counter Constraints`) and mutated on placement (`Tag Counter Operations`). Counts are signed and may go negative. |
| Count-Based Rules | `MinimumCount` and `MaximumCount` limiters governing how many times a Cell is used in the generated graph. |
| Graph-Based Rules | `MinimumNodeDepth` allowing for ensuring a Cell is not placed too soon on a graph, with `MinimumNodeDistance` limiting proximity to itself. |
| Directional Constraint | A [Cell](types/cell.md) can be restricted to a compass heading, measured from the Organ's directional reference point — selectable per Organ via [`Direction Mode`](types/organ-volume.md#direction-mode) (start bone, organ center, or dynamic centroid) — and enforced within the project/operation `Direction Tolerance`. |
| Weighting | Both `UNCell` and `UNCellJunctionComponent` support weighting their selection for usage. |
| Initialization Callback | `INCellInitialized`-implementing `AActors` in a [Cell](types/cell.md) receive a callback when they are placed in the the world (with context about the assembly), but before `BeginPlay`. |

## Planned

| Feature | Description | Release |
| --- | --- | --- |
| Empty Junction Filling | Implement system to fill unused junctions with static or PCG content | [0.3.2 #164](https://github.com/dotBunny/NEXUS/issues/164) |
| Proximal Junction Matching | Automatically match Junctions that end up overlapping during regular placement | [0.3.5 #162](https://github.com/dotBunny/NEXUS/issues/162) |
| Loops | Creating circular paths through interconnected [Cell](types/cell.md)s. The concept will create geometry between junctions and bones with some predetermined limits, utilizing the defined corners of the junctions/bones and PCG-based spline geometry. | [0.4.0 #254](https://github.com/dotBunny/NEXUS/issues/254) |