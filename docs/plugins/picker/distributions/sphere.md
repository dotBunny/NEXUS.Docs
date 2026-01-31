---
sidebar_label: Sphere
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points inside or on the surface of a sphere using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
tags: [0.1.0, 0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Sphere

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNSpherePickerLibrary" typeExtra="/ FNSpherePicker" headerFile="NexusActorPools/Public/NSpherePickerLibrary.h" />

Provides various functions for generating points ***[i]nside or [o]n*** the surface of a **sphere** using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNSpherePickerLibrary` wraps the native `FNSpherePicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNSpherePicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point

<div class="image-split">
![Sphere: Next Point](sphere/sphere-next-point.webp)
![Sphere: Next Point Projected](sphere/sphere-next-point-projected.webp)
</div>

Generates a deterministic point inside or on the surface of a sphere.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Random Point

<div class="image-split">
![Sphere: Random Point](sphere/sphere-random-point.webp)
![Sphere: Random Point Projected](sphere/sphere-random-point-projected.webp)
</div>

Generates a random point inside or on the surface of a sphere.

:::info

Uses `FNRandom::NonDeterministic` to produce pseudo-random results.

:::

### One-Shot Point

<div class="image-split">
![Sphere: Random One-Shot Point](sphere/sphere-random-one-shot-point.webp)
![Sphere: Random One-Shot Point Projected](sphere/sphere-random-one-shot-point-projected.webp)
</div>

Generates a random point inside or on the surface of a sphere using a provided seed.

### Tracked Point

<div class="image-split">
![Sphere: Random Tracked Point](sphere/sphere-random-tracked-point.webp)
![Sphere: Random Tracked Point Projected](sphere/sphere-random-tracked-point-projected.webp)
</div>

Generates a random point inside or on the surface of a sphere while tracking the random seed state.

## FNSpherePickerParams

### Base
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Count | `int` | The number of points to generate in a single pass. | `1` |
| CachedWorld | `TObjectPtr<UWorld>` | The world for line tracing and drawing. | |
| ProjectionMode | `ENPickerProjectionMode` | Should the point be projected somewhere? | `ENPickerProjectionMode::None` |
| Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| CollisionChannel | `TEnumAsByte<ECollisionChannel>` | The collision channel to use for tracing. | `ECC_WorldStatic` |

### Sphere
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Origin | `FVector` | The center point when attempting to generate new points. | `FVector::ZeroVector` |
| MinimumRadius | `FVector2D` | The minimum radius of the circle (inner bound). | `0.f` |
| MaximumRadius | `FVector2D` | The maximum radius of the circle (outer bound). | `10.f` |
| Rotation | `FRotator` | The rotation of the circle plane. | `FRotator::ZeroRotator` |