---
sidebar_position: 8
sidebar_label: Actor Pool Subsystem
sidebar_class_name: type ue-world-subsystem
description: A centralized management system that provides UWorld-specific access to AActor pooling functionality, acting as the primary interface for creating, managing, and accessing multiple FNActorPools.
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

#### Manually

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

#### Automatiacally

### Spawning An Actor
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