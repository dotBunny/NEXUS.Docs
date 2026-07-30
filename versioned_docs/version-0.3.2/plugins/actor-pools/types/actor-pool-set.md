---
sidebar_class_name: type ue-data-asset
description: A UDataAsset that serves as a collection of preconfigured FNActorPoolSettings.
---

import TypeDetails from '@site/src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Actor Pool Set

<TypeDetails icon="/assets/svg/actor-pools/actor-pool-set.svg" iconType="img" base="UDataAsset" type="UNActorPoolSet" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolSet.h" />

A `UDataAsset` that serves as a collection of preconfigured [FNActorPoolSettings](actor-pool-settings.md) to allow for easily warming up [FNActorPools](actor-pool.md) with the given context. One compelling usage of these sets is to process a level on save, or cook and determine a good amount of the spawnable actors and create a `UNActorPoolSet` per level. That way, when a level is loaded, you can apply its `UNActorPoolSet` and have all of the spawnable `AActor` prewarmed.

## Creating

From the **Content Browser**, right-click to bring up the **context menu** and navigate to the **NEXUS** submenu. From there, you should have an option to create an `NActorPool Set`.

![Creating a new UNActorPoolSet](/assets/images/docs/plugins/actor-pools/types/actor-pool-set-create.webp)

## Editing 

By double-clicking on a `UNActorPoolSet` asset, it will open the *default* Data Asset editor window. From there, you create entries in the array for the specific `AActor` and its corresponding settings.

![Editing a UNActorPoolSet](/assets/images/docs/plugins/actor-pools/types/actor-pool-set-edit.webp)

:::tip

You can nest / link `UNActorPoolSets` with others, so when one set is applied, the nested `UNActorPoolSets` will also be used.

:::

### Dataset

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Actor Pools | `TArray<FNActorPoolDefinition>` | The pool definitions declared directly by this set. | `(Empty)` |
| Nested Sets | `TArray<TSoftObjectPtr<UNActorPoolSet>>` | Additional sets whose definitions are created alongside this one. | `(Empty)` |

Each entry in `Actor Pools` is an `FNActorPoolDefinition`, pairing a class with the settings its pool should use:

| Field | Type | Description |
| :-- | :-- | :-- |
| Actor Class | `TSubclassOf<AActor>` | The actor to create a pool for. |
| Settings | `FNActorPoolSettings` | The [pool settings](actor-pool-settings.md) to apply. |

### How Nesting Resolves

Applying a set walks it and everything reachable through `Nested Sets`, flattening the result into a unique list before any pool is created. A set reached by two different paths is only visited once, and a cycle (A nesting B nesting A) terminates rather than recursing forever.

:::warning

Resolving nested sets performs a **blocking load** on each `TSoftObjectPtr`. That is deliberate — it happens once while pre-warming — but it means applying a deeply nested set is a synchronous cost, so do it during level setup rather than mid-gameplay. A nested set that fails to load is skipped with a warning in `LogNexusActorPools` and does not abort the rest of the apply.

:::

## Applying

Once you have a valid reference to the desired `UNActorPoolSet`, you instruct the [UNActorPoolSubsystem](actor-pool-subsystem.md) to apply the given set.

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/ftq66hj3/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '325px' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Apply UNActorPoolSet"
UNActorPoolSubsystem::Get(GetWorld())->ApplyActorPoolSet(TargetActorPoolSet);
```    
  </TabItem>
</Tabs>
