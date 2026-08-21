---
sidebar_class_name: type ue-object
description: PCG node that splits a filled 2D point grid into its interior and its border by counting each point's neighbours.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Filter Edge Points 2D (XY)

<TypeDetails icon="ue-object" base="UPCGSettings" type="UNFilterEdgePoints2DXYSettings" typeExtra=" + FNFilterEdgePoints2DParams" headerFile="NexusCore/Public/PCG/Elements/NFilterEdgePoints2DXYElement.h" />

**`NEXUS | Filter Edge Points 2D (XY)`** — finds the border of a filled 2D point grid. Given a solid patch of points, it separates the ones on the outline from the ones inside it, which is the step that turns "a filled region" into "a wall to build along".

It works by **counting neighbours**, not by testing against a boundary shape. A point in the middle of a regular grid has eight neighbours around it; a point on an edge has fewer. That is the entire test, and it is why the node needs to know your grid spacing.

## Settings

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Spacing` | `float` | Grid spacing in world units, used to size the neighbour search. | `100.f` |
| `Depth` | `int32` | How many rings of edge points to take, counted in points rather than world units. | `1` |
| `bWriteEdgeDepth` | `bool` | Write the ring each point was taken on out as an attribute. | `false` |
| `EdgeDepthAttributeName` | `FName` | Name of that attribute. | `EdgeDepth` |

The properties sit on a nested `FNFilterEdgePoints2DParams` exposed with `meta=(ShowOnlyInnerProperties, PCG_Overridable)`, so they read as fields on the node and can be driven by overrides.

`Spacing` must match the spacing of the incoming points. The node searches within `Spacing * 1.5`, which is wide enough to reach the four orthogonal neighbours (at `Spacing`) and the four diagonals (at `Spacing × 1.414`) while excluding the next ring out (at `2 × Spacing`). Set it too small and every point looks like an edge; too large and the border dissolves.

## Pins

| Direction | Pin | Carries |
| :-- | :-- | :-- |
| In | `In` | The filled point grid. |
| Out | `InsideFilter` | **Interior** points — those still with 8 or more neighbours after the requested rings have come off. |
| Out | `OutsideFilter` | **Border** points — every ring the node took, together. |

:::warning[The edge points come out of `OutsideFilter`]

This trips people up, because the node is named for the edge points but does not emit them on the pin you would guess. The filter's predicate is "is this point interior?", so:

- **`InsideFilter` = inside the region** — the fill.
- **`OutsideFilter` = the outline** — what you almost certainly wanted.

Both pins always receive data, so nothing errors if you take the wrong one; you just get the fill where you expected the wall. If a downstream [Sort Line 2D (XY)](sort-line-2d-xy.md) produces a chain that zig-zags through the middle of your region instead of tracing its perimeter, this is why.

:::

## Depth

`Depth` decides how thick a border you get. At the default of `1` the node takes the outline and nothing else — the behaviour it has always had.

Higher values repeat the test on what is left: take the outline away, look at the points that are now exposed, take those too. A `Depth` of `3` on a large grid returns a band three points thick. This is **not** a distance in world units — it is a count of point rings, so a coarser `Spacing` gives you a physically wider band for the same `Depth`.

Every ring arrives on `OutsideFilter` together, as one data set. An input thinner than the depth you asked for is simply consumed whole, leaving `InsideFilter` empty rather than erroring.

Internally this does not re-run the whole pass per ring. Taking a ring lowers the live neighbour tally of the points it touched, so only points that just lost a neighbour get re-tested — the result matches a fresh pass over the leftovers, at a fraction of the work.

### Edge depth attribute

Turn on `bWriteEdgeDepth` to record which ring each point came off on. Points get `1` for the outermost ring, rising inward, and the interior points on `InsideFilter` get `0`.

The attribute is written to **both** output pins, so their schemas match and the two can be merged downstream without one side losing the value. It is off by default: leaving it off keeps the outputs exactly as they were before the option existed.

Use it to vary what you build per ring — a different mesh on the outermost course, a height ramp falling away from the edge, or a density gradient across the band.

## Behavior

The neighbour count is measured in **XY only** (`FVector::DistSquaredXY`), so points at different heights still count as neighbours. That is deliberate — it makes the node usable on unflattened input — but it also means a two-storey stack of points reads as interior. Flatten with [Set Position Z](set-position-z.md) first if that is not what you want.

The threshold is a fixed `>= 8`, not configurable. On a regular grid that is exactly the interior condition: an interior point has 8, an edge point has 5, and a corner has 3.

The initial neighbour count runs in parallel via `ParallelFor` against the input's point octree, so the cost is roughly linear in point count rather than quadratic. Empty inputs are skipped. Both outputs are initialized from the input data, so tags and the attribute schema survive the split.

:::note[Irregular input degrades gracefully, not correctly]

The test assumes a **regular grid**. A jittered or randomly-sampled point set has no consistent neighbour count, so points deep inside the region can fall under 8 and be reported as border. The node will not fail — it will just return a noisier outline than the geometry warrants. Feed it grid-sampled points.

This gets more pronounced as `Depth` rises: an interior point that undercounts is taken early, which exposes its neighbours a round sooner, and the error compounds inward. If a deep peel eats further in some places than others, the input is the cause, not the depth.

:::
