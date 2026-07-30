---
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points inside or on the surface of the FOrientedBox using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
---

import TypeDetails from '@site/src/components/TypeDetails';

# OrientedBox

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNOrientedBoxPickerLibrary" typeExtra="/ FNOrientedBoxPicker" headerFile="NexusPicker/Public/NOrientedBoxPickerLibrary.h" />

![OrientedBox: Next Density](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-next-density.webp)

Provides various functions for generating points inside or on the surface of the **`FOrientedBox`** using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNOrientedBoxPickerLibrary` wraps the native `FNOrientedBoxPicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNOrientedBoxPicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point

<div class="image-split">
![OrientedBox: Next](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-next.webp) 
![OrientedBox: Next Projected](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-next-projected.webp)
</div>

Gets the next point inside or on an `FOrientedBox` from a caller-owned [`FNMersenneTwister`](../../core/types/math/mersenne-twister.md), so the same picker can participate in a larger deterministic stream without rebuilding state between calls.

```cpp
static void Next(TArray<FVector>& OutLocations, FNMersenneTwister& Random, const FNOrientedBoxPickerParams& Params);
```

### Random Point

<div class="image-split">
![OrientedBox: Random](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-random.webp)
![OrientedBox: Random Projected](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-random-projected.webp)
</div>

Gets a random point inside or on an `FOrientedBox`.

:::info

Uses `FNRandom::GetNonDeterministic()` to produce pseudo-random results.

:::

### One-Shot Point

<div class="image-split">
![OrientedBox: One-Shot](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-oneshot.webp)
![OrientedBox: One-Shot Projected](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-oneshot-projected.webp)
</div>

Gets a random point inside or on an  `FOrientedBox` using a one-shot seed.

### Tracked Point

<div class="image-split">
![OrientedBox: Tracked](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-tracked.webp)
![OrientedBox: Tracked Projected](/assets/images/docs/plugins/picker/distributions/oriented-box/oriented-box-tracked-projected.webp)
</div>

Gets a random point inside or on an `FOrientedBox` using a tracked seed. The seed altered for each `Count`.

### Containment

Standalone predicates for testing whether a point is inside or on the surface of the shape. Unlike the generation methods above these take explicit geometry rather than an `FNOrientedBoxPickerParams`, so they are usable without building a params struct first.

```cpp
static bool IsPointInsideOrOn(const FVector& Origin, const FVector& Dimensions, const FRotator& Rotation, const FVector& Point);

static TArray<bool> IsPointsInsideOrOn(const TArray<FVector>& Points, const FVector& Origin, const FVector& MinimumDimensions, const FVector& MaximumDimensions, const FRotator& Rotation = FRotator::ZeroRotator);
```

Exposed to Blueprint as `OrientedBox: Is Point Inside Or On?` and `OrientedBox: Is Points Inside Or On?`. The array form returns one `bool` per input point, in the same order.

:::warning

The two are not symmetric. The single-point test takes a single `Dimensions` and tests one solid shape; the array test takes `MinimumDimensions` and `MaximumDimensions` and tests the **shell between them**. Passing the same value for both collapses it to a surface test. A minimum of zero leaves no hole, so every point within the outer bound — including the origin — is included.

:::

### Initialize Params

Builds an [`FNOrientedBoxPickerParams`](#fnorientedboxpickerparams) from an existing `FOrientedBox`, so you can feed engine geometry straight into a pick without filling the struct out by hand.

```cpp
/**
 * Creates a FNOrientedBoxPickerParams initialized with the properties of a FOrientedBox.
 * @param OrientedBox The FOrientedBox to initialize the parameters from.
 * @return The initialized FNOrientedBoxPickerParams.
 */
static FNOrientedBoxPickerParams InitializeParams(const FOrientedBox& OrientedBox);
```

Exposed to Blueprint as `OrientedBox: Initialize Params`. This is unique to the oriented-box distribution — the other shapes have no equivalent.

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