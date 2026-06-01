---
description: A breakdown of World Assembly features, their availability, and the release each is targeted for.
sidebar_position: 7
tags: [0.3.0]
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
| Tag-Based Rules | Supports `Unique` and `RequireAny` groupping tags (as well as user-defined groups), and behavioral tags `Starter`, `StarterOnly`, `NotStarter`, `Finisher`, `FinisherOnly`, `NotFinisher`. |
| Count-Based Rules | `MaximumCount` limiter inside of an [ANOrganVolume](types/organ-volume.md). |
| Graph-Based Rules | `MinimumNodeDepth` allowing for ensuring a Cell is not placed too soon on a graph, with `MinimumNodeDistance` limiting proximity to itself. |
| Weighting | Both `UNCell` and `UNCellJunctionComponent` support weighting their selection for usage. |
| Initialization Callback | `INCellInitialized`-implementing `AActors` in a [Cell](types/cell.md) receive a callback when they are placed in the the world (with context about the assembly), but before `BeginPlay`. |

## Planned

| Feature | Description | Release |
| --- | --- | --- |
| Empty Junction Filling | Implement system to fill unused junctions with static or PCG content | [0.3.5 #164](https://github.com/dotBunny/NEXUS/issues/164) |
| Proximal Junction Matching | Automatically match Junctions that end up overlapping during regular placement | [0.3.5 #162](https://github.com/dotBunny/NEXUS/issues/162) |
| Tag KVP | System to associate float values to tags, initially to pass in a level to a tag, which will be queriable via `INCellInitialized`, as well as filterable (greater than, less than, equal) for for selection for placement of [Cells](types/cell.md).  | [0.3.5 #241](https://github.com/dotBunny/NEXUS/issues/241) |
| `CreateAfter` | A tag-based matching system allowing for [Cell](types/cell.md) placement to occur after another [Cell](types/cell.md). This will allow for lock-key gameplay determined during build (still possible to do post-generation). | [0.3.5 #219](https://github.com/dotBunny/NEXUS/issues/219)|
| `CantConnect` | A tag-based matching system creating rules where two [Cell](types/cell.md)s cannot connect to each other. | [0.3.5 #212](https://github.com/dotBunny/NEXUS/issues/212) |
| Loops | Creating circular paths through interconnected [Cell](types/cell.md)s. The concept will create geometry between junctions and bones with some predetermined limits, utilizing the defined corners of the junctions/bones and PCG-based spline geometry. | [0.4.0 #254](https://github.com/dotBunny/NEXUS/issues/254) |