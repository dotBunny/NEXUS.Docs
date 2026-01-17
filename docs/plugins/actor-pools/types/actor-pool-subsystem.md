---
sidebar_position: 9
sidebar_label: Actor Pool Subsystem
sidebar_class_name: type ue-world-subsystem
description: A centralized management system that provides UWorld-specific access to AActor pooling functionality, acting as the primary interface for creating, managing, and accessing multiple FNActorPools.
tags: [0.1.0]
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

## UFunctions

The methods exposted to Blueprint.

### Get Actor

```cpp
/**
  * Gets an actor from a given pool, creating a pool as necessary.
  * @note This does not trigger any events on the given actor, it does not activate them in any way.
  * @param ActorClass The class of the actor which you would like to get from the actor pool.
  * @param ReturnedActor The returned actor.
  */
void GetActor(TSubclassOf<AActor> ActorClass, AActor*& ReturnedActor);
```

:::warning

This does not trigger any events on the given actor, it does not activate them in any way.

:::

### Spawn Actor

```cpp
/**
* Spawns an actor from a given pool, creating a pool as necessary.
* @param ActorClass The class of the actor which you would like to get from the actor pool.
* @param Position The world position to spawn the actor at.
* @param Rotation The world rotation to apply to the spawned actor.
* @param SpawnedActor The returned actor.
*/
void SpawnActor(TSubclassOf<AActor> ActorClass, FVector Position, FRotator Rotation, AActor*& SpawnedActor);
```

:::tip

If you are working in native, use the native templated version of this function as it will let you pre-cast the return value to your desired type.

:::

### Return Actor

```cpp
/**
  * Attempts to return an Actor to its owning pool.
  * @note If the returned actor does not belong in a pool the UNActorPoolsSettings::UnknownBehaviour is applied.
  * @param Actor The target actor to return to a pool.
  * @return true/false if the Actor was returned to a pool.
  */
bool ReturnActor(AActor* Actor);
```

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