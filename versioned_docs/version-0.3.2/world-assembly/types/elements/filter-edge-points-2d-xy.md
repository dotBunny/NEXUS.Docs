---
sidebar_class_name: type ue-object
description: PCG node that splits a filled 2D point grid into its interior and its border by counting each point's neighbours.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Filter Edge Points 2D (XY)

<TypeDetails icon="ue-object" base="UPCGSettings" type="UNFilterEdgePoints2DXYSettings" typeExtra=" + FNFilterEdgePoints2DParams" headerFile="NexusWorldAssembly/Public/Elements/NFilterEdgePoints2DXYElement.h" />

**`NEXUS | Filter Edge Points 2D (XY)`** — finds the border of a filled 2D point grid. Given a solid patch of points, it separates the ones on the outline from the ones inside it, which is the step that turns "a filled region" into "a wall to build along".

It works by **counting neighbours**, not by testing against a boundary shape. A point in the middle of a regular grid has eight neighbours around it; a point on an edge has fewer. That is the entire test, and it is why the node needs to know your grid spacing.

## Settings

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Spacing` | `float` | Grid spacing in world units, used to size the neighbour search. | `100.f` |

The property sits on a nested `FNFilterEdgePoints2DParams` exposed with `meta=(ShowOnlyInnerProperties, PCG_Overridable)`, so it reads as a field on the node and can be driven by an override.

`Spacing` must match the spacing of the incoming points. The node searches within `Spacing * 1.5`, which is wide enough to reach the four orthogonal neighbours (at `Spacing`) and the four diagonals (at `Spacing × 1.414`) while excluding the next ring out (at `2 × Spacing`). Set it too small and every point looks like an edge; too large and the border dissolves.

## Pins

| Direction | Pin | Carries |
| :-- | :-- | :-- |
| In | `In` | The filled point grid. |
| Out | `InsideFilter` | **Interior** points — those with 8 or more neighbours. |
| Out | `OutsideFilter` | **Border** points — those with fewer than 8 neighbours. |

:::warning[The edge points come out of `OutsideFilter`]

This trips people up, because the node is named for the edge points but does not emit them on the pin you would guess. The filter's predicate is "is this point interior?", so:

- **`InsideFilter` = inside the region** — the fill.
- **`OutsideFilter` = the outline** — what you almost certainly wanted.

Both pins always receive data, so nothing errors if you take the wrong one; you just get the fill where you expected the wall. If a downstream [Sort Line 2D (XY)](sort-line-2d-xy.md) produces a chain that zig-zags through the middle of your region instead of tracing its perimeter, this is why.

:::

## Behavior

The neighbour count is measured in **XY only** (`FVector::DistSquaredXY`), so points at different heights still count as neighbours. That is deliberate — it makes the node usable on unflattened input — but it also means a two-storey stack of points reads as interior. Flatten with [Set Position Z](set-position-z.md) first if that is not what you want.

The threshold is a fixed `>= 8`, not configurable. On a regular grid that is exactly the interior condition: an interior point has 8, an edge point has 5, and a corner has 3.

Points are classified in parallel via `ParallelFor` against the input's point octree, so the cost is roughly linear in point count rather than quadratic. Empty inputs are skipped. Both outputs are initialized from the input data, so tags and the attribute schema survive the split.

:::note[Irregular input degrades gracefully, not correctly]

The test assumes a **regular grid**. A jittered or randomly-sampled point set has no consistent neighbour count, so points deep inside the region can fall under 8 and be reported as border. The node will not fail — it will just return a noisier outline than the geometry warrants. Feed it grid-sampled points.

:::
