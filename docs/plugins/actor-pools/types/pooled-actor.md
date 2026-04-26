---
sidebar_position: 5
sidebar_label: Pooled Actor
sidebar_class_name: type ue-actor
description: A specialized AActor base-class designed to work seamlessly with a FNActorPool.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Pooled Actor

<TypeDetails icon="/assets/svg/actor-pools/pooled-actor.svg" iconType="img" base="AActor" type="ANPooledActor" typeExtra="" headerFile="NexusActorPools/Public/NPooledActor.h" />

A specialized `AActor` base class that already implements [INActorPoolItem](actor-pool-item.md) and exposes each pool lifecycle hook as a `BlueprintAssignable` event. Use it as the parent of any `AActor` Blueprint that should participate in pooling without writing native code — the only thing left to wire up is your gameplay logic on the four lifecycle events.

The class is `Abstract`; subclass it (typically as a Blueprint) before placing or spawning instances.

## What It Is

- **Base Actor Class**: Inherits from `AActor` so every standard `AActor` workflow continues to work.
- **Pool-Ready**: Implements [INActorPoolItem](actor-pool-item.md), so [FNActorPool](actor-pool.md) drives its lifecycle automatically.
- **Blueprint-Friendly**: Each lifecycle hook is forwarded to a matching `BlueprintAssignable` event so designers can react without touching C++.

## Key Benefits

- **Drop-in Replacement**: Reparent any `AActor` Blueprint to `ANPooledActor` to opt the class into pooling.
- **Automatic World-Boundary Return**: Overrides `FellOutOfWorld` to call `ReturnToActorPool()` — Actors that cross the kill-Z return to their pool instead of being destroyed.
- **Consistent Behavior**: Every subclass shares the same lifecycle event surface, so tools and editor utilities can drive any pooled Actor uniformly.

## Lifecycle Events

Each event corresponds to one of the [INActorPoolItem](actor-pool-item.md) callbacks. The native override calls into the interface (which advances the operational state) and then broadcasts the matching delegate so Blueprint listeners can run their own logic.

| Event | Fires When | Bound `INActorPoolItem` Callback |
| :-- | :-- | :-- |
| `OnCreatedByActorPoolEvent` | Pool first creates the Actor instance. | `OnCreatedByActorPool` |
| `OnSpawnedFromActorPoolEvent` | Pool hands the Actor out via `Spawn`. | `OnSpawnedFromActorPool` |
| `OnReturnToActorPoolEvent` | Actor returns to the pool (manually or via `FellOutOfWorld`). | `OnReturnToActorPool` |
| `OnDestroyedByActorPoolEvent` | Pool destroys the Actor (e.g. during `Clear(true)`). | `OnDestroyedByActorPool` |

All four are `UPROPERTY(BlueprintAssignable)` instances of `FOnActorPoolDelegate` (no parameters). Bind them in Blueprint or via `AddDynamic` from C++.

## World-Boundary Behavior

```cpp
virtual void FellOutOfWorld(const UDamageType& dmgType) override
{
    ReturnToActorPool();
}
```

The base `AActor` implementation destroys the Actor when it falls below the world's kill-Z. `ANPooledActor` swaps that destroy with a return — useful for projectiles, debris, or any pooled Actor where falling out of bounds is a legitimate path back to the pool.
