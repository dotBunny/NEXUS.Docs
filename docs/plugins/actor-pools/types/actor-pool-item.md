---
sidebar_position: 4
sidebar_label: Actor Pool Item
sidebar_class_name: type ue-interface
description: An interface that defines the contract between an AActor and the FNActorPool.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Item

<TypeDetails icon="ue-interface" base="interface" type="INActorPoolItem" typeExtra="/ UNActorPoolItem" headerFile="NexusActorPools/Public/INActorPoolItem.h" />

An interface that defines the contract between a `AActor` and the [FNActorPool](actor-pool.md). It serves as the communication bridge that allows any actor to participate in object pooling, providing standardized lifecycle hooks and management capabilities.

## What It Is
- **Interface Contract**: Defines the required methods and behaviors for actors that work with [FNActorPool](actor-pool.md).
- **Lifecycle Manager**: Tracks and manages the operational state of pooled actors through defined stages.
- **Pool Integration Layer**: Provides the necessary plumbing for actors to communicate with their owning pool.

## What It Does
- **State Tracking**: Maintains the actor's operational state through an `ENActorOperationalState` enum (Undefined, Created, Enabled, Disabled, Destroyed)
- **Lifecycle Hooks**: Provides virtual methods that are called at key moments in the pooling lifecycle:
  - `OnCreatedByActorPool()`: Called when first created by a pool.
  - `OnSpawnedFromActorPool()`: Called when retrieved from pool and activated.
  - `OnReturnToActorPool()`: Called when returned to pool and deactivated.
  - `OnDeferredConstruction()`: Called during specialized construction processes.
- **Pool Management**: Offers methods to interact with the pool system:
  - `ReturnToActorPool()`: Allows actors to return themselves to their pool.
  - `IsAttachedToActorPool()`: Checks if the actor belongs to a pool.
  - `GetActorPoolSettings()`: Provides pool configuration settings.
- **Lifecycle Management**: Provides methods to query and change state.
  - `SetActorOperationalState()`: Set the state of the actor, triggering `OnActorOperationalStateChanged` delegate. 

- **Automatic Initialization**: Handles the connection between actors and their owning pools.

This interface is essential for any actor that wants to work with the pooling system, providing the necessary hooks for proper initialization, activation, deactivation, and cleanup within the pool lifecycle.

:::warning

This is not meant to be implemented by `AActor`-based Blueprints, it has purposely been hidden from the dropdown menu. See the `Invoke UFunctions` flag on [UNActorPoolSettings](actor-pool-settings.md) for a way to have events-fired against a non-interfaced object.

:::

