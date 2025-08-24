---
sidebar_position: 1
sidebar_label: Dynamic Reference Component
sidebar_class_name: type ue-actor-component
description: A component which registers and unregisters the owning AActor with the UNDynamicReferencesSubsystem for future query.
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Dynamic Reference Component

<TypeDetails icon="/assets/svg/dynamic-references/dynamic-references-component.svg" iconType="img" base="UActorComponent" type="UNDynamicReferencesComponent" typeExtra="" headerFile="NexusDynamicReferences/Public/NDynamicReferencesComponent.h" />

A component which registers and unregisters the owning `AActor` with the [UNDynamicReferencesSubsystem](dynamic-reference-subsystem.md) for future query.

## Registration

The component has settings for when the `AActor` is registered with the [UNDynamicReferencesSubsystem](dynamic-reference-subsystem.md) and for when it is unregistered. These correspond to different states of the lifecycle of the component, allowing for some other logic to occur before the `AActor` is referenceable, for example. 

### Link Phase

Utilizes a `ENActorComponentLifecycleStart` enumeration to determine when to register.

| Setting  | Display | Behaviour |
| :-- | :-- | --- |
| `ACLS_BeginPlay` | Begin Play | Triggers registration during the components `BeginPlay()` call. |
| `ACLS_InitializeComponent` | Initialize Component | Triggers registration during the components `InitializeComponent()` call. |

### Break Phase

Utilizes a `ENActorComponentLifecycleEnd` enumeration to determine when to unregister.

| Setting  | Display | Behaviour |
| :-- | :-- | --- |
| `ACLE_EndPlay` | End Play | Triggers unregistering during the components `EndPlay()` call. |
| `ACLE_UninitializeComponent` | Uninitialize Component | Triggers unregistering during the components `UninitializeComponent()` call. |

## References

There is no hard limit on the number of reference types ([ENDynamicReference](dynamic-reference.md)) you can apply to a given component.
