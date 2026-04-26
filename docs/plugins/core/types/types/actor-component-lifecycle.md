---
sidebar_position: 39
sidebar_label: Actor Component Lifecycle
sidebar_class_name: type ue-enum
description: Identifies which UActorComponent lifecycle hook a feature should initialize or tear down on.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Actor Component Lifecycle

<TypeDetails icon="ue-enum" base="enum" type="ENActorComponentLifecycleStart" typeExtra="/ ENActorComponentLifecycleEnd" headerFile="NexusCore/Public/Types/NActorComponentLifecycle.h" />

A pair of enums identifying which `UActorComponent` lifecycle hook a feature should initialize or tear down on. Use the `Start` enum to choose whether a system runs setup code during `BeginPlay` (the gameplay-side default) or earlier in `InitializeComponent` (when other components depend on this setup being in place); pair it with the matching `End` value for symmetric teardown.

## ENActorComponentLifecycleStart

```cpp
UENUM(BlueprintType)
enum class ENActorComponentLifecycleStart : uint8
{
    /** Defer initialization until BeginPlay; safe for most gameplay-side setup. */
    BeginPlay = 0,
    /** Initialize earlier, during InitializeComponent; required when setup must be in place before other components' BeginPlay runs. */
    InitializeComponent = 1,
};
```

## ENActorComponentLifecycleEnd

```cpp
UENUM(BlueprintType)
enum class ENActorComponentLifecycleEnd : uint8
{
    /** Tear down during EndPlay; mirrors the BeginPlay start path. */
    EndPlay = 0,
    /** Tear down during UninitializeComponent; mirrors the InitializeComponent start path. */
    UninitializeComponent = 1,
};
```
