---
sidebar_class_name: type native-struct
description: The packed 3D occupancy grid describing what space inside a cell is filled, and the lattice-snapping rotation that makes two independently-placed cells comparable.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Voxel Data

<TypeDetails icon="native-struct" base="struct" type="FNCellVoxelData" typeExtra=" + ENCellVoxel" headerFile="NexusWorldAssembly/Public/Cell/NCellVoxelData.h" />

A flat 3D grid of occupancy flags describing which space inside a [Cell](cell.md) is filled. It is the third and coarsest of a cell's three [side-car](cell.md#side-car-data) representations — bounds are one box, the hull is a mesh, and voxel data is a grid.

:::info[Not yet used during generation]

Voxel data is computed and stored, and can be [drawn in the editor](world-assembly-debug-draw.md#drawing-voxels), but the graph builder does not currently read it — see the [`Use Voxel Data`](cell.md#voxel-settings) setting. The [graph cell node](../architecture/organ-graph.md#cell-node-caching) declares a world-space voxel field but deliberately leaves it unpopulated rather than paying for the rotation before anything consumes it.

:::

## What It Is

- **Packed**: One `uint8` per voxel in a flat `TArray`, indexed `X + (Y * SizeX) + (Z * SizeX * SizeY)`.
- **Anchored, Not Scaled**: The struct stores a world-space `Origin` and a size in voxel units. The **world size of a voxel is not stored here** — it comes from the project's [`Voxel Size`](../project-settings.md) setting, so every grid in a project shares one scale.
- **Flag-Based, Not Boolean**: Each byte is an `ENCellVoxel` bitmask rather than a bool, so occupancy classifications can be added later without changing the storage layout.

## ENCellVoxel

```cpp
/**
 * Per-voxel flags for the cell occupancy grid.
 */
UENUM(meta=(Bitflags,UseEnumValuesAsMaskValuesInEditor=true))
enum class ENCellVoxel : uint8
{
	Empty		= 0,
	Occupied	= 1
};
ENUM_CLASS_FLAGS(ENCellVoxel)
```

Declared as a bitflag enum with only one meaningful bit today. `Empty = 0` is the absence of every flag rather than a flag in its own right, which is why a freshly-`Reset` grid reads as entirely empty without being written.

## Indexing

The struct gets its whole accessor surface from `N_FLAT_3D_ARRAY_BASE`, which supplies `Reset`, `Resize`, `GetIndex` / `GetInverseIndex`, `GetData` / `SetData`, and `GetCount`. Coordinates and flat indices are interchangeable — `GetIndex(X, Y, Z)` converts one way, `GetInverseIndex(Index)` returns an `(X, Y, Z)` tuple the other.

:::note[Only `Size` and `Data` are private]

The struct opens with `private:`, which reads as though the entire type were inaccessible. It is not: `N_FLAT_3D_ARRAY_BASE` **begins with a `public:` specifier** and never restores the previous access level, so everything declared after the macro is public. The `private:` only covers the two `UPROPERTY` storage fields it precedes.

:::

## Reading and Writing Flags

| Member | Purpose |
| :-- | :-- |
| `AddFlag(Index, Flag)` / `AddFlag(X, Y, Z, Flag)` | OR a flag into a voxel. |
| `RemoveFlag(Index, Flag)` / `RemoveFlag(X, Y, Z, Flag)` | Clear a flag on a voxel. |
| `IsValid()` | `true` when every dimension is non-zero — i.e. the grid has been sized. |
| `IsEqual(Other)` | `true` when dimensions and every voxel byte match. |
| `GetSize()` | Grid dimensions in voxel units. |
| `GetOrigin()` | World-space position of voxel `(0,0,0)`. |

`IsEqual` compares dimensions first and returns early, so mismatched grids cost nothing. Note that it compares **contents, not placement** — two grids with identical occupancy but different `Origin` values compare equal.

## Rotating Onto the Shared Lattice

```cpp
void RotateAroundPivot(const FVector& WorldPoint, const FRotator& Rotation, const FVector& VoxelSize);
```

This is the only complicated thing in the struct, and the reason it exists in this shape.

A voxel grid rotated naively is no longer comparable to any other grid — its voxel centres land between the centres of everything around it. So `RotateAroundPivot` does not merely transform the grid: it **re-voxelizes** it. The rotated occupancy is refit into a new axis-aligned footprint whose `Origin` is snapped to the global voxel lattice anchored at the world origin, and whose `Size` grows to cover the rotated bounds. Two cells rotated independently therefore still line up cell-for-cell.

It takes one of two paths:

| Condition | Path | Why |
| :-- | :-- | :-- |
| Cardinal rotation (90° multiples on every axis) **and** cubic voxels | Exact integer forward-map, touching only occupied source voxels | The rotation is a lattice bijection, so sweeping the whole destination volume would be waste. |
| Anything else | Inverse-sample every destination voxel back into the source grid | The destination footprint grows past the source, and a forward-map would leave holes in it. |

The forward-map is the fast path in the common case — cells are usually placed at 90° increments — while the inverse-sample path guarantees no occupancy is dropped when it is not.

:::warning[Approximate to about one voxel]

Resampling onto the shared lattice is accurate to roughly one voxel. It is built for broad occupancy-overlap tests, **not** exact volume reconstruction — do not use it to measure enclosed volume or to round-trip a grid without loss.

An early-out means an invalid or empty grid is left untouched rather than being resized to the rotated footprint.

:::

### Lattice snapping

Both `Origin` computation helpers (`LatticeFloor` / `LatticeCeil`) snap a value onto the lattice when it is within `1e-4` of a grid line before flooring or ceiling it. Without that tolerance, floating-point error in the rotated corner positions spills the footprint into a spurious extra voxel layer — a grid that should be `4×4×2` comes out `5×5×3`, and every subsequent comparison against it is off.
