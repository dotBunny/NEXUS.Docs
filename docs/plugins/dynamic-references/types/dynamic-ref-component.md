---
sidebar_position: 1
sidebar_label: DynamicRef Component
sidebar_class_name: type ue-actor-component
description: A component which registers and unregisters the owning AActor with the UNDynamicRefSubsystem for future query.
tags: [0.1.0, 0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Dynamic Reference Component

<TypeDetails icon="/assets/svg/dynamic-references/dynamic-ref-component.svg" iconType="img" base="UActorComponent" type="UNDynamicRefComponent" typeExtra="" headerFile="NexusDynamicRefs/Public/NDynamicRefComponent.h" />

A component which registers and unregisters the owning `AActor` with the [UNDynamicRefSubsystem](dynamic-ref-subsystem.md) for future lookup.

![DynamicRef Component](dynamic-ref-component.webp)

## Lifecycle

A single `Lifecycle` setting (of type `ENActorComponentLifecycle`) controls *both* the register and unregister calls — registration always happens during the matching start hook, and unregistration during the paired end hook. This guarantees the two are symmetric.

| Setting | Display | Registers on | Unregisters on |
| :-- | :-- | :-- | :-- |
| `BeginPlay` | Begin Play | `BeginPlay()` | `EndPlay()` |
| `InitializeComponent` | Initialize Component | `InitializeComponent()` | `UninitializeComponent()` |

Choose `InitializeComponent` when other components' `BeginPlay()` needs the registration to already be in place; otherwise `BeginPlay` is the safer default.

## References

A component can claim slots two ways, and both arrays can be populated on the same component:

| Property | Type | Used For |
| :-- | :-- | :-- |
| `Fast References` | `TArray<ENDynamicRef>` | Fixed-slot lookups via the [ENDynamicRef](dynamic-ref.md) enum (fast array-backed). |
| `Named References` | `TArray<FName>` | Free-form `FName` buckets for ad-hoc keys not covered by `ENDynamicRef`. |
| `Tag References` | `FGameplayTagContainer` | A pre-defined tag system, backed by the `FName` buckets. |

There is no hard limit on the number of entries in the arrays. `NDR_None`, `NAME_None`, `FGameplayTag::Empty` entries are skipped during registration.
