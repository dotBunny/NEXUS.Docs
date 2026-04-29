---
sidebar_position: 6
sidebar_label: Actor Pool Object
sidebar_class_name: type ue-object
description: A UObject wrapper around a native FNActorPool, exposing pool operations to Blueprints and UMG bindings.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Object

<TypeDetails icon="ue-object" base="UObject" type="UNActorPoolObject" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolObject.h" />

A `UObject` wrapper around a native [FNActorPool](actor-pool.md), giving Blueprints and UMG widgets a referenceable handle for an otherwise non-`UObject` pool. It is the bridge that lets the [Developer Overlay](../developer-overlay.md) — and any custom UI — observe and interact with a pool through standard `BlueprintCallable` methods and `BindWidget` plumbing.

:::warning[Not For Runtime Usage]

As described this is meant only for interaction with UI, and you should explicitly use the [UNActorPoolSubsystem](actor-pool-subsystem.md) methods otherwise.

:::

## What It Is

- **Blueprint Handle**: Provides a `UObject` identity for a pool so it can be stored in `UPROPERTY` references, passed to widgets, and bound to list views.
- **Thin Wrapper**: Holds a raw `FNActorPool*` and forwards calls to it; it does not own or duplicate any pool state.
- **Display-Aware**: Caches the pool's template class name (with the trailing `_C` stripped) so UI surfaces can render it without re-querying the template every frame.

## What It Does

- **Forwards Pool Operations**: `Spawn(Position, Rotation)`, `GetActor()`, and `Return(Actor)` defer directly to the underlying [FNActorPool](actor-pool.md). All return safe defaults (`nullptr`, `false`) if the wrapper has not been linked.
- **Reports Pool State**: `GetInCount()` and `GetOutCount()` mirror the in/out collections, returning `-1` when unlinked so UI can distinguish "empty" from "no pool".
- **Surfaces Pool Configuration**: `ImplementsPoolItemInterface()`, `ShouldInvokeUFunctions()`, and `GetDescription()` expose the pool's flags and a human-readable description, used by the overlay's tooltips and color swatches.
- **Resolves Display Metadata**: `GetClassName()` returns the cached, sanitized template name; `GetTemplate()` and `GetPoolWorld()` provide the underlying class and `UWorld` for richer lookups.

## Creation

`UNActorPoolObject` is not meant to be constructed directly in user code. Use the static factory, which allocates a transient instance and links it to a native pool in a single step.

```cpp title="Wrapping a Native Pool for UI"
FNActorPool* Pool = UNActorPoolSubsystem::Get(GetWorld())->GetActorPool(MyActorClass);
if (Pool != nullptr)
{
  UNActorPoolObject* PoolObject = UNActorPoolObject::Create(WidgetOuter, Pool);
  // PoolObject can now be passed to a UNListView entry, observed by Blueprints, etc.
}
```

The wrapper is created with `RF_Transient` — it is intended to be short-lived display state, not persisted. If the underlying [FNActorPool](actor-pool.md) is destroyed, the wrapper's calls will continue to forward and crash; tear down the wrapper alongside any UI that references it.

:::info

The [Developer Overlay](../developer-overlay.md) creates one `UNActorPoolObject` per known pool and feeds them into a [UNActorPoolListViewEntry](actor-pool-list-view-entry.md). Custom overlays can follow the same pattern.

:::
