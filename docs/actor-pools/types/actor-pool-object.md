---
sidebar_class_name: type ue-object
description: A UObject wrapper around a native FNActorPool, exposing pool operations to Blueprints and UMG bindings.
---

import TypeDetails from '@site/src/components/TypeDetails';

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
- **Reports Pool State**: `GetAvailableCount()` and `GetSpawnedCount()` mirror the in/out collections, returning `-1` when unlinked so UI can distinguish "empty" from "no pool".
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

The wrapper is created with `RF_Transient` — it is intended to be short-lived display state, not persisted.

### Surviving A Destroyed Pool

Linking is two-way. `Create` stores the pool on the wrapper *and* a back-pointer to the wrapper on the pool, so `FNActorPool`'s destructor can null the wrapper's pool reference. A wrapper therefore outlives its pool safely rather than dangling — which matters because the world owns pool lifetime and tears them down on teardown, not the UI holding the wrapper.

```cpp
/** @return true if this wrapper is still linked to a live native FNActorPool. */
bool IsValid() const;
```

Check `IsValid()` before reading through a wrapper you have held across a level transition or world teardown; it returns `false` once the pool is gone, letting you skip work instead of dereferencing a destroyed pool. The accessors are safe to call either way — there is no need to tear the wrapper down defensively in lockstep with the pool.

:::info

The [Developer Overlay](../developer-overlay.md) creates one `UNActorPoolObject` per known pool and feeds them into a [UNActorPoolListViewEntry](actor-pool-list-view-entry.md). Custom overlays can follow the same pattern.

:::
