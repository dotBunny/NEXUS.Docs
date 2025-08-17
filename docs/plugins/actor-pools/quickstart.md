---
sidebar_position: 1
sidebar_label: Quickstart
description: What you need to know to get up and running fast using NActorPools.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

## Lifecycle

It is essential to consider the lifecycle of any `AActor` used in an object pooling scenario. Specifically, are there things that need to happen to the Actor's components or itself to remove it from gameplay properly, be it deactivating components, sleeping AI, or altering GAS-related logic; every game is slightly different, and you will need to address your game's specific needs. Utilizing the [INActorPoolItem](/docs/plugins/actor-pools/types/actor-pool-item/) interface, you can quickly carve out this pooling logic.

## Spawning An Actor

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

## Prewarm Pools

The real advantage of pooling objects comes from when you have an opportunity to create an approximate number of objects you are going to need during a non-performance sensistive moment (think loading screen). There are a few options to being able to do this with [NActorPools](/docs/plugins/actor-pools/types/actor-pool/).

### Method Call

### Applying NActorPoolSets

## Returning An Actor