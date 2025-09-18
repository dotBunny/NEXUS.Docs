---
sidebar_label: Spline
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points along a USplineComponent spline using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Spline

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNSplinePickerLibrary" typeExtra="/ FNSplinePicker" headerFile="NexusActorPools/Public/NSplinePickerLibrary.h" />

Provides various functions for generating points along a `USplineComponent` spline using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNSplinePickerLibrary` wraps the native `FNSplinePicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNSplinePicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point (On)

![Spline: Next Point](spline/spline-next-point.webp) 

Generates a deterministic point on a `USplineComponent`'s spline.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Next Point Projected (On)

![Spline: Next Point Projected](spline/spline-next-point-projected.webp)

Generates a deterministic point on a `USplineComponent`'s spline, then projects it to the world.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Random Point (On)

![Spline: Random Point](spline/spline-random-point.webp)

Generates a random point on a `USplineComponent`'s spline.

### Random Point Projected (On)

![Spline: Random Point Projected](spline/spline-random-point-projected.webp)

Generates a random point on a `USplineComponent`'s spline, then projects it to the world.

### Random One-Shot Point (On)

![Spline: Random One-Shot Point](spline/spline-random-one-shot-point.webp)

Generates a random point on a `USplineComponent`'s spline using a provided seed.

### Random One-Shot Point Projected (On)

![Spline: Random One-Shot Point Projected](spline/spline-random-one-shot-point-projected.webp)

Generates a random point on a `USplineComponent`'s spline using a provided seed, then projects it to the world.

### Random Tracked Point (On)

![Spline: Random Tracked Point](spline/spline-random-tracked-point.webp)

Generates a random point on a `USplineComponent`'s spline while tracking the random seed state.

### Random Tracked Point Projected (On)

![Spline: Random Tracked Point Projected](spline/spline-random-tracked-point-projected.webp)

Generates a random point on a `USplineComponent`'s spline while tracking the random seed state, then projects it to the world.

## Parameters

|Variant|Parameter|Type|Description|Default|
|:--|:--|:--|:--|:--|
| _Base_ | SplineComponent | `USplineComponent*` |The spline component to generate points on. ||
| **Projected** | Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| **Projected** | CollisionChannel | `ECollisionChannel` | The collision channel to use for tracing. | `ECC_WorldStatic` |
| **Tracked** | Seed | `int32&` | The seed to be used when generating, and altered for determinism. | |
| **One-Shot** | Seed | `int32` | The throw-away seed used when generating. | |