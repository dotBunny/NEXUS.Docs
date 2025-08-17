---
sidebar_position: 1
sidebar_label: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

## Lifecycle

It is important to consider the lifecycle of any `AActor` being used in an object pooling sceneario. Specifically are there things that need to happen to the Actor's components or itself to properly remove it from gameplay, be it deacivating components, sleeping AI, or altering GAS-related logic; every game is slightly different and you will need to address your games specific needs. Utilizing the `INActorPoolItem` interface you can quickly carve out this pooling logic.

## Spawning An Actor

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/tlzo2p-f/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '25vh' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Spawn Actor: Simple Method"
UNActorPoolSubsystem::Get(GetWorld())->SpawnActor(MyActorClass, MyPosition, MyRotation)
```


```cpp title="Spawn Actor: Ridiculously Boring Safe Method"
const UWorld* World = GetWorld();
if (World != nullptr) // Do we really need this?
{
  UNActorPoolSubsystem* APS = UNActorPoolSubsystem::Get(World);
  if (APS != nullptr) // The system should be automatically created!
  {
    APS->SpawnActor(MyActor, MyPosition, MyRotation); // This really was just a pointless exercise in pointless safety checks.
  }
}
```    
  </TabItem>
</Tabs>

## Prewarm Pools

The real advantage of pooling objects comes from when you have an opportunity to create an approximate number of objects you are going to need during a non-performance sensistive moment (think loading screen). There are a few options to being able to do this with [NActorPools](/docs/plugins/actor-pools/types/actor-pool/).

### Method Call

### Applying NActorPoolSets

## Returning An Actor