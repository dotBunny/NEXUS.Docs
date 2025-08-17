---
sidebar_position: 2
sidebar_label: Actor Pool Settings
sidebar_class_name: type native-struct
description: TBD
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Settings

<TypeDetails icon="native-struct" base="UStruct" type="FNActorPoolSettings" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolSettings.h" />

A Blueprint-compatible struct that defines configuration parameters for managing object pooling inside of a [NActorPool](actor-pool.md). This struct provides comprehensive settings to control how actors are created, managed, and recycled.

## Highlights

- **Pool Size Management**: Controls minimum (default: 10) and maximum (default: 100) actor counts in the pool.
- **Performance Optimization**: Configurable objects-per-tick creation limit and pool expansion policies.
- **Flexible Strategies**: Supports different pooling strategies through [ENActorPoolStrategy](#creation-strategies).
- **Spawn Behavior Control**: Options for deferred construction, finish spawning behavior, and location management.
- **Return Mechanics**: Configurable return location and movement behavior for recycled `AActor`s.

## Configuration Options

| Setting  | Base | Description | Default |
| :-- | :-- | --- | :-- |
| `MinimumActorCount` | `int` | When the [NActorPool](actor-pool.md) is being filled during creation, what is the number of prewarmed `AActor`s that should be created, either syncronously or divided across a number of frames. | `10` |
| `MaximumActorCount` | `int` | The number of pooled `AActor`s that a pool can use/have. This is tied more to the `Strategy` being used for what happens when the pool has to create new `AActor`s when the pool has no `AActor`s available to `Spawn()`/`Get()`. | `100` |
| `CreateObjectsPerTick` | `int` | Throttles the number of `AActor`s that can be created per **Tick**. This can be useful to spread the cost of warming a pool up across multiple frames (-1 for unlimited). | `-1` |
| `Strategy` | [ENActorPoolStrategy](#creation-strategies) | Determines the approach taken when the pool does not have any `AActor` remaining in the "In" pool, and needs to create one (or reuse). | `APS_Create` |
| `bSpawnSweepBeforeSettingLocation` | `bool` | Should a sweep be done when setting the location of an `AActor` being spawned. | `false` |
| `bReturnMoveToLocation` | `bool` | Should `AActor` being returned to the pool be moved to a storage location? | `true` |
| `ReturnMoveLocation` | `FVector` | The location to move an `AActor` when it is returned to the pool for later reuse (if enabled). This also gets applied to newly created `AActor` as well.  | `(0,0,0)` |
| `bDeferConstruction` | `bool` | Controls whether `AActor` construction is deferred when creating new `AActor`s; allowing for additional calls to be made to the `INActorPoolItem::OnDeferredConstruction()` before calling the `AActor`s `FinishSpawning()`. | `true` | 
| `bShouldFinishSpawning` | `bool` | Manages `FinishSpawning()` calls for non-[INActorPoolItem](actor-pool-item.md) `AActors`. | `true` |

## Creation Strategies

| Native | Display | Description |
| :-- | :-- | :-- |
| `APS_Create` | Create | Create `AActor` as needed. | 
| `APS_CreateLimited` | Create Till Cap | Create `AActor` until `MaximumActorCount` is reached and stop, returning a `nullptr` in such cases. |
| `APS_CreateRecycleFirst` | Create Till Cap, Recycle First | Create `AActor` until `MaximumActorCount` is reached, any requests beyond provides the oldest already spawned `AActor` in a FIFO behaviour. | 
| `APS_CreateRecycleLast` | Create Till Cap, Recycle Last | Create `AActor` until `MaximumActorCount` is reached, any requests beyond provides the newest spawned `AActor` in a LIFO behaviour. | 
| `APS_Fixed` | Fixed Availabilty | Deploys `AActor` as needed from fixed pools, exceeding availibility results in a `nullptr` being returned.| 
| `APS_FixedRecycleFirst` | Fixed Availabilty, Recycle First | Deploys `AActor` as needed from fixed pools, exceeding availibility will return the oldested already spawned `AActor` in a FIFO behaviour. |
| `APS_FixedRecycleLast` | Fixed Availabilty, Recycle Last | Deploys `AActor` as needed from fixed pools, exceeding availibility will return the newest already spawned `AActor` in a LIFO behaviour. |

## Project-Wide Defaults

From the `Edit > Project Settings` window, find the **NEXUS** section; there should be a `Actor Pools` option which will display the default settings used when an `AActor` is requested from an unitialized pool.

![NActorPools](actor-pool-settings.webp)