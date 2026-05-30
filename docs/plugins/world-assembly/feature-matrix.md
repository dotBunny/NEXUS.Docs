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

## Planned

| Feature | Description | Release |
| --- | --- | --- |
| Loops | Creating circular paths through interconnected [Cell](types/cell.md)s. The concept will create geometry between junctions and bones with some predetermined limits, utilizing the defined corners of the junctions/bones and PCG-based spline geometry. | [0.4.0 #254](https://github.com/dotBunny/NEXUS/issues/254) |