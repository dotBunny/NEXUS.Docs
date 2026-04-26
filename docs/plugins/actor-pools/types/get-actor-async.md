---
sidebar_position: 12
sidebar_label: Get Actor Async
sidebar_class_name: type ue-object
description: An async Blueprint action that soft-loads an AActor class and then gets an instance from the Actor Pool subsystem.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Get Actor Async

<TypeDetails icon="ue-object" base="UBlueprintAsyncActionBase" type="UNGetActorBlueprintAsyncAction" typeExtra="" headerFile="NexusActorPools/Public/NGetActorBlueprintAsyncAction.h" />

An async Blueprint action that takes a `TSoftClassPtr<AActor>`, streams it in, ensures a [FNActorPool](actor-pool.md) exists for it, and then hands back an `AActor` reference from the pool. It exists primarily to **decouple hard references to Actor classes** — the calling Blueprint never needs to know about the concrete class at compile time.

## When To Use It

- **Loading Decoupling**: Your Blueprint references the `AActor` class as a soft asset (e.g. configured via a data asset or settings). The async action takes care of the load + pool lookup before returning.
- **First-Use Cost Hiding**: Pool creation is on-demand if no [FNActorPool](actor-pool.md) exists yet for the class — using the async action moves that one-time cost off the calling frame.
- **No Spawning**: Use this when you want a reference to a pooled `AActor` without it being placed in the world. To spawn at a transform in one step, use [Spawn Actor Async](spawn-actor-async.md) instead. To skip the soft-load step entirely (when you already hold a hard reference), call `GetActor` on the [UNActorPoolSubsystem](actor-pool-subsystem.md) directly.

## Blueprint Surface

The action exposes a single output pin:

| Pin | Fires When | Payload |
| :-- | :-- | :-- |
| `Completed` | The class finishes loading and the subsystem returns an `AActor` from the pool. | `SpawnedActor` — the pooled `AActor`, or `null` on failure. |

The pin always fires exactly once, even if the underlying load fails or no `AActor` is available; check `SpawnedActor` for `null` before using it.

## Notes

- Honors all the [pool flags](actor-pool-settings.md#flags) of the resolved pool — including `ServerOnly`, which will return `null` on clients.
- "Get" semantics match `UNActorPoolSubsystem::GetActor` — the returned `AActor` is **not** activated and no events are triggered on it. Activate it yourself or use [Spawn Actor Async](spawn-actor-async.md) instead.
- Internally holds a `TSoftClassPtr<AActor>` and a `FStreamableHandle`; the streaming handle stays alive until the action completes.
