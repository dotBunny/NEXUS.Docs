---
sidebar_label: Circle
sidebar_class_name: type ue-blueprint-function-library
description: TBD
toc_min_heading_level: 2
toc_max_heading_level: 5
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Circle

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNCirclePickerLibrary" typeExtra="/ FNCirclePicker" headerFile="NexusActorPools/Public/NCirclePickerLibrary.h" />

The `UNCirclePickerLibrary` wraps the native `FNCirclePicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNCirclePicker` directly to avoid the abstraction layer as it has a similar API.

## Parameters

### Base

All methods have a base set of parameters which affect their behaviour.

|Parameter|Type|Description|Default|
|:--|:--|:--|---|
| Origin | `FVector&` |The center world point of the circle. ||
| MinimumRadius | `float` | The minimum radius of the circle (inner bound). ||
| MaximumRadius | `float` |The maximum radius of the circle (outer bound). ||
| Rotation | `FRotator` | Optional rotation to apply to the circle plane | `FRotator::ZeroRotator`|

### Projected

The projected series of methods require a bit of additional context.

|Parameter|Type|Description|Default|
|:--|:--|:--|---|
| WorldContextObject | `UObject*` | Object that provides access to the world, usally auto-filled in Blueprint. | `WorldContext` |
| Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| CollisionChannel | `ECollisionChannel` | The collision channel to use for tracing. | `ECC_WorldStatic` |

## Methods

### Next Point (IO)

![Circle: Next Point](circle/circle-next-point.webp) 

Generates a deterministic point ***[i]nside or [o]n*** the perimeter of a circle. Uses the deterministic random generator to ensure reproducible results.

### Next Point Projected (IO)

![Circle: Next Point Projected](circle/circle-next-point-projected.webp)

Generates a deterministic point ***[i]nside or [o]n*** the perimeter of a circle, then projects it to the world. The point is projected in the given direction until it hits something in the world.

### Random Point (IO)

![Circle: Random Point](circle/circle-random-point.webp)

Generates a random point ***[i]nside or [o]n*** the perimeter of a circle. Uses the non-deterministic random generator for true randomness.

### Random Point Projected (IO)

![Circle: Random Point Projected](circle/circle-random-point-projected.webp)

Generates a random point ***[i]nside or [o]n*** the perimeter of a circle, then projects it to the world. The point is projected in the given direction until it hits something in the world.

### Random One-Shot Point (IO)

![Circle: Random One-Shot Point](circle/circle-random-one-shot-point.webp)

Generates a random point ***[i]nside or [o]n*** the perimeter of a circle using a provided seed. Useful for one-time random point generation with reproducible results.

### Random One-Shot Point Projected (IO)

![Circle: Random One-Shot Point Projected](circle/circle-random-one-shot-point-projected.webp)

Generates a random point ***[i]nside or [o]n*** the perimeter of a circle using a provided seed, then projects it to the world. The point is projected in the given direction until it hits something in the world.

### Random Tracked Point (IO)

![Circle: Random Tracked Point](circle/circle-random-tracked-point.webp)

Generates a random point ***[i]nside or [o]n*** the perimeter of a circle while tracking the random seed state. Updates the seed value to enable sequential random point generation.

### Random Tracked Point Projected (IO)

![Circle: Random Tracked Point Projected](circle/circle-random-tracked-point-projected.webp)

Generates a random point ***[i]nside or [o]n*** the perimeter of a circle while tracking the random seed state, then projects it to the world. Updates the seed value to enable sequential random point generation. The point is projected in the given direction until it hits something in the world.