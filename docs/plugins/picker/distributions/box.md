---
sidebar_label: Box
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points inside or on the surface of the FBox using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
tags: [0.1.0, 0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Box

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNBoxPickerLibrary" typeExtra="/ FNBoxPicker" headerFile="NexusActorPools/Public/NBoxPickerLibrary.h" />

![Box: Next Density](box/box-next-density.webp)

Provides various functions for generating points inside or on the surface of the **`FBox`** (axis-aligned) using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNBoxPickerLibrary` wraps the native `FNBoxPicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNBoxPicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point

<div class="image-split">
![Box: Next](box/box-next.webp) 
![Box: Next Projected](box/box-next-projected.webp)
</div>

Gets the next deterministic point inside or on an `FBox`.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Random Point

<div class="image-split">
![Box: Random](box/box-random.webp)
![Box: Random Projected](box/box-random-projected.webp)
</div>

Gets a random point inside or on an `FBox`.

:::info

Uses `FNRandom::NonDeterministic` to produce pseudo-random results.

:::

### One-Shot Point

<div class="image-split">
![Box: One-Shot](box/box-oneshot.webp)
![Box: One-Shot Projected](box/box-oneshot-projected.webp)
</div>

Gets a random point inside or on an  `FBox` using a one-shot seed.

### Tracked Point

<div class="image-split">
![Box: Tracked](box/box-tracked.webp)
![Box: Tracked Projected](box/box-tracked-projected.webp)
</div>

Gets a random point inside or on an `FBox` using a tracked seed. The seed altered for each `Count`.

## FNBoxPickerParams

:::warning

It is important to be aware of the **performance penalty** when using `MinimumBox`. It is only included for special use cases where absolutely necessary. It can also create biased results when selecting points as it has to create a series of `FBox` first which can be used; their shapes and sizes are directly related to the inner dimensions.

:::

### Base
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Count | `int` | The number of points to generate in a single pass. | `1` |
| CachedWorld | `TObjectPtr<UWorld>` | The world for line tracing and drawing. | |
| ProjectionMode | `ENPickerProjectionMode` | Should the point be projected somewhere? | `ENPickerProjectionMode::None` |
| Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| CollisionChannel | `TEnumAsByte<ECollisionChannel>` | The collision channel to use for tracing. | `ECC_WorldStatic` |

### Box
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Origin | `FVector` | The center point when attempting to generate new points. | `FVector::ZeroVector` |
| MinimumBox | `FBox` | The minimum dimensions to use when generating a point. | `FBox(ForceInit)` |
| MaximumBox | `FBox` | The maximum dimensions to use when generating a point. | `FBox(ForceInit)` |