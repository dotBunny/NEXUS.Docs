---
sidebar_class_name: type native-class
description: The shared PDI draw helpers behind World Assembly's socket gizmos, hull outlines, and voxel overlays.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Assembly Debug Draw

<TypeDetails icon="native-class" base="class" type="FNWorldAssemblyDebugDraw" typeExtra=" + FNDrawSocketSettings" headerFile="NexusWorldAssembly/Public/NWorldAssemblyDebugDraw.h" />

Every socket gizmo, hull outline, and voxel overlay World Assembly draws in the editor goes through here. It is a static helper class over a `FPrimitiveDrawInterface`, shared by the component visualizers and the [Editor Mode](../editor-mode/index.mdx) so a socket looks identical no matter which one is drawing it.

Native-only and editor-facing. Not `UCLASS`, nothing Blueprint-exposed.

## Drawing a Socket

```cpp
/**
 * Draws a rectangular representation of the provided socket, rotated 90-degrees as to better represent the socket.
 * @param PDI Drawing Interface
 * @param Location The World Location that is the center of the drawn rectangle
 * @param Rotation The World Rotation that represents the forward direction of the socket.
 * @param DrawSettings Settings used for drawing the socket.
 */
static void DrawSocket(FPrimitiveDrawInterface* PDI, const FVector& Location, const FRotator& Rotation, const FNDrawSocketSettings& DrawSettings);
```

`Rotation` is the socket's **forward** direction, not the orientation of the rectangle. The rectangle is drawn rotated 90° from it, so it reads as a doorway you pass *through* rather than a panel you look *at*.

## Draw Socket Settings

`FNDrawSocketSettings` is the parameter bundle. It carries both the authored unit size and the world size that resolves to, because the gizmo labels one and draws the other.

| Field | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `UnitSize` | `FIntVector2` | Authored unit dimensions — width (X) and height (Y). No depth concept. | — |
| `SocketSize` | `FVector2D` | The world size those units resolve to. | — |
| `SocketType` | `ENCellJunctionType` | Decides what supplementary geometry is drawn — see [Junction Type](junction-component.md). | — |
| `Color` | `FLinearColor` | Colour of the socket rectangle. | — |
| `bIsConnected` | `bool` | Whether the socket is linked to a neighbour. | `false` |
| `bDrawBox` | `bool` | Draw the socket rectangle itself. | `true` |
| `bDrawCornerLines` | `bool` | Draw the [corner-point](junction-component.md#corner-points) lines. | `true` |
| `bDrawFillDepth` | `bool` | Draw the junction's fill volume. | `false` |
| `FillDepthMode` | `ENCellJunctionFillDepthMode` | Which side of the socket plane the fill volume grows from. | `DefaultForward` |
| `FillDepth` | `float` | How far the fill volume extends along the forward axis. | `10.f` |

The first four have **no defaults** — a caller must set `UnitSize`, `SocketSize`, `SocketType`, and `Color` explicitly, since a zero-initialised socket would draw as a degenerate rectangle in whatever colour `FLinearColor` happens to default to.

## Drawing Meshes

Four mesh overloads, in two pairs. `DrawDashedRawMesh` draws edges as dashed segments; `DrawRawMesh` draws them solid.

```cpp
static void DrawDashedRawMesh(FPrimitiveDrawInterface* PDI, const FNRawMesh& Mesh, const FRotator& Rotation, const FVector& Offset,
    FLinearColor Color, float DashSize = 2, ESceneDepthPriorityGroup Priority = SDPG_World);

static void DrawDashedRawMesh(FPrimitiveDrawInterface* PDI, const FNRawMesh& Mesh, const TArray<FVector>& WorldVertices,
    FLinearColor Color, float DashSize = 2, ESceneDepthPriorityGroup Priority = SDPG_World);
```

The difference between the two overloads is where the vertices come from:

- **`Rotation` + `Offset`** transforms the mesh's own local-space vertices as it draws. Use this for a mesh that has not been baked into world space.
- **`WorldVertices`** ignores the mesh's vertices entirely and uses the supplied array, taking only edge topology from `Mesh`. Use this when the vertices are already baked — the [graph cell node](../architecture/organ-graph.md#cell-node-caching) holds a world-space hull, and re-transforming it per frame would be waste.

:::warning

`WorldVertices` **must parallel the mesh's vertex array** — same count, same order. The overload indexes into it using the mesh's edge indices, so a mismatched array reads out of bounds rather than drawing something merely wrong.

:::

## Drawing Voxels

```cpp
/** Render every occupied voxel as a wire box. */
static void DrawVoxelDataGrid(FPrimitiveDrawInterface* PDI, const FNCellVoxelData& VoxelData, const FVector& Offset, const FRotator& Rotation);

/** Render every occupied voxel as a point, plus a wire box marking voxel (0,0,0). */
static void DrawVoxelDataPoints(FPrimitiveDrawInterface* PDI, const FNCellVoxelData& VoxelData, const FVector& Offset, const FRotator& Rotation);
```

Two views of the same [Cell Voxel Data](cell-voxel-data.md), both iterating every voxel and drawing only the occupied ones in blue:

- **`DrawVoxelDataGrid`** draws one wire box per occupied voxel, in `SDPG_World` — readable on a sparse grid, and a solid blue mass on a dense one.
- **`DrawVoxelDataPoints`** draws a 5px point per occupied voxel in `SDPG_Foreground`, so it stays visible through geometry. It additionally draws a **yellow wire box at voxel `(0,0,0)`** regardless of whether that voxel is occupied, as an origin marker.

Voxel size comes from the project's [`Voxel Size`](../project-settings.md) setting, not from the grid — the grid stores occupancy and an anchor, not a scale. Positions are computed from the grid's own `Origin` plus the supplied `Offset`.

:::warning[`Rotation` is currently ignored]

Both functions accept a `FRotator` and neither uses it — the source carries a `TODO: #ROTATE-VOXELS` where the rotation would need to snap onto the voxel lattice. Passing a rotation has no effect on what is drawn today, so a rotated cell's voxel overlay renders axis-aligned. See [`RotateAroundPivot`](cell-voxel-data.md#rotating-onto-the-shared-lattice) for the lattice-snapping the draw path would have to go through.

:::
