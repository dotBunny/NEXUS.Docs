---
sidebar_class_name: type ue-actor-component
description: A component which registers and unregisters the owning AActor with the UNDynamicRefSubsystem for future query.
---

import TypeDetails from '@site/src/components/TypeDetails';

# DynamicRef Component

<TypeDetails icon="/assets/svg/dynamic-references/dynamic-ref-component.svg" iconType="img" base="UActorComponent" type="UNDynamicRefComponent" typeExtra="" headerFile="NexusDynamicRefs/Public/NDynamicRefComponent.h" />

A component which registers and unregisters the owning `AActor` with the [UNDynamicRefSubsystem](dynamic-ref-subsystem.md) for future lookup.

![DynamicRef Component](/assets/images/docs/dynamic-references/types/dynamic-ref-component.webp)

## Lifecycle

A single `Lifecycle` setting (of type `ENActorComponentLifecycle`) controls *both* the register and unregister calls — registration always happens during the matching start hook, and unregistration during the paired end hook. This guarantees the two are symmetric.

| Setting | Display | Registers on | Unregisters on |
| :-- | :-- | :-- | :-- |
| `BeginPlay` | Begin Play | `BeginPlay()` | `EndPlay()` |
| `InitializeComponent` | Initialize Component | `InitializeComponent()` | `UninitializeComponent()` |

Choose `InitializeComponent` when other components' `BeginPlay()` needs the registration to already be in place; otherwise `BeginPlay` is the safer default.

## References

A component can claim slots three ways, and all three can be populated on the same component:

| Property | Type | Used For |
| :-- | :-- | :-- |
| `Fast References` | `TArray<TEnumAsByte<ENDynamicRef>>` | Fixed-slot lookups via the [ENDynamicRef](dynamic-ref.md) enum (fast array-backed). |
| `Named References` | `TArray<FName>` | Free-form `FName` buckets for ad-hoc keys not covered by `ENDynamicRef`. |
| `Tag References` | `FGameplayTagContainer` | A pre-defined tag system, backed by the `FName` buckets. |

Tag references are not a third storage mechanism — each tag is registered under its own `FName` via `GetTagName()`, so a tag and a named reference of the same string resolve to the same bucket.

There is no hard limit on the number of entries in the arrays. `NDR_None`, `NAME_None`, and `FGameplayTag::EmptyTag` entries are skipped during registration.

## Methods

### To String Slow

```cpp
/**
 * Resolve an ENDynamicRef value to its human-readable display name via UE reflection.
 * @param DynamicReference The enum value to convert.
 * @return The display name (e.g. "Objective A").
 * @note Uses reflection; avoid in tight loops.
 */
static FString ToStringSlow(const ENDynamicRef& DynamicReference);
```

A static helper for turning a slot identifier into its editor display name — handy for debug readouts. As the name warns, it resolves through `StaticEnum<>()` reflection on every call, so keep it out of hot paths.
