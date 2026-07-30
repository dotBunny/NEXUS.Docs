---
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points the plane of a rectangle using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
---

import TypeDetails from '@site/src/components/TypeDetails';

# Rectangle

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNRectanglePickerLibrary" typeExtra="/ FNRectanglePicker" headerFile="NexusPicker/Public/NRectanglePickerLibrary.h" />

![Rectangle: Next Density](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-next-density.webp)

Provides various functions for generating points the plane of a **rectangle** using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNRectanglePickerLibrary` wraps the native `FNRectanglePicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNRectanglePicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point

<div class="image-split">
![Rectangle: Next](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-next.webp)
![Rectangle: Next Projected](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-next-projected.webp)
</div>

Generates the next point inside or on the boundary of a rectangle from a caller-owned [`FNMersenneTwister`](../../core/types/math/mersenne-twister.md), so the same picker can participate in a larger deterministic stream without rebuilding state between calls.

```cpp
static void Next(TArray<FVector>& OutLocations, FNMersenneTwister& Random, const FNRectanglePickerParams& Params);
```

### Random Point

<div class="image-split">
![Rectangle: Random](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-random.webp)
![Rectangle: Random Projected](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-random-projected.webp)
</div>

Generates a random point inside or on the boundary of a rectangle.

:::info

Uses `FNRandom::GetNonDeterministic()` to produce pseudo-random results.

:::

### One-Shot Point

<div class="image-split">
![Rectangle: One-Shot](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-oneshot.webp)
![Rectangle: One-Shot Projected](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-oneshot-projected.webp)
</div>

Generates a random point inside or on the boundary of a rectangle using a provided seed.

### Tracked Point

<div class="image-split">
![Rectangle: Tracked](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-tracked.webp)
![Rectangle: Tracked Projected](/assets/images/docs/plugins/picker/distributions/rectangle/rectangle-tracked-projected.webp)
</div>

Generates a random point inside or on the boundary of a rectangle using a tracked seed.

### Containment

Standalone predicates for testing whether a point is inside or on the surface of the shape. Unlike the generation methods above these take explicit geometry rather than an `FNRectanglePickerParams`, so they are usable without building a params struct first.

```cpp
static bool IsPointInsideOrOn(const FVector& Origin, const FVector2D Dimensions, const FRotator Rotation, const FVector& Point);

static TArray<bool> IsPointsInsideOrOn(const TArray<FVector>& Points, const FVector& Origin, const FVector2D& MinimumDimensions, const FVector2D& MaximumDimensions, const FRotator Rotation = FRotator::ZeroRotator);
```

Exposed to Blueprint as `Rectangle: Is Point Inside Or On?` and `Rectangle: Is Points Inside Or On?`. The array form returns one `bool` per input point, in the same order.

:::warning

The two are not symmetric. The single-point test takes a single `Dimensions` and tests one solid shape; the array test takes `MinimumDimensions` and `MaximumDimensions` and tests the **shell between them**. Passing the same value for both collapses it to a surface test. A minimum of zero leaves no hole, so every point within the outer bound — including the origin — is included.

:::

## FNRectanglePickerParams

:::warning

It is important to be aware of the **performance penalty** when using `MinimumDimensions`. It is only included for special use cases where absolutely necessary. It can also create biased results when selecting points as it has to create a series of ranges first which can be used; their shapes and sizes are directly related to the inner dimensions.

:::

### Base Parameters

|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Count | `int` | The number of points to generate in a single pass. | `1` |
| CachedWorld | `TObjectPtr<UWorld>` | The world for line tracing and drawing. | |
| ProjectionMode | `ENPickerProjectionMode` | Should the point be projected somewhere? | `ENPickerProjectionMode::None` |
| Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| CollisionChannel | `TEnumAsByte<ECollisionChannel>` | The collision channel to use for tracing. | `ECC_WorldStatic` |

### Rectangle Parameters

|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Origin | `FVector` | The center point when attempting to generate new points. | `FVector::ZeroVector` |
| MinimumDimensions | `FVector2D` |The inner dimensions of the rectangle (X = width, Y = height). | `FVector2D::ZeroVector` |
| MaximumDimensions | `FVector2D` | The outer dimensions of the rectangle (X = width, Y = height). | `FVector2D(1.f,1.f)` |
| Rotation | `FRotator` | The rotation of the rectangle plane. | `FRotator::ZeroRotator` |
