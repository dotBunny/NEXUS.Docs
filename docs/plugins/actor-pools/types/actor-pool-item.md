---
sidebar_class_name: type ue-interface
description: An interface that defines the contract between an AActor and the FNActorPool.
tags: [0.1.0, 0.3.2]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Item

<TypeDetails icon="ue-interface" base="interface" type="INActorPoolItem" typeExtra=" / UNActorPoolItem" headerFile="NexusActorPools/Public/INActorPoolItem.h" />

An interface that defines the contract between an `AActor` and the [FNActorPool](actor-pool.md). It is the communication bridge that lets any `AActor` participate in object pooling, surfacing the lifecycle hooks the pool calls into and the operational-state machine that gates them. [ANPooledActorBase](pooled-actor-base.md) is the convenience base class that already implements this interface — reach for the interface directly only when your `AActor` cannot inherit from `ANPooledActorBase`.

## What It Is

- **Interface Contract**: Defines the methods [FNActorPool](actor-pool.md) calls into during create / spawn / return / release transitions.
- **Lifecycle Manager**: Tracks the Actor's operational state (Undefined → Created → Enabled → Disabled → Released) and broadcasts every transition.
- **Pool Integration Layer**: Lets the Actor talk back to the pool that owns it — return itself, query its settings, check attachment.

## Implementing the Interface

`INActorPoolItem` is a **native-only** interface. The `UINTERFACE` is declared with `meta=(CannotImplementInterfaceInBlueprint)`, so it is deliberately hidden from the Blueprint *Implemented Interfaces* dropdown — it can only be added to an `AActor` in C++.

- **The easy path** is to derive from [ANPooledActorBase](pooled-actor-base.md), which already implements the interface, overrides each lifecycle callback to broadcast a `BlueprintAssignable` event, and returns itself to the pool when it falls out of the world. Reach for the bare interface only when your `AActor` already has a base class it cannot give up.
- **To implement it directly**, inherit from both `AActor` (or a subclass) and `INActorPoolItem`, then override the virtual lifecycle callbacks you care about. Call the `INActorPoolItem::` base implementation first so the operational-state machine stays in sync:

```cpp
UCLASS()
class AMyPooledActor : public AActor, public INActorPoolItem
{
    GENERATED_BODY()

public:
    virtual void OnSpawnedFromActorPool() override
    {
        INActorPoolItem::OnSpawnedFromActorPool(); // keep the state machine accurate
        // ...your per-spawn gameplay logic...
    }
};
```

:::tip[No Implementation Required for Simple Actors]

You do **not** have to implement this interface (or derive from [ANPooledActorBase](pooled-actor-base.md)) to pool an `AActor`. On every spawn and return the pool already hides/shows the Actor, toggles its collision and tick, and — when the Actor's **root component is a `UPrimitiveComponent`** — resets its velocity and toggles physics simulation to match the template. For a straightforward Actor whose root is a primitive component (a static mesh, a projectile, and the like) this built-in handling is enough on its own.

Implement `INActorPoolItem` only when you need the lifecycle hooks or operational-state tracking to do extra work the pool can't infer — sleeping AI, deactivating extra components, resetting GAS state, etc.

:::

:::warning[Blueprint Fallback]

Because the interface cannot be implemented in Blueprint, a Blueprint that needs pool callbacks but cannot derive from [ANPooledActorBase](pooled-actor-base.md) should instead enable the `Invoke UFunctions` flag on [FNActorPoolSettings](actor-pool-settings.md#support-flags). The pool will then call the well-known UFunction names (`OnDeferredConstruction`, `OnCreatedByActorPool`, `OnSpawnedFromActorPool`, `OnReturnToActorPool`, `OnReleasedFromActorPool`) on the Blueprint instead. This is a slower path and is ignored entirely when the Actor implements the interface natively.

:::

## Operational State

The interface owns an `ENActorOperationalState` enum that tracks where in the pool lifecycle the Actor currently sits. Every transition fires the `OnActorOperationalStateChanged` multicast delegate.

| State | Meaning |
| :-- | :-- |
| `Undefined` | Default before the pool has touched the Actor. |
| `Created` | The pool created the Actor but has not yet handed it out. |
| `Enabled` | The Actor is active in the world, having been spawned from the pool. |
| `Disabled` | The Actor has been returned to the pool and is sleeping. |
| `Released` | The pool stopped tracking the Actor. The Actor is also destroyed when the release came from `Clear(true)`. |

## Lifecycle Callbacks

Each callback is virtual; the default implementation flips the operational state and you override to add gameplay behavior.

| Method | Default Behavior |
| :-- | :-- |
| `OnCreatedByActorPool()` | Sets state to `Created`. |
| `OnSpawnedFromActorPool()` | Sets state to `Enabled` after the pool applies its spawn settings. |
| `OnReturnToActorPool()` | Sets state to `Disabled` after the pool applies its return settings. |
| `OnReleasedFromActorPool()` | Sets state to `Released`. |
| `OnDeferredConstruction()` | No-op default. Override to perform per-spawn construction work before `FinishSpawning` is invoked. |

## Pool Attachment

```cpp
/**
 * Bind this Actor to the given FNActorPool instance.
 * @note Called internally by FNActorPool; there is rarely a reason to invoke this directly.
 */
void InitializeActorPoolItem(FNActorPool* OwnerPool);

/** Is this Actor currently attached to a pool? */
bool IsAttachedToActorPool() const;

/**
 * Return this Actor to its owning pool.
 * @return true if the Actor was successfully returned, false if it was not attached to a pool.
 */
bool ReturnToActorPool();

/**
 * The settings used by the Actor's owning pool, falling back to the project's default settings
 * (UNActorPoolsSettings::Get()->DefaultSettings) when the Actor is not yet attached.
 */
virtual const FNActorPoolSettings& GetActorPoolSettings();
```

## State API

```cpp
/**
 * Set the operational state, broadcasting OnActorOperationalStateChanged when it actually changes.
 * @note Most callers should never invoke this directly — the lifecycle callbacks already update the state.
 * @return true if the state changed, false if NewState matched the existing state.
 */
bool SetActorOperationalState(ENActorOperationalState NewState);

/** @return The current operational state. */
ENActorOperationalState GetCurrentActorOperationalState() const;

/** @return The operational state immediately prior to the most recent transition. */
ENActorOperationalState GetPreviousActorOperationalState() const;

/**
 * Fired after every operational state transition.
 * @note Multicast delegates are heavy; subscribe sparingly and unsubscribe in the matching teardown path.
 */
FOnActorOperationalStateChangedDelegate OnActorOperationalStateChanged;
```

The delegate signature is `void(ENActorOperationalState OldState, ENActorOperationalState NewState)` — both states are passed so listeners can branch on the specific transition (e.g. `Enabled → Disabled`).
