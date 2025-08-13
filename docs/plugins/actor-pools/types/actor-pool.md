---
sidebar_position: 1
sidebar_label: Actor Pool
sidebar_class_name: type native-class
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool

<TypeDetails icon="native-class" base="class" type="FNActorPool" typeExtra="" headerFile="NexusActorPools/Public/NActorPool.h" />

A runtime object pool that efficiently manages a collections of spawned `AActors`. It's designed to improve performance by reusing actors instead of constantly creating and destroying them, which is particularly beneficial for frequently spawned objects like projectiles or enemies. This particular object should typically only be interacted with _natively_ and through accessors from the `UNActorPoolSubsystem`.

:::tip[Usage]

Refer to [UNActorPoolSubsystem](actor-pool-subsystem.md) for both _blueprint_ and _native_ usage examples.

:::

## Highlights

- **Object Pooling**: Maintains two collections of actors - those available for use ("in" the pool) and those currently active ("out" of the pool).
- **Efficient Actor Management**: Pre-spawns a configurable number of actors and keeps them ready for immediate use.
- **Seamless Spawning**: Provides `Get()` and `Spawn()` methods that retrieve actors from the pool instantly, avoiding the overhead of traditional actor spawning.
- **Automatic Return**: Allows actors to be returned to the pool via the `Return()` method for reuse.
- **Configurable Settings**: Supports customizable pool settings including minimum pool sizes and spawning strategies.
- **Smart Initialization**: Can pre-fill or "warm" the pool with a specified number of actors.

## Key Benefits

- **Performance**: Eliminates the cost of repeatedly spawning and destroying actors.
- **Memory Management**: Reduces garbage collection pressure by reusing existing objects.
- **Consistency**: Provides predictable performance for systems that require frequent actor creation.
- **Flexibility**: Works with any Subclass of `AActor` and supports interface-based customization through `INActorPoolItem`.

This technique is particularly valuable in scenarios where you need to spawn many similar actors frequently, such as bullet hell games, or any situation where object creation/destruction becomes a performance bottleneck.