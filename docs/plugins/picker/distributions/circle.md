---
sidebar_label: Circle
sidebar_class_name: type ue-blueprint-function-library
description: TBD
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Circle

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNCirclePickerLibrary" typeExtra="/ FNCirclePicker" headerFile="NexusActorPools/Public/NCirclePickerLibrary.h" />

The `UNCirclePickerLibrary` wraps the native `FNCirclePicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNCirclePicker` directly to avoid the abstraction layer as it has a similar API.

## Deterministic

### Next Point (Inside Or On)

![Circle: Next Point](circle/circle-next-point.webp)

Generates a deterministic point inside or on the perimeter of a circle. Uses the deterministic random generator to ensure reproducible results.

|Parameter|Type|Description|Default|
|:--|:--|:--|---|
| Origin | `FVector&` |The center world point of the circle. ||
| MinimumRadius | `float` | The minimum radius of the circle (inner bound). ||
| MaximumRadius | `float` |The maximum radius of the circle (outer bound). ||
| Rotation | `FRotator` | Optional rotation to apply to the circle plane | `FRotator::ZeroRotator`|

### Next Point Projected (Inside Or On)

Generates a deterministic point inside or on the perimeter of a circle, then projects it to the world. The point is projected in the given direction until it hits something in the world.

![Circle: Next Point Projected](circle/circle-next-point-projected.webp)

## Random

### Random Point (Inside Or On)

Generates a random point inside or on the perimeter of a circle. Uses the non-deterministic random generator for true randomness.

![Circle: Random Point](circle/circle-random-point.webp)

### Random Point Projected (Inside Or On)

Generates a random point inside or on the perimeter of a circle, then projects it to the world. The point is projected in the given direction until it hits something in the world.

![Circle: Random Point Projected](circle/circle-random-point-projected.webp)

## One-Shot

### Random One-Shot Point (Inside Or On)

Generates a random point inside or on the perimeter of a circle using a provided seed. Useful for one-time random point generation with reproducible results.

![Circle: Random One-Shot Point](circle/circle-random-one-shot-point.webp)

### Random One-Shot Point Projected (Inside Or On)

Generates a random point inside or on the perimeter of a circle using a provided seed, then projects it to the world. The point is projected in the given direction until it hits something in the world.

![Circle: Random One-Shot Point Projected](circle/circle-random-one-shot-point-projected.webp)

## Tracked

### Random Tracked Point (Inside Or On)

Generates a random point inside or on the perimeter of a circle while tracking the random seed state. Updates the seed value to enable sequential random point generation.

![Circle: Random Tracked Point](circle/circle-random-tracked-point.webp)

### Random Tracked Point Projected (Inside Or On)

Generates a random point inside or on the perimeter of a circle while tracking the random seed state, then projects it to the world. Updates the seed value to enable sequential random point generation. The point is projected in the given direction until it hits something in the world.

![Circle: Random Tracked Point Projected](circle/circle-random-tracked-point-projected.webp)