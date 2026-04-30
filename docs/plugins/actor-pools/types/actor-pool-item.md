---
sidebar_position: 4
sidebar_label: Actor Pool Item
sidebar_class_name: type ue-interface
description: An interface that defines the contract between an AActor and the FNActorPool.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Item

<TypeDetails icon="ue-interface" base="interface" type="INActorPoolItem" typeExtra=" / UNActorPoolItem" headerFile="NexusActorPools/Public/INActorPoolItem.h" />

An interface that defines the contract between an `AActor` and the [FNActorPool](actor-pool.md). It is the communication bridge that lets any `AActor` participate in object pooling, surfacing the lifecycle hooks the pool calls into and the operational-state machine that gates them. [ANPooledActor](pooled-actor.md) is the convenience base class that already implements this interface — reach for the interface directly only when your `AActor` cannot inherit from `ANPooledActor`.

## What It Is

- **Interface Contract**: Defines the methods [FNActorPool](actor-pool.md) calls into during create / spawn / return / destroy transitions.
- **Lifecycle Manager**: Tracks the Actor's operational state (Undefined → Created → Enabled → Disabled → Destroyed) and broadcasts every transition.
- **Pool Integration Layer**: Lets the Actor talk back to the pool that owns it — return itself, query its settings, check attachment.

:::warning

This interface is **not** meant to be implemented by `AActor`-based Blueprints — it has been deliberately hidden from the implementation dropdown. If you need pool callbacks on a Blueprint that cannot derive from [ANPooledActor](pooled-actor.md), use the `Invoke UFunctions` flag on [FNActorPoolSettings](actor-pool-settings.md) to have the pool call the well-known UFunction names on the Blueprint instead.

:::

## Operational State

The interface owns an `ENActorOperationalState` enum that tracks where in the pool lifecycle the Actor currently sits. Every transition fires the `OnActorOperationalStateChanged` multicast delegate.

| State | Meaning |
| :-- | :-- |
| `Undefined` | Default before the pool has touched the Actor. |
| `Created` | The pool created the Actor but has not yet handed it out. |
| `Enabled` | The Actor is active in the world, having been spawned from the pool. |
| `Disabled` | The Actor has been returned to the pool and is sleeping. |
| `Destroyed` | The pool destroyed the Actor (e.g. during `Clear(true)`). |

## Lifecycle Callbacks

Each callback is virtual; the default implementation flips the operational state and you override to add gameplay behavior.

| Method | Default Behavior |
| :-- | :-- |
| `OnCreatedByActorPool()` | Sets state to `Created`. |
| `OnSpawnedFromActorPool()` | Sets state to `Enabled` after the pool applies its spawn settings. |
| `OnReturnToActorPool()` | Sets state to `Disabled` after the pool applies its return settings. |
| `OnDestroyedByActorPool()` | Sets state to `Destroyed`. |
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
