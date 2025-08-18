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

The real advantage of pooling objects comes from when you have an opportunity to create an approximate number of objects you are going to need during a non-performance sensistive moment (think loading screen). There are a few options to being able to do this with [FNActorPool](/docs/plugins/actor-pools/types/actor-pool/)s.

### Method Call

Because the `FNActorPool` is not a `UObject`, there is no interaction with a given pool directly via Blueprint. It is strongly encouraged to use the provided `UFUNCTION` on [UNActorPoolSubsystem](types/actor-pool-subsystem.md) to accomplish similar outcomes. 

:::info
This is intentional and creates some unique preferred workflows in **C++**.
:::

```cpp title="Spawn Actor"
FNActorPool* Pool = UNActorPoolSubsystem::Get(GetWorld())->GetActorPool(MyActorClass);
if (Pool != nullptr)
{
  Pool->Warm(20);
}
```

### Applying NActorPoolSets

The [UNActorPoolSet](types/actor-pool-set.md) lets you create a data asset which houses the definitions of multiple pools for the [UNActorPoolSubsystem](types/actor-pool-subsystem.md) to create when [applied](/docs/plugins/actor-pools/types/actor-pool-set/#applying).

## Returning An Actor


<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/mtuyqlwn/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '325px' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>

```cpp title="Ambiguous Return"
UNActorPoolSubsystem::Get(GetWorld())->ReturnActor(TargetActor);
``` 

While the Blueprint logic is the most generic, one of the benefits of utilizing the [INActorPoolItem](types/actor-pool-item.md) interfaces is that there are baked-in fast paths.

```cpp title="INActorPoolItem-Based Return"
TargetActor->ReturnToActorPool();
```    
  </TabItem>
</Tabs>