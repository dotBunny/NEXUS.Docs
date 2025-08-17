---
sidebar_position: 6
sidebar_label: Actor Pool Spawner Component
sidebar_class_name: type ue-actor-component
description: A fundamental spawning component which will interact with the NActorPoolSubsystem to periodically spawn defined AActors in predefined distributions (shapes). 
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Spawner Component

<TypeDetails icon="/assets/svg/actor-pools/actor-pool-spawner-component.svg" iconType="img" base="UActorComponent" type="UNActorPoolSpawnerComponent" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolSpawnerComponent.h" />

A fundamental spawning component which will interact with the NActorPoolSubsystem to periodically spawn defined `AActors` in predefined distributions (shapes). 

![UNActorPoolSpawnerComponent](actor-pool-spawner-component.webp)

## Component Settings

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Spawning Enabled | bool | | |
| Server Authoritative | bool | | |
| Spawn Rate | int | | |
| Offset | FVector | | |
| Distribution |  | | |
| Distrubtion Range | FVector | | |
| Spline Level Reference | | | |
| Count | int | | |
| Randomize Seed | bool | | |
| Seed | int | | |
| Templates | | | |