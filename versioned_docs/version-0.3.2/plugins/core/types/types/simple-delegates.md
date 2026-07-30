---
sidebar_class_name: type ue-enum
description: Two parameterless multicast delegate declarations plus a discriminator selecting between them.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Simple Delegates

<TypeDetails icon="ue-enum" base="enum" type="ENSimpleDelegateType" typeExtra="" headerFile="NexusCore/Public/Types/NSimpleDelegates.h" />

Declares the two parameterless multicast delegate types NEXUS reuses across plugins, so a "something happened, no payload" event does not need a bespoke declaration each time.

## The Delegates

```cpp
DECLARE_MULTICAST_DELEGATE(FNSimpleMulticastDelegate);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FNSimpleDynamicMulticastDelegate);
```

| Delegate | Use it when |
| :-- | :-- |
| `FNSimpleMulticastDelegate` | Native-only subscribers. Cheaper, and bound with `AddUObject` / `AddRaw`. Not visible to Blueprint. |
| `FNSimpleDynamicMulticastDelegate` | Blueprint needs to subscribe. Declare the property `BlueprintAssignable` and designers can bind it in a graph. |

Pick the dynamic form only when Blueprint exposure is actually wanted — it carries the reflection overhead that the native form avoids. [`UNWorldAssemblySubsystem`](../../../world-assembly/types/world-assembly-subsystem.md#events) uses the dynamic variant for its `OnOperationsCompleted` and `OnCleared` events for exactly that reason.

## ENSimpleDelegateType

```cpp
UENUM()
enum class ENSimpleDelegateType : uint8
{
    Multicast = 0,
    DynamicMulticast = 1,
};
```

A discriminator for code that must refer to *which* of the two flavors it means — for example a helper that binds to one or the other depending on configuration. It carries no delegate itself.

Note this enum is plain `UENUM()` rather than `UENUM(BlueprintType)`, so unlike most NEXUS enums it is not selectable in Blueprint.
