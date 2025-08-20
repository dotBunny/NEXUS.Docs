---
sidebar_position: 5
sidebar_label: Pooled Actor
sidebar_class_name: type ue-actor
description: A specialized AActor base-class designed to work seamlessly with a FNActorPool.
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Pooled Actor

<TypeDetails icon="/assets/svg/actor-pools/pooled-actor.svg" iconType="img" base="AActor" type="ANPooledActor" typeExtra="" headerFile="NexusActorPools/Public/NPooledActor.h" />

A specialized `AActor` base-class designed to work seamlessly with a [FNActorPool](actor-pool.md). 

## What It Is

- **Base Actor Class**: Inherits from `AActor` to provide all standard functionality.
- **Pool-Ready**: Implements the [INActorPoolItem](actor-pool-item.md) interface, making it fully compatible with actor pools.

## Key Benefits

- **Drop-in Replacement**: Can be used anywhere you'd use a regular `AActor`, but with pool optimization built-in.
- **Automatic Management**: Handles edge cases like world boundaries automatically by returning to the pool.
- **Blueprint Inheritance**: Can be extended in Blueprint to create custom pooled actor types.
- **Consistent Behavior**: Ensures all pooled actors follow the same lifecycle patterns.