---
sidebar_position: 13
sidebar_label: Spawn Actor Async
sidebar_class_name: type ue-object
description: An async Blueprint action that soft-loads an AActor class and then spawns an instance from the Actor Pool subsystem at a given transform.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Spawn Actor Async

<TypeDetails icon="ue-object" base="UBlueprintAsyncActionBase" type="UNSpawnActorBlueprintAsyncAction" typeExtra="" headerFile="NexusActorPools/Public/NSpawnActorBlueprintAsyncAction.h" />

An async Blueprint action that takes a `TSoftClassPtr<AActor>`, streams it in, ensures a [FNActorPool](actor-pool.md) exists for it, and then spawns an `AActor` at the supplied position and rotation. Like its sibling [Get Actor Async](get-actor-async.md), its purpose is to **decouple hard references to Actor classes** while still placing the resulting `AActor` into the world in a single step.

## When To Use It

- **Loading Decoupling**: The Actor class is referenced as a soft asset; the action handles the load before spawning.
- **First-Use Cost Hiding**: If no [FNActorPool](actor-pool.md) exists for the class yet, one is created on-demand using the project's [Default Settings](../project-settings.md). The async action moves that work off the calling frame.
- **Reference Without Spawn**: If you want the `AActor` returned without being placed in the world, use [Get Actor Async](get-actor-async.md) instead. If you already hold a hard reference to the class, call `SpawnActor` on the [UNActorPoolSubsystem](actor-pool-subsystem.md) directly.

## Blueprint Surface

| Input | Description |
| :-- | :-- |
| `ActorClass` | `TSoftClassPtr<AActor>` to load and spawn from a pool. |
| `Position` | World-space position to spawn the `AActor` at. |
| `Rotation` | World-space rotation to apply to the spawned `AActor`. |

| Pin | Fires When | Payload |
| :-- | :-- | :-- |
| `Completed` | The class finishes loading and the subsystem spawns an `AActor` from the pool. | `SpawnedActor` — the spawned `AActor`, or `null` on failure. |

The pin always fires exactly once. Check `SpawnedActor` for `null` before using it.

## Notes

- Honors all the [pool flags](actor-pool-settings.md#flags) of the resolved pool. In particular:
  - `ServerOnly` pools will return `null` on clients.
  - `SweepBeforeSettingLocation` is applied to the spawn transform.
  - `ShouldFinishSpawning` controls whether `FinishSpawning()` is invoked for non-[INActorPoolItem](actor-pool-item.md) classes.
- The `Strategy` configured on the pool determines what happens if the pool is exhausted — see [Creation Strategies](actor-pool-settings.md#creation-strategies). A strategy of `CreateLimited` or `Fixed` (without recycle) will return `null` rather than allocate a new `AActor`.
