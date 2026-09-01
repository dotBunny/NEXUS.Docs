---
sidebar_class_name: type ue-object
description: PCG node that orders a 2D point cloud into a nearest-neighbour chain and annotates each point with turn direction, facing, and segment metadata.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Sort Line 2D (XY)

<TypeDetails icon="ue-object" base="UPCGSettings" type="UNSortLine2DXYSettings" typeExtra=" + FNSortLine2DXYElement" headerFile="NexusCore/Public/PCG/Elements/NSortLine2DXYElement.h" />

**`NEXUS | Sort Line 2D (XY)`** — the substantial node in the [Elements](index.mdx) set. It takes an unordered point cloud that *forms* a line and turns it into a line: points in traversal order, each one labelled with which way the line turns there, which way it faces, and which run of wall it belongs to.

That labelling is the point. A perimeter of anonymous points cannot drive content; a perimeter where each point knows it is *the third of a seven-long north-facing wall* can.

Feed it the border points from [Filter Edge Points 2D (XY)](filter-edge-points-2d-xy.md) — remembering they arrive on the `OutsideFilter` pin.

## Pins

| Direction | Pin | Type |
| :-- | :-- | :-- |
| In | `In` | Point |
| Out | `Out` | Point |

## Input Settings

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Is Loop` | `bool` | Treat the input as a closed loop, changing how the first and last points are evaluated. | `false` |

## Options

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Left Most Starting Point` | `bool` | Start the chain from the left-most (lowest X) point instead of point index 0. | `false` |
| `Build Additional Metadata?` | `bool` | Compute and write every attribute below. When `false`, the node only sorts. | `true` |
| `Rotate Point To Face Direction` | `bool` | Write each point's computed facing onto its transform, not just its attribute. | `false` |

`Rotate Point To Face Direction` and every attribute-name property below are hidden in the details panel unless `Build Additional Metadata?` is on (`EditCondition` + `EditConditionHides`).

## How the Chain Is Built

A greedy nearest-neighbour walk. Start at a point, repeatedly hop to the closest unvisited point, stop when none remain.

`Left Most Starting Point` exists for reproducibility: index 0 is whatever order the upstream node happened to emit, while the left-most point is a property of the geometry. Turn it on when you need the same input to produce the same chain across runs.

:::warning[The walk uses 3D distance, despite the node's name]

Neighbour selection uses `FVector::DistSquared` — full XYZ — even though the node is named "2D (XY)" and everything downstream of it reasons in the XY plane. On input that has been flattened with [Set Position Z](set-position-z.md) the two are identical, which is why the intended chain works. On input with height variation, the walk can hop vertically to a nearer point and produce a chain that makes no sense as a 2D outline.

:::

Greedy nearest-neighbour has the usual failure mode: it never backtracks. If the walk paints itself into a corner, the nearest unvisited point may be clear across the region, and the chain takes a long jump rather than retracing. A clean, evenly-spaced perimeter avoids this; a sparse or branching one may not.

Inputs of **fewer than 2 points** are passed straight through untouched — the original data object, not a copy — and no metadata is written.

## Turn Values

Everything the node derives comes from one number per point: the signed turn.

For each point, the node computes the normalized direction to the *next* point, then takes `Cross(PreviousDirection, NextDirection) · Up`. On axis-aligned grid input that lands on exactly `0` (straight) or `±1` (a 90° corner). Off-grid input lands somewhere in between.

The **first** point's turn is only meaningful for a closed loop, and is only written when `Is Loop` is on — it is the turn from the last point's direction back into the first's. On an open line, point 0's `Turn Direction` stays `0`, which classifies it as wall.

### The deadzone

```cpp
/**
 * Deadzone half-width for turn classification, expressed in sin(theta) space (~30 degrees).
 * A turn whose magnitude is within this band is treated as a straight wall; anything past it is a
 * corner, named by the sign of the turn.
 */
inline constexpr float TurnDeadzone = 0.5f;
```

A turn whose magnitude is `<= 0.5` is a wall; past it, the sign decides the corner — positive is `Left90`, negative is `Right90`. The band is wide because grid input sits at `0` or `±1`, both far clear of `0.5`, so the tolerance costs nothing on the intended input while giving off-grid turns a definite Left/Right classification instead of silently defaulting to wall.

The deadzone is a compile-time constant, not a setting.

## Segments

A **segment** is either one unbroken run of wall or one corner. Corners are always length-1 segments of their own, which is what makes "the third point of this wall" a well-defined idea — the count restarts at every corner rather than running the length of the perimeter.

| Attribute | Meaning |
| :-- | :-- |
| `Segment Index` | Which segment this point belongs to. |
| `Subsegment Index` | 0-based position within the segment. Always `0` for a corner. |
| `Segment Length` | Number of points in this point's segment. Always `1` for a corner. |

`Segment Length` is resolved in a second pass, once every segment has been closed — a point cannot know how long its run is until the run ends.

The classification and segment maths live in a `static` helper, kept deliberately free of PCG types so they can be unit-tested directly:

```cpp
/**
 * Classifies each point of a sorted line from its signed turn value and resolves per-point segment bookkeeping.
 * @param TurnValues Signed cross-product magnitude at each point; index 0 is the loop-closure turn (0 for an open line).
 * @param TurnTolerance Deadzone half-width — a turn whose magnitude is <= TurnTolerance is treated as straight (a wall).
 * @param OutInfo Receives one entry per input turn value.
 */
static void ClassifyLine(const TArray<float>& TurnValues, float TurnTolerance, TArray<FNSortLinePointInfo>& OutInfo);
```

## Facing

Facing is derived from the summed turn of the whole line, so the node can tell which side of the chain is "outward" without being told.

The sum's sign gives the winding. Walls are then rotated **perpendicular** to the line — ±90° depending on that winding — so they face away from the enclosed region. Corners keep the line's own direction rather than being turned, since a corner has no single outward normal.

`Facing Rotation (Yaw)` receives the resulting yaw. `Facing Cardinal Index` quantizes it to `0`–`3` and `Facing Cardinal` writes the matching name.

:::note[Cardinal quantization always resolves]

The index is computed as `Floor((Yaw + 45) / 90) & 3`, so it is always in `0..3` — North, East, South, West — for any yaw, negative included. The `Unknown` cardinal name is therefore never selected by that mapping; it only ever appears as the attribute's default on a point the node did not write.

:::

When `Rotate Point To Face Direction` is on, the computed rotation is also applied to the point's transform, so spawned content inherits the facing without reading an attribute.

## Attribute Names

Every attribute name is authorable, so the node can be dropped into a graph with an existing naming convention.

| Property | Type | Default | Written Value |
| :-- | :-- | :-- | :-- |
| `Next Grid Direction` | `FName` | `NextGridDirection` | `FVector2D` direction to the next point. Zero on the last point of an open line. |
| `Facing Rotation (Yaw)` | `FName` | `FacingRotation` | `float` yaw. |
| `Facing Cardinal` | `FName` | `FacingCardinal` | `FName` from the Cardinal Names below. |
| `Facing Cardinal Index` | `FName` | `FacingCardinalIndex` | `int32` `0`–`3`. |
| `Turn Direction` | `FName` | `TurnDirection` | `float` signed turn. |
| `Segment Index` | `FName` | `SegmentIndex` | `int32`. |
| `Subsegment Index` | `FName` | `SubsegmentIndex` | `int32`. |
| `Segment Length` | `FName` | `SegmentLength` | `int32`. |
| `Part Name` | `FName` | `PointName` | `FName` from the Point Names below. |

## Point Names

The classification written to the `Part Name` attribute.

| Property | Default | Applied To |
| :-- | :-- | :-- |
| `Default` | `Default` | The attribute's default value. Never written by classification — every point resolves to Wall, Left 90, or Right 90. |
| `Left 90-Deg` | `Left90` | A left-hand corner. |
| `Right 90-Deg` | `Right90` | A right-hand corner. |
| `Wall` | `Wall` | A point on a straight run. |

## Cardinal Names

| Property | Default |
| :-- | :-- |
| `Unknown` | `U` |
| `North` | `N` |
| `East` | `E` |
| `South` | `S` |
| `West` | `W` |

Single letters by default so the values stay readable in PCG's attribute inspector, where the column is narrow.
