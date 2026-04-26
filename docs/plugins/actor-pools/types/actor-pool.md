---
sidebar_position: 1
sidebar_label: Actor Pool
sidebar_class_name: type native-class
description: A runtime object pool that efficiently manages a collection of spawned AActors.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool

<TypeDetails icon="native-class" base="class" type="FNActorPool" typeExtra="" headerFile="NexusActorPools/Public/NActorPool.h" />

A runtime object pool that efficiently manages a collection of spawned `AActors`. It's designed to improve performance by reusing actors instead of constantly creating and destroying them, which is particularly beneficial for frequently spawned objects like projectiles or enemies. This particular object should typically only be interacted with _natively_ and through accessors from the [UNActorPoolSubsystem](actor-pool-subsystem.md).

:::tip[Usage]

Refer to [UNActorPoolSubsystem](actor-pool-subsystem.md) for both _blueprint_ and _native_ usage examples.

:::

## Highlights

- **Object Pooling**: Maintains two collections of actors - those available for use ("in" the pool) and those currently active ("out" of the pool).
- **Efficient Actor Management**: Pre-spawns a configurable number of actors and keeps them ready for immediate use.
- **Seamless Spawning**: Provides `Get()` (reference) and `Spawn()` (activate) methods that retrieve actors from the pool instantly, avoiding the overhead of traditional actor spawning.
- **Automatic Return**: Allows actors to be returned to the pool via the `Return()` method for reuse.
- **Configurable Settings**: Supports customizable pool settings via [FNActorPoolSettings](actor-pool-settings.md) including minimum pool sizes and spawning strategies.
- **Smart Initialization**: Can pre-fill or "warm" the pool with a specified number of actors.

## Benefits

- **Performance**: Eliminates the cost of repeatedly spawning and destroying actors.
- **Memory Management**: Reduces garbage collection pressure by reusing existing objects.
- **Consistency**: Provides predictable performance for systems that require frequent actor creation.
- **Flexibility**: Works with any Subclass of `AActor` and supports interface-based customization through [INActorPoolItem](actor-pool-item.md).

:::warning[Game Thread Only]

`FNActorPool` is **not thread-safe**. All operations create or move `AActor`s and therefore must run on the game thread. There are no internal locks; do not call any of the methods below from a worker thread.

:::

## Native API

`FNActorPool` is not a `UObject`, so it is reachable only from native code. Get a pointer from the [UNActorPoolSubsystem](actor-pool-subsystem.md) (`GetActorPool(ActorClass)`) and operate on the returned pointer directly.

### Lifecycle

```cpp
/** Construct an ActorPool for ActorClass in TargetWorld using the project's default settings. */
FNActorPool(UWorld* TargetWorld, const TSubclassOf<AActor>& ActorClass);

/** Construct an ActorPool for ActorClass with explicit settings overriding the defaults. */
FNActorPool(UWorld* TargetWorld, const TSubclassOf<AActor>& ActorClass, const FNActorPoolSettings& InActorPoolSetting);

/** Empty the pool of every Actor it owns (in or out); pass true to force-destroy without lifecycle callbacks. */
void Clear(const bool bForceDestroy = false);

/** Fill the pool up to MinimumActorCount, respecting the configured per-tick creation limit. */
void Fill();

/** Pre-create the requested number of Actors immediately, ignoring per-tick limits. */
void Prewarm(int32 Count);

/** Replace the active settings with InNewSettings; takes effect on subsequent operations. */
void UpdateSettings(const FNActorPoolSettings& InNewSettings);

/** Internal tick used by the subsystem to drive deferred creation and per-tick maintenance. */
void Tick();
```

### Get / Spawn / Return

```cpp
/** Reserve an Actor from the pool without firing any lifecycle callbacks; use Spawn for activation. */
AActor* Get();

/** Spawn an Actor at Position/Rotation, firing the configured lifecycle callbacks. */
AActor* Spawn(const FVector& Position, const FRotator& Rotation);

/** Return Actor to the pool; accepts any Actor regardless of original ownership. */
bool Return(AActor* Actor);
```

### Queries

```cpp
/** Number of Actors currently held by the pool (available for Get/Spawn). */
int32 GetInCount() const;

/** Number of Actors currently checked out and active in the world. */
int32 GetOutCount() const;

/** True when the pool has no available Actors (does not count those checked out). */
bool IsEmpty() const;

/** True when the underlying template implements [INActorPoolItem](actor-pool-item.md). */
bool DoesSupportInterface() const;

/** True when the pool's settings have the InvokeUFunctions flag set. */
bool HasInvokeUFunctionFlag() const;

/**
 * True when this pool is a client-side stub for a ServerOnly pool.
 * @note Stub pools short-circuit Return / Spawn / Tick to no-ops so they can exist on
 *       non-authoritative peers without doing work.
 */
bool IsStubMode() const;
```

### Accessors

```cpp
/** Read-only access to the active settings. */
const FNActorPoolSettings& GetSettings() const;

/** The Actor class the pool spawns and pools. */
TSubclassOf<AActor> GetTemplate() const;

/** The world the pool's Actors are spawned into. */
UWorld* GetWorld() const;

/**
 * Multi-line human-readable summary of world, template, strategy, and flags.
 * @remark Intended for debugging and the [Developer Overlay](../developer-overlay.md);
 *         the format is not stable and should not be parsed.
 */
FText GetDescription() const;
```
