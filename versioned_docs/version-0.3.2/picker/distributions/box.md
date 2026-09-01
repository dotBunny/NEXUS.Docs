---
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points inside or on the surface of the FBox using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
---

import TypeDetails from '@site/src/components/TypeDetails';

# Box

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNBoxPickerLibrary" typeExtra="/ FNBoxPicker" headerFile="NexusPicker/Public/NBoxPickerLibrary.h" />

![Box: Next Density](/assets/images/docs/picker/distributions/box/box-next-density.webp)

Provides various functions for generating points inside or on the surface of the **`FBox`** (axis-aligned) using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNBoxPickerLibrary` wraps the native `FNBoxPicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNBoxPicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point

<div class="image-split">
![Box: Next](/assets/images/docs/picker/distributions/box/box-next.webp)
![Box: Next Projected](/assets/images/docs/picker/distributions/box/box-next-projected.webp)
</div>

Gets the next point inside or on an `FBox` from a caller-owned [`FNMersenneTwister`](../../core/types/math/mersenne-twister.md), so the same picker can participate in a larger deterministic stream without rebuilding state between calls.

```cpp
static void Next(TArray<FVector>& OutLocations, FNMersenneTwister& Random, const FNBoxPickerParams& Params);
```

### Random Point

<div class="image-split">
![Box: Random](/assets/images/docs/picker/distributions/box/box-random.webp)
![Box: Random Projected](/assets/images/docs/picker/distributions/box/box-random-projected.webp)
</div>

Gets a random point inside or on an `FBox`.

:::info

Uses `FNRandom::GetNonDeterministic()` to produce pseudo-random results.

:::

### One-Shot Point

<div class="image-split">
![Box: One-Shot](/assets/images/docs/picker/distributions/box/box-oneshot.webp)
![Box: One-Shot Projected](/assets/images/docs/picker/distributions/box/box-oneshot-projected.webp)
</div>

Gets a random point inside or on an  `FBox` using a one-shot seed.

### Tracked Point

<div class="image-split">
![Box: Tracked](/assets/images/docs/picker/distributions/box/box-tracked.webp)
![Box: Tracked Projected](/assets/images/docs/picker/distributions/box/box-tracked-projected.webp)
</div>

Gets a random point inside or on an `FBox` using a tracked seed. The seed altered for each `Count`.

### Containment

Standalone predicates for testing whether a point is inside or on the surface of the shape. Unlike the generation methods above these take explicit geometry rather than an `FNBoxPickerParams`, so they are usable without building a params struct first.

```cpp
static bool IsPointInsideOrOn(const FVector& Origin, const FBox& Box, const FVector& Point);

static TArray<bool> IsPointsInsideOrOn(const TArray<FVector>& Points, const FVector& Origin, const FBox& MinimumBox, const FBox& MaximumBox);
```

Exposed to Blueprint as `Box: Is Point Inside Or On?` and `Box: Is Points Inside Or On?`. The array form returns one `bool` per input point, in the same order.

:::warning

The two are not symmetric. The single-point test takes a single `Box` and tests one solid shape; the array test takes a `MinimumBox` and a `MaximumBox` and tests the **shell between them**. Passing the same value for both collapses it to a surface test. A minimum of zero leaves no hole, so every point within the outer bound — including the origin — is included.

:::

## FNBoxPickerParams

:::warning

It is important to be aware of the **performance penalty** when using `MinimumBox`. It is only included for special use cases where absolutely necessary. It can also create biased results when selecting points as it has to create a series of `FBox` first which can be used; their shapes and sizes are directly related to the inner dimensions.

:::

### Base Parameters

|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Count | `int` | The number of points to generate in a single pass. | `1` |
| CachedWorld | `TObjectPtr<UWorld>` | The world for line tracing and drawing. | |
| ProjectionMode | `ENPickerProjectionMode` | Should the point be projected somewhere? | `ENPickerProjectionMode::None` |
| Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| CollisionChannel | `TEnumAsByte<ECollisionChannel>` | The collision channel to use for tracing. | `ECC_WorldStatic` |

### Box Parameters

|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Origin | `FVector` | The center point when attempting to generate new points. | `FVector::ZeroVector` |
| MinimumBox | `FBox` | The minimum dimensions to use when generating a point. | `FBox(ForceInit)` |
| MaximumBox | `FBox` | The maximum dimensions to use when generating a point. | `FBox(ForceInit)` |
