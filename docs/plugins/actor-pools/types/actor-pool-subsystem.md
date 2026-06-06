---
sidebar_class_name: type ue-world-subsystem
description: A centralized management system that provides UWorld-specific access to AActor pooling functionality, acting as the primary interface for creating, managing, and accessing multiple FNActorPools.
tags: [0.1.0, 0.3.1]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Actor Pool Subsystem

<TypeDetails icon="ue-world-subsystem" base="UTickableWorldSubsystem" type="UNActorPoolSubsystem" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolSubsystem.h" />

A centralized management system that provides `UWorld`-specific access to `AActor` pooling functionality, acting as the primary interface for creating, managing, and accessing multiple [FNActorPools](actor-pool.md).

## What It Does

- **Unified Experience:** Provides simple methods to get, spawn, and return `AActor` without directly managing [FNActorPools](actor-pool.md)s.
- **Centralized Pool Management:** Automatically creates and maintains pool lifecycles for different `AActor` sub-classes as requested.
- **Blueprint Accessible:** Offers preferred Blueprint support for designers and non-programmers.

## Usage

### Creating An Actor Pool

When trying to maximize the usefulness of the actor pooling pattern, it is essential to try to create pools ahead of the actual usage of the `AActors` so that the initial creation cost is controlled. 

#### Manually

The time-tested, I know what I want, let me handle this approach.  You can tell the `UNActorPoolSubsystem` to spin up pools via `CreateActorPool()`.

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/d222okvx/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '455px' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Creating An Actor Pool"
UNActorPoolSubsystem::Get(GetWorld())->CreateActorPool(MyActorClass, UNActorPoolsSettings::Get()->DefaultSettings);
```    
  </TabItem>
</Tabs>

#### Actor Pool Sets

Utilizing [UNActorPoolSets](actor-pool-set.md) to define collections of [FNActorPools](actor-pool.md) that should be created when [applied](/docs/plugins/actor-pools/types/actor-pool-set/#applying) is a great way to develop reusable implementations across different levels and scenarios.

#### Automatically

While not the best, it is the easiest way to create a [FNActorPools](actor-pool.md) for an `AActor`. Requesting an `AActor` from the [UNActorPoolSubsystem](actor-pool-subsystem.md) without an existing [FNActorPools](actor-pool.md) for it will cause a new one to be created with the default settings.

### Spawning An Actor

The most common of interactions with the [UNActorPoolSubsystem](actor-pool-subsystem.md) that you will have is asking it for an `AActor`. The API is as streamlined as possible.

:::tip[Soft-Referenced Classes]

If your Blueprint references the `AActor` class as a `TSoftClassPtr` rather than a hard reference, use [Spawn Actor Async](spawn-actor-async.md) (or [Get Actor Async](get-actor-async.md) if you don't need a transform) so the load and pool lookup happen off the calling frame.

:::

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/tlzo2p-f/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '325px' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Spawn Actor"
AMyActorType* SpawnedActor = UNActorPoolSubsystem::Get(GetWorld())->SpawnActor<AMyActorType>(MyActorClass, MyPosition, MyRotation);
```    
  </TabItem>
</Tabs>

### Returning An Actor

When you're finished with an `AActor`, you can interact with the [UNActorPoolSubsystem](actor-pool-subsystem.md) and have it return the `AActor` to its designated [FNActorPool](actor-pool.md). If the `AActor` implements the [INActorPoolItem](actor-pool-item.md) interface, you also have a more direct method call available, `ReturnToActorPool()`.

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/mtuyqlwn/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '325px' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Ambiguous Return"
UNActorPoolSubsystem::Get(GetWorld())->ReturnActor(TargetActor);
```
  </TabItem>
</Tabs>

#### Unknown Actor Behavior

When `ReturnActor` is called with an `AActor` that does not belong to any pool managed by this subsystem, the `ENActorPoolUnknownBehavior` policy decides what happens:

| Value | Behavior |
| :-- | :-- |
| `Destroy` | Destroy the unknown `AActor`. *(default)* |
| `CreateDefaultPool` | Create a default pool on-the-fly for the `AActor`'s class and return it there. |
| `Ignore` | Do nothing; leave the `AActor` as-is. |

The initial value is read from [Returned Unknown Actor](../project-settings.md) on `OnWorldBeginPlay`. To override the policy at runtime — for example, to flip to `Ignore` while a streaming-out region tears down — call `SetUnknownBehavior` from native code. See the [Native API](#native-api) section below.

## UFunctions

The methods exposed to Blueprint.

### Get Actor

```cpp
/**
 * Gets an actor from a given pool, creating a pool as necessary.
 * @note This does not trigger any events on the given actor, it does not activate them in any way.
 * @param ActorClass The class of the actor which you would like to get from the actor pool.
 * @param ReturnedActor The returned actor, or nullptr if the pool could not provide one.
 * @return true if an actor was successfully retrieved, false otherwise.
 */
