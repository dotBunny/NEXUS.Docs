---
sidebar_label: Box
sidebar_class_name: type ue-blueprint-function-library
description: Provides various functions for generating points inside or on the surface of a FBox using different random generation strategies.
toc_min_heading_level: 2
toc_max_heading_level: 5
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Box

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNBoxPickerLibrary" typeExtra="/ FNBoxPicker" headerFile="NexusActorPools/Public/NBoxPickerLibrary.h" />

Provides various functions for generating points inside or on the surface of a `FBox` using different random generation strategies (deterministic, non-deterministic, seeded).

The `UNBoxPickerLibrary` wraps the native `FNBoxPicker` functionality in a **Blueprint** friendly manner. Should you be wanting to utilize a picker in _native_ code it is best to directly reference `FNBoxPicker` directly to avoid the abstraction layer as it has a similar API.

## Methods

:::tip

There are **Simple** variants of all of these methods which removes the inner exclusion when not needed as a minor optimization.

:::

### Next Point (IO)

![Box: Next Point](box/box-next-point.webp) 

Gets the next deterministic point  ***[i]nside or [o]n*** a `FBox`.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Next Point Projected (IO)

![Box: Next Point Projected](box/box-next-point-projected.webp)

Gets the next deterministic point ***[i]nside or [o]n*** a `FBox` and projects it in the given direction.

:::info

Uses `FNRandom::Deterministic` to ensure reproducible results.

:::

### Random Point (IO)

![Box: Random Point](box/box-random-point.webp)

Gets a random point ***[i]nside or [o]n*** a `FBox`.

### Random Point Projected (IO)

![Box: Random Point Projected](box/box-random-point-projected.webp)

Gets a random point ***[i]nside or [o]n*** a `FBox` and projects it in the given direction.

### Random One-Shot Point (IO)

![Box: Random One-Shot Point](box/box-random-one-shot-point.webp)

Gets a random point ***[i]nside or [o]n*** a `FBox` using a one-shot seed.

### Random One-Shot Point Projected (IO)

![Box: Random One-Shot Point Projected](box/box-random-one-shot-point-projected.webp)

Gets a random point ***[i]nside or [o]n*** a `FBox` using a one-shot seed and projects it in the given direction.

### Random Tracked Point (IO)

![Box: Random Tracked Point](box/box-random-tracked-point.webp)

Gets a random point ***[i]nside or [o]n*** a `FBox` using a tracked seed. The seed is incremented each time this function is called.

### Random Tracked Point Projected (IO)

![Box: Random Tracked Point Projected](box/box-random-tracked-point-projected.webp)

Gets a random point ***[i]nside or [o]n*** a `FBox` using a tracked seed and projects it in the given direction. The seed is incremented each time this function is called.

## Parameters

|Variant|Parameter|Type|Description|Default|
|:--|:--|:--|:--|:--|
| _Base_ | Origin | `FVector&` |The center world point of the `FBox`. ||
| _Base_ | MinimumRadius | `FBox&` | The minimum dimensions to use when generating a point. ||
| _Base_ | MaximumRadius | `FBox&` | The maximum dimensions to use when generating a point. ||
| **Simple** | Dimensions | `FBox&` | The dimensions of the `FBox`. |
| **Projected** | WorldContextObject | `UObject*` | Object that provides access to the world, usally auto-filled in Blueprint. | `WorldContext` |
| **Projected** | Projection | `FVector` | Direction and distance for the line trace. | `FVector(0,0,-500.f)` |
| **Projected** | CollisionChannel | `ECollisionChannel` | The collision channel to use for tracing. | `ECC_WorldStatic` |
| **Tracked** | Seed | `int32&` | The seed to be used when generating, and altered for determinism. | |
| **One-Shot** | Seed | `int32` | The throw-away seed used when generating. | |