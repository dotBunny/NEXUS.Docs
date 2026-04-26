---
sidebar_position: 38
sidebar_label: Voxel Coordinate
sidebar_class_name: type native-struct
description: Integer voxel coordinate triplet identifying a cell within a 3D voxel grid.
tags: [0.2.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Voxel Coordinate

<TypeDetails icon="native-struct" base="struct" type="FNVoxelCoordinate" typeExtra="" headerFile="NexusCore/Public/Math/NVoxelUtils.h" />

Integer voxel coordinate triplet identifying a cell within a 3D voxel grid. Values are unsigned, so the origin voxel sits at `(0, 0, 0)`.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `X` | `uint32` | Grid index along the X axis. |
| `Y` | `uint32` | Grid index along the Y axis. |
| `Z` | `uint32` | Grid index along the Z axis. |
