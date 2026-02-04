---
sidebar_label: Arc
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points inside or on the surface of an arc using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
tags: [0.1.0, 0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Arc

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNArcPickerLibrary" typeExtra="/ FNArcPicker" headerFile="NexusActorPools/Public/NArcPickerLibrary.h" />

![Arc: Next Density](arc/arc-next-density.webp)

Provides various functions for generating points inside or on the surface of an arc using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNArcPickerLibrary` wraps the native `FNArcPicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNArcPicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

### Next Point

<div class="image-split">
![Arc: Next](arc/arc-next.webp) 
![Arc: Next Projected](arc/arc-next-projected.webp)
</div>

Gets the next deterministic point inside or on an `FArc`.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Random Point

<div class="image-split">
![Arc: Random](arc/arc-random.webp)
![Arc: Random Projected](arc/arc-random-projected.webp)
</div>

Gets a random point inside or on an arc.

:::info

Uses `FNRandom::NonDeterministic` to produce pseudo-random results.

:::

### One-Shot Point

<div class="image-split">
![Arc: One-Shot](arc/arc-oneshot.webp)
![Arc: One-Shot Projected](arc/arc-oneshot-projected.webp)
</div>

Gets a random point inside or on an arc using a one-shot seed.

### Tracked Point

<div class="image-split">
![Arc: Tracked](arc/arc-tracked.webp)
![Arc: Tracked Projected](arc/arc-tracked-projected.webp)
</div>

Gets a random point inside or on an arc using a tracked seed. The seed altered for each `Count`.

## FNArcPickerParams

### Base
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Count | `int` | The number of points to generate in a single pass. | `1` |
| CachedWorld | `TObjectPtr<UWorld>` | The world for line tracing and drawing. | |
| ProjectionMode | `ENPickerProjectionMode` | Should the point be projected somewhere? | `ENPickerProjectionMode::None` |
| Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| CollisionChannel | `TEnumAsByte<ECollisionChannel>` | The collision channel to use for tracing. | `ECC_WorldStatic` |

### Arc
|Parameter|Type|Description|Default|
|:--|:--|:--|:--|
| Origin | `FVector` | The center point when attempting to generate new points. | `FVector::ZeroVector` |
| Rotation | `FRotator` | The base rotation used when trying to determine the arc angle. | `FRotator::ZeroRotator` |
| Degrees | `float` | The degrees of the arc. | `90.f` |
| MinimumDistance | `float` | The minimum distance to start finding points. | `0.f` |
| MaximumDistance | `float` | The maximum distance to find points. | `500.f` |