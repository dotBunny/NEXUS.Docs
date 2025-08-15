---
sidebar_position: 1
sidebar_label: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

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