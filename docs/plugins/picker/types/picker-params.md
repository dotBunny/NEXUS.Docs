---
sidebar_position: 1
sidebar_label: Picker Params
sidebar_class_name: type native-struct
description: Projection-aware base struct that every shape-specific picker params derives from — owns the point count, the cached world, and the optional trace / navmesh projection.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Picker Params

<TypeDetails icon="native-struct" base="struct" type="FNPickerParams" typeExtra="" headerFile="NexusPicker/Public/NPickerParams.h" />

The base struct every shape-specific params type inherits from — see the per-shape pages under [distributions/](../../distributions/) for `FNArcPickerParams`, `FNBoxPickerParams`, and their siblings. Carries the point count, the cached `UWorld*` used for tracing/drawing, and the optional projection settings that snap generated points onto level geometry or the navmesh.

## Properties

| Property | Type | Category | Description |
| :-- | :-- | :-- | :-- |
| `Count` | `int32` | Base | Number of points to generate in a single pass. Default `1`. |
| `CachedWorld` | `UWorld*` | Base | World used for line tracing and debug drawing. `BlueprintReadOnly`, `VisibleInstanceOnly` — populated automatically by every `UN<Shape>PickerLibrary` via `N_GET_WORLD_FROM_CONTEXT` if left null. |
| `ProjectionMode` | `ENPickerProjectionMode` | Projection (advanced) | Strategy used to snap a generated point to surrounding geometry. Default `None`. |
| `Projection` | `FVector` | Projection (advanced) | Direction and distance of the line trace when `ProjectionMode == Trace`. Default `(0, 0, -500)`. |
| `CollisionChannel` | `ECollisionChannel` | Projection (advanced) | Trace channel used when `ProjectionMode == Trace`. Default `ECC_WorldStatic`. |

## Projection Mode

```cpp
UENUM(BlueprintType)
enum class ENPickerProjectionMode : uint8
{
    None = 0,
    Trace = 1               UMETA(DisplayName="Line Trace (Collision)"),
    NearestNavMeshV1 = 2    UMETA(DisplayName="Nearest NavMesh Point (V1)")
};
```

| Value | Behavior |
| :-- | :-- |
| `None` | The generated point is returned as-is. |
| `Trace` | A line trace is cast from the point in direction `Projection` using `CollisionChannel`; if it hits, the hit location replaces the point. Simple vs. complex collision is governed by the [`Trace Complex`](../project-settings.md) project setting. |
| `NearestNavMeshV1` | The point is projected to the nearest reachable `UNavigationSystemV1` location using the [Picker project settings](../project-settings.md)' `Nav Query Extent`, `Nav Agent Radius`, and `Nav Agent Height`. Falls back to the original location if the nav system is not initialized. Points that can't be projected (outside the volume or inside a NavModifier) are kept at their original location; a single summary `Warning` is logged per pick — enable `Verbose` for `LogNexusPicker` to see each one. |

The projection metadata is marked `AdvancedDisplay` so it only shows up in the detail panel after clicking the disclosure chevron — picking without projection is the common case.

## See Also

- [Project Settings](../project-settings.md) — owns the trace / nav-query defaults that the projection paths read from.
- [Distributions](../../distributions/) — one folder per shape, each subclassing this struct.
