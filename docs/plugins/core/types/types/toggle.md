---
sidebar_position: 50
sidebar_label: Toggle
sidebar_class_name: type native-class
description: An enumeration representing a boolean value with a default option, plus a utility class for stringification.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Toggle

<TypeDetails icon="native-class" base="class" type="FNToggle" typeExtra="" headerFile="NexusCore/Public/Types/NToggle.h" />

A utility class for operating on [`ENToggle`](#entoggle) — an enumeration representing a boolean value with a default option ("take no action").

## ENToggle

```cpp
UENUM(BlueprintType)
enum ENToggle : int8
{
    T_Default = -1     UMETA(DisplayName = "Default", Description = "Take no action"),
    T_False = 0        UMETA(DisplayName = "False"),
    T_True = 1         UMETA(DisplayName = "True")
};
```

## Methods

### To String

Returns a human-readable name for `InToggle`.

```cpp
/**
 * Returns a human-readable name for InToggle.
 * @param InToggle The enum value to stringify.
 * @return "Default", "False", "True", or "Unknown" for unrecognized values.
 */
static FString ToString(const ENToggle& InToggle);
```