bool GetActor(TSubclassOf<AActor> ActorClass, AActor*& ReturnedActor);
```

Check the `bool` return before reading `ReturnedActor`; it will be `nullptr` if the pool could not provide one (for example when capacity is exhausted and the pool is configured to refuse growth). When you need a fully positioned and activated `AActor`, use [Spawn Actor](#spawn-actor) instead.

:::warning

This does not trigger any events on the given actor, it does not activate them in any way.

:::

### Spawn Actor

```cpp
/**
 * Spawns an actor from a given pool, creating a pool as necessary, positioning it in the world and activating it.
 * @note Unlike GetActor, this places the actor at the supplied transform and triggers OnSpawnedFromActorPool on the returned actor.
 * @param ActorClass The class of the actor which you would like to spawn from the actor pool.
 * @param Position The world position to spawn the actor at.
 * @param Rotation The world rotation to apply to the spawned actor.
 * @param SpawnedActor The spawned actor, or nullptr if the pool could not provide one.
 * @return true if an actor was successfully spawned, false otherwise.
 */
bool SpawnActor(TSubclassOf<AActor> ActorClass, FVector Position, FRotator Rotation, AActor*& SpawnedActor);
```

Unlike [Get Actor](#get-actor), `SpawnActor` places the `AActor` at the supplied `Position` / `Rotation` and triggers `OnSpawnedFromActorPool` on the returned `AActor` — use it whenever you want a fully activated `AActor` ready to play in the world. Check the `bool` return before reading `SpawnedActor`; it will be `nullptr` if the pool could not provide one (for example when capacity is exhausted and the pool is configured to refuse growth).

:::tip

If you are working in native, use the native templated version of this function as it will let you pre-cast the return value to your desired type.

:::

### Return Actor

```cpp
/**
  * Attempts to return an Actor to its owning pool.
  * @note If the returned actor does not belong in a pool the UNActorPoolsSettings::UnknownBehavior is applied.
  * @param Actor The target actor to return to a pool.
  * @return true/false if the Actor was returned to a pool.
  */
bool ReturnActor(AActor* Actor);
```

### Return All Actors

```cpp
/**
 * Return every spawned Actor back to its owning pool, across all registered pools.
 * @note Only pools whose settings have the ENActorPoolSupportFlags::ReturnAll support flag set
 *       are affected; pools without it are left untouched.
 */
void ReturnAllActors();
```

Bulk-returns every spawned (`out`) `AActor` across all pools the subsystem manages. Only pools that opt in via the [`ReturnAll` SupportFlag](actor-pool-settings.md#support-flags) are processed — pools without it are skipped, so this is safe to call broadly (for example on a level reset) without disturbing pools that manage their own lifecycle.

### Create Actor Pool

```cpp
/**
  * Create an actor pool for the provided Actor class; if one does not already exist.
  * @param ActorClass The class of the actor which you would like to create a pool for.
  * @param Settings  The settings to apply to the created pool.
  * @return true/false if a new pool was created.
  */
bool CreateActorPool(TSubclassOf<AActor> ActorClass, FNActorPoolSettings Settings);
```

### Has Actor Pool

```cpp
/**
  * Does the given Actor class have a pool already created?
  * @param ActorClass The class of the actor which you would like to check for a pool.
  * @return true/false if a pool already exists.
  */
