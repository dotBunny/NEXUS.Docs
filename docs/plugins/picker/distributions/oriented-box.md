---
sidebar_label: Oriented Box
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points inside or on the surface of the FOrientedBox using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
tags: [0.1.0, 0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# OrientedBox

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNOrientedBoxPickerLibrary" typeExtra="/ FNOrientedBoxPicker" headerFile="NexusActorPools/Public/NOrientedBoxPickerLibrary.h" />

![OrientedBox: Next Density](oriented-box/oriented-box-next-density.webp)

Provides various functions for generating points inside or on the surface of the **`FOrientedBox`** using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNOrientedBoxPickerLibrary` wraps the native `FNOrientedBoxPicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNOrientedBoxPicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point

<div class="image-split">
![OrientedBox: Next](oriented-box/oriented-box-next.webp) 
![OrientedBox: Next Projected](oriented-box/oriented-box-next-projected.webp)
</div>

Gets the next deterministic point inside or on an `FOrientedBox`.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Random Point

<div class="image-split">
![OrientedBox: Random](oriented-box/oriented-box-random.webp)
![OrientedBox: Random Projected](oriented-box/oriented-box-random-projected.webp)
</div>

Gets a random point inside or on an `FOrientedBox`.

:::info

Uses `FNRandom::NonDeterministic` to produce pseudo-random results.

:::

### One-Shot Point

<div class="image-split">
![OrientedBox: One-Shot](oriented-box/oriented-box-oneshot.webp)
![OrientedBox: One-Shot Projected](oriented-box/oriented-box-oneshot-projected.webp)
</div>

Gets a random point inside or on an  `FOrientedBox` using a one-shot seed.

### Tracked Point

<div class="image-split">
![OrientedBox: Tracked](oriented-box/oriented-box-tracked.webp)
![OrientedBox: Tracked Projected](oriented-box/oriented-box-tracked-projected.webp)
</div>

Gets a random point inside or on an `FOrientedBox` using a tracked seed. The seed altered for each `Count`.

## FNOrientedBoxPickerParams

:::warning

It is important to be aware of the **performance penalty** when using `MinimumDimensions`. It is only included for special use cases where absolutely necessary. It can also create biased results when selecting points as it has to create a series of `FBox` first which can be used; their shapes and sizes are directly related to the inner dimensions.

:::

### Base
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Count | `int` | The number of points to generate in a single pass. | `1` |
| CachedWorld | `TObjectPtr<UWorld>` | The world for line tracing and drawing. | |
| ProjectionMode | `ENPickerProjectionMode` | Should the point be projected somewhere? | `ENPickerProjectionMode::None` |
| Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| CollisionChannel | `TEnumAsByte<ECollisionChannel>` | The collision channel to use for tracing. | `ECC_WorldStatic` |

### OrientedBox
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Origin | `FVector` | The center point when attempting to generate new points. | `FVector::ZeroVector` |
| MinimumDimensions | `FVector` | The minimum dimensions to use when generating a point. | `FVector::ZeroVector` |
| MaximumDimensions | `FVector` | The maximum dimensions to use when generating a point. | `FVector::OneVector` |
| Rotation | `FRotator` | he rotation of the OrientedBox. | `FRotator::ZeroRotator` |