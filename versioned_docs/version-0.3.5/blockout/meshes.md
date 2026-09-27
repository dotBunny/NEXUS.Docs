---
sidebar_position: 2
description: Grid-friendly static meshes for blocking out a level — primitives, ramps and a player capsule, sized in round numbers.
---

# Meshes

A library of static meshes for blocking out a level, found under `Meshes/` in the plugin's content. Walls, parapets, barriers and stairs arrive in 0.4.0. Every mesh is prefixed `SM_N`, and **its size is in its name**, in centimetres. You never have to open one to find out whether it will fit.

Pair them with the [Grid](material-library/grid.md) materials and a block-out comes together fast: the grid shows scale at a glance, and the meshes snap to the same round numbers.

## Reading The Names

Primitives use plain `x`-separated sizes, in centimetres: `SM_NCuboid_500x100x200_0`.

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

## Samples

The `DEMO_NBlockout` map in the `NEXUS Samples: Blockout` plugin shows the library in use. See [Blockout](index.mdx#samples).
