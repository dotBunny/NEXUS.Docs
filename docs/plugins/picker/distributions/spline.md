---
sidebar_label: Spline
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points along a USplineComponent spline using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
tags: [0.1.0, 0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Spline

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNSplinePickerLibrary" typeExtra="/ FNSplinePicker" headerFile="NexusActorPools/Public/NSplinePickerLibrary.h" />

![Spline: Next Density](spline/spline-next-density.webp)

Provides various functions for generating points along a `USplineComponent` spline using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNSplinePickerLibrary` wraps the native `FNSplinePicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNSplinePicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point

<div class="image-split">
![Spline: Next](spline/spline-next.webp)
![Spline: Next Projected](spline/spline-next-projected.webp)
</div>

Generates a deterministic point on a `USplineComponent`'s spline.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Random Point

<div class="image-split">
![Spline: Random](spline/spline-random.webp)
![Spline: Random Projected](spline/spline-random-projected.webp)
</div>

Generates a random point on a `USplineComponent`'s spline.

:::info

Uses `FNRandom::NonDeterministic` to produce pseudo-random results.

:::

### One-Shot Point

<div class="image-split">
![Spline: One-Shot](spline/spline-oneshot.webp)
![Spline: One-Shot Projected](spline/spline-oneshot-projected.webp)
</div>

Generates a random point on a `USplineComponent`'s spline using a provided seed.
nerates a random point on a `USplineComponent`'s spline using a provided seed, then projects it to the world.

### Tracked Point

<div class="image-split">
![Spline: Tracked](spline/spline-tracked.webp)
![Spline: Tracked Projected](spline/spline-tracked-projected.webp)
</div>

Generates a random point on a `USplineComponent`'s spline while tracking the random seed state.

## FNSplinePickerParams

### Base
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Count | `int` | The number of points to generate in a single pass. | `1` |
| CachedWorld | `TObjectPtr<UWorld>` | The world for line tracing and drawing. | |
| ProjectionMode | `ENPickerProjectionMode` | Should the point be projected somewhere? | `ENPickerProjectionMode::None` |
| Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| CollisionChannel | `TEnumAsByte<ECollisionChannel>` | The collision channel to use for tracing. | `ECC_WorldStatic` |

### Spline
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| SplineComponent | `TObjectPtr<USplineComponent>` | The spline component to generate points on. | `nullptr` |