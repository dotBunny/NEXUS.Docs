---
sidebar_position: 2
description: Grid-friendly static meshes for blocking out a level — primitives, walls with openings, parapets, barriers, ramps and stairs, sized in round numbers.
---

# Meshes

A library of static meshes for blocking out a level, found under `Meshes/` in the plugin's content. Every mesh is prefixed `SM_N`, and **its size is in its name**, in centimetres. You never have to open one to find out whether it will fit.

Pair them with the [Grid](material-library/grid.md) materials and a block-out comes together fast: the grid shows scale at a glance, and the meshes snap to the same round numbers.

:::info[Nanite]

The meshes have **Nanite enabled**, so a dense block-out stays cheap to render in projects that use Nanite.

:::

## Reading The Names

Architectural pieces (walls, parapets, barriers) put each dimension behind a letter:

| Letter | Means | Example |
| :-- | :-- | :-- |
| `L` | Length along the run | `L200`: two metres long |
| `R` | Radius, for curved pieces | `R300`: a three-metre radius |
| `T` | Thickness | `T050`: 50 cm thick |
| `H` | Height | `H300`: three metres tall |

`Curve45` and `Curve90` give the angle a curved piece sweeps. So `SM_NWall_Curve90_R400_T100_H300` is a quarter-circle wall with a 4 m radius, 1 m thick and 3 m tall.

Primitives use plain `x`-separated sizes instead: `SM_NCuboid_500x100x200_0`.

## Walls

`Meshes/Walls/`, all 3 m tall (`H300`), each in two thicknesses (`T050` and `T100`).

| Piece | Sizes | Notes |
| :-- | :-- | :-- |
| `Straight` | `L100`, `L200`, `L300`, `L400` | Plain wall runs. |
| `Curve45`, `Curve90` | `R200`, `R300`, `R400`, `R500` | Curved runs. |
| `Door` | `L200` | A wall with a door opening. |
| `DoorWide` | `L400` | A wall with a wider door opening. |
| `Window` | `L200` | A wall with a window. |
| `WindowHigh` | `L200` | A window set higher in the wall. |
| `WindowWide` | `L400` | A wider window. |
| `WindowFrame` | `L200` | Only 1.5 m tall (`H150`). |
| `OpeningOffset` | `L400` | A wall with an opening set off-centre. |
| `Portal` | `L400` | A wall with a portal opening. |

## Parapets

`Meshes/Parapets/`, the low walls along a ledge, balcony or rooftop. Runs are 1.2 m tall (`H120`), each in `T050` and `T100`.

| Piece | Sizes |
| :-- | :-- |
| `Straight` | `L100`, `L200`, `L300`, `L400` |
| `Curve45`, `Curve90` | `R200`, `R300`, `R400`, `R500` |
| `Pillar`, `PillarEnd` | 1.5 m tall (`H150`), in the same two thicknesses. `PillarEnd` finishes a run. |

## Barriers

`Meshes/Barriers/`, freestanding barriers, 1 m or 2 m tall (`H100`, `H200`).

| Piece | Sizes | Thickness |
| :-- | :-- | :-- |
| `Corner` | `L200` | `T050`, `T100` |
| `Curve45` | `R200`, `R300`, `R400`, `R500` | `T050`, `T100` |
| `Curve90` | `R200`, `R300` | `T050`, `T100` |
| `Curve90` | `R400` | `T050` only |

The barrier set has no straight pieces yet, and its `Curve90` range stops short of the walls' and parapets'.

## Primitives

The basic shapes, each in a spread of sizes.

| Family | Folder | Sizes |
| :-- | :-- | :-- |
| Cube | `Cube/` | `100`, `184`, `200`, `500`, `1000`, plus `CenterPivot_100` and `BackCenterPivot_100` for when the default pivot is in the way. |
| Cuboid | `Cuboid/` | 21 sizes, from `100x100x184` to `2500x100x2500`. The middle figure is always `100`. |
| Cylinder | `Cylinder/` | 14 sizes, from `100x10` to `200x1000`. |
| Sphere | `Sphere/` | `100`, `184`, `200`, `500`. |
| Torus | `Torus/` | `200`, `500` and `1000`, each at `25` and `50`. |
| Ramp | `Ramp/` | `100x100x100` through `100x400x100`, varying only in the middle figure. |
| Cardinal Cube | `CardinalCube/` | One per compass direction: `N`, `E`, `S`, `W`. |

## Utility

| Mesh | What It Is |
| :-- | :-- |
| `SM_NPlayerCapsule_0` | A player-sized capsule. Drop it in to check that a doorway, corridor or ceiling fits a person. |
| `SM_NStairs_8_150_20_30` | A straight flight of stairs. |

## Samples

The `DEMO_NBlockout` map in the `NEXUS Samples: Blockout` plugin shows the library in use. See [Blockout](index.mdx#samples).
