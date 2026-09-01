---
sidebar_class_name: type native-class
description: An enumeration representing a boolean value with a default option, plus a utility class for stringification.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Toggle

<TypeDetails icon="native-class" base="class" type="FNToggle" typeExtra="" headerFile="NexusCore/Public/Types/NToggle.h" />

A utility class for operating on [`ENToggle`](#entoggle) — an enumeration representing a boolean value with a default option ("take no action").

## ENToggle

```cpp
UENUM(BlueprintType)
enum class ENToggle : uint8
{
    Default = 0        UMETA(DisplayName = "Default", Description = "Take no action"),
    Disabled = 1       UMETA(DisplayName = "Disabled"),
    Enabled = 2        UMETA(DisplayName = "Enabled")
};
```

`Default` is the zero value, so a freshly default-constructed `ENToggle` means "take no action" rather than `Disabled`. Because this is a scoped enumeration, enumerators must be qualified in native code (`ENToggle::Enabled`).

## Methods

### To String

Returns a human-readable name for `InToggle`.

```cpp
/**
 * Returns a human-readable name for InToggle.
 * @param InToggle The enum value to stringify.
 * @return "Default", "Disabled", "Enabled", or "Unknown" for unrecognized values.
 */
static FString ToString(const ENToggle& InToggle);
```
