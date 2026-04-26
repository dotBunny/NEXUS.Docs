---
sidebar_position: 43
sidebar_label: Direction
sidebar_class_name: type native-class
description: The six axis-aligned directions in Unreal's left-handed coordinate system, plus FVector lookup helpers.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Direction

<TypeDetails icon="native-class" base="class" type="FNDirection" typeExtra="" headerFile="NexusCore/Public/Types/NDirection.h" />

Lookup helpers that map [`ENDirection`](#endirection) values to their canonical `FVector`.

## ENDirection

The six axis-aligned directions in Unreal's left-handed coordinate system.

```cpp
UENUM(BlueprintType)
enum class ENDirection : uint8
{
    Up = 0,
    Down = 1,
    Forward = 2,
    Backward = 3,
    Right = 4,
    Left = 5
};
```

## Methods

### Get Vector

Returns the engine's canonical unit vector for `Direction`.

```cpp
/**
 * Returns the engine's canonical unit vector for Direction.
 * @param Direction The axis-aligned direction to look up.
 * @return The matching unit vector, or the zero vector if Direction is unrecognized.
 */
static const FVector& GetVector(const ENDirection& Direction);
```
