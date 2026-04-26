---
sidebar_position: 37
sidebar_label: Volume Utils
sidebar_class_name: type native-class
description: Helpers for working with AVolume and its underlying UModel geometry.
tags: [0.2.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Volume Utils

<TypeDetails icon="native-class" base="class" type="FNVolumeUtils" typeExtra="" headerFile="NexusCore/Public/Math/NVolumeUtils.h" />

Helpers for working with `AVolume` and its underlying `UModel` geometry.

## FNVolumeGeometryData

Geometry payload extracted from a `UModel` so it can be used for rendering or collision checks without re-walking the BSP tree.

```cpp
struct FNVolumeGeometryData
{
    /** Triangle-list vertices produced from the source UModel. */
    TArray<FDynamicMeshVertex> Vertices;

    /** Triangle indices referencing Vertices. */
    TArray<uint32> Indices;
};
```

## Methods

### Fill Geometry Data

Populates `OutData` with a triangle-list representation of `Model`'s BSP geometry.

```cpp
/**
 * Populates OutData with a triangle-list representation of Model's BSP geometry.
 * @param Model The UModel (typically sourced from an AVolume's Brush) to tessellate.
 * @param OutData Output buffer that receives the generated vertices and indices.
 */
static void FillGeometryData(UModel* Model, FNVolumeGeometryData& OutData);
```