bool HasActorPool(const TSubclassOf<AActor>& ActorClass) const { return ActorPools.Contains(ActorClass); }
```

### Apply ActorPoolSet

```cpp
/**
  * Apply a preconfigured ActorPoolSet, creating the defined pools.
  * @param ActorPoolSet  The ActorPoolSet to evaluate.
  */
void ApplyActorPoolSet(UNActorPoolSet* ActorPoolSet);
```

### Get ActorPool Stats

```cpp
/**
 * Get the current usage statistics for a given Actor class's pool.
 * @param ActorClass The class of the actor which you would like the pool statistics for.
 * @return An FIntVector2 where X is the spawned (in-use) count and Y is the available count; a zeroed vector is returned if no pool exists.
 */
FIntVector2 GetActorPoolStats(const TSubclassOf<AActor> ActorClass) const;
```

A lightweight, Blueprint-friendly snapshot of a single pool's occupancy. The returned `FIntVector2` packs the two counts the [FNActorPool](actor-pool.md#queries) tracks internally — `X` is the spawned (in-use, "out") count and `Y` is the available ("in") count. A zeroed vector (`0, 0`) is returned when no pool exists for the supplied `ActorClass`, so it is safe to call without first checking [Has Actor Pool](#has-actor-pool); just be aware that a zeroed result is indistinguishable from an empty, idle pool. This is intended for HUDs, debug overlays, and tuning — for direct access to the pool itself use the native [Get Actor Pool](#get-actor-pool).

## Native API

The methods below are available to C++ only — they are not exposed to Blueprint and are intended for native gameplay or systems code that needs direct access to the underlying [FNActorPool](actor-pool.md) instances or runtime policy controls.

### Set Unknown Behavior

```cpp
/**
 * Override the policy applied when ReturnActor is called with an Actor unknown to this subsystem.
 * @note Initialized from UNActorPoolsSettings::UnknownBehavior on world begin play; use this to override at runtime.
 * @param Behavior The new unknown-actor policy to apply.
 */
void SetUnknownBehavior(const ENActorPoolUnknownBehavior Behavior);
```

The starting value is sourced from [Returned Unknown Actor](../project-settings.md) when the world begins play. Call this to switch the policy mid-session — for example, to temporarily `Ignore` returns during a streaming teardown so transient `AActor`s aren't recycled into pools that are about to be destroyed.

```cpp title="Override at Runtime"
UNActorPoolSubsystem::Get(GetWorld())->SetUnknownBehavior(ENActorPoolUnknownBehavior::Ignore);
```

### Get Actor Pool

```cpp
/**
 * Get the pointer to the actor pool itself for a given Actor class.
 * @param ActorClass The class of the actor which you would like to access a pool for.
 * @return The pointer to the pool, or nullptr if it was not found.
 */
FNActorPool* GetActorPool(const TSubclassOf<AActor> ActorClass) const;
```

Returns `nullptr` when no pool exists for the supplied class — always null-check the result before dereferencing. Pair with [Has Actor Pool](#has-actor-pool) when you only need a presence check.

### Get All Pools

```cpp
/**
 * Get an array of all the Actor Pools.
 * @return An array of raw pointers to all the known FNActorPools
 * @remark This is not meant to be used often and is more for debugging purposes.
 */
TArray<FNActorPool*> GetAllPools() const;
```

### On Actor Pool Added

```cpp
/**
 * Event triggered when a new pool is added to the UNActorPoolSubsystem.
 * @remark Meant for native code only to ensure efficiency.
 */
OnActorPoolAddedDelegate OnActorPoolAdded;
```

A native multicast delegate (`DECLARE_MULTICAST_DELEGATE_OneParam(..., FNActorPool*)`) that fires whenever a new pool is registered — including pools created lazily by [Get Actor](#get-actor), [Spawn Actor](#spawn-actor), the `CreateDefaultPool` unknown-actor path, or an applied [UNActorPoolSet](actor-pool-set.md). Bind from native via `OnActorPoolAdded.AddUObject(...)` and clean up with `RemoveAll(this)` in your teardown.