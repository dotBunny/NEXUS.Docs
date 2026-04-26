---
sidebar_position: 40
sidebar_label: Build Configuration Availability
sidebar_class_name: type native-class
description: Bit flags identifying the Unreal build configurations a feature should be available in.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Build Configuration Availability

<TypeDetails icon="native-class" base="class" type="FNBuildConfigurationAvailability" typeExtra="" headerFile="NexusCore/Public/Types/NBuildConfigurationAvailability.h" />

Bit flags identifying the Unreal build configurations a feature should be available in. Combine with `ENUM_CLASS_FLAGS`-style bitwise operators or the `N_BUILD_CONFIGURATION_AVAILABILITY_*` helper masks below to set a specific availability profile.

## ENBuildConfigurationAvailability

```cpp
UENUM(meta=(Bitflags,UseEnumValuesAsMaskValuesInEditor=true))
enum class ENBuildConfigurationAvailability : uint8
{
    None = 0 UMETA(Hidden),
    Debug =  1 << 0,
    Development = 1 << 1,
    Shipping = 1 << 2,
    Test = 1 << 3,
    Editor = 1 << 4
};
ENUM_CLASS_FLAGS(ENBuildConfigurationAvailability)
```

## Helper Masks

```cpp
/** All build configurations, including Shipping. */
#define N_BUILD_CONFIGURATION_AVAILABILITY_ALL ...

/** Every build configuration except Shipping; use for developer-only features. */
#define N_BUILD_CONFIGURATION_AVAILABILITY_ALL_NOT_SHIPPING ...
```

## Methods

### Is Available In Build

Checks whether the current build configuration is included in `BuildConfigurationAvailability`.

```cpp
/**
 * Checks whether the current build configuration is included in BuildConfigurationAvailability.
 * @param BuildConfigurationAvailability Bit mask of permitted configurations.
 * @return true when the current build matches one of the flagged configurations.
 */
FORCEINLINE static bool IsAvailableInBuild(ENBuildConfigurationAvailability BuildConfigurationAvailability);
```
