---
sidebar_position: 2
sidebar_label: Developer Subsystem
sidebar_class_name: type ue-world-subsystem
description: A developer-focused subsystem to help monitor specific metrics related to UObject usage.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Developer Subsystem

<TypeDetails icon="ue-world-subsystem" base="UTickableWorldSubsystem" type="UNDeveloperSubsystem" typeExtra="" headerFile="NexusCore/Public/Developer/NDeveloperSubsystem.h" />

A developer-focused subsystem to help monitor specific metrics related to `UObject` usage.

## Snapshots

Over the course of a game's development, there comes a point where you start to wonder, _do I have a leak?_ While there are many great tools included with the **Unreal Engine** — we are looking at you [Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine)! Sometimes you _just_ want to go old-school and `printf` everything to a log. _We have you covered!_

:::tip

While the `UNDeveloperSubsystem` provides an automatic monitoring solution,  you can manually use `N.Developer.CacheSnapshot` and `N.Developer.CompareSnapshot` console commands to create your own diffs! Check out the other [console commands](../console-commands.md)!

:::

### Setting A Baseline

The automated system requires a baseline point to be effective in its calculations. Mainly because there is going to be a period where you are creating numerous `UObjects`, and you don't want the system to consider those objects in its calculation. So when you are ready for it to start watching, call the `SetBaseline()` command.

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/jg3v_i32/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '325px' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Set Delayed Baseline"
FTimerHandle SetBaselineTimerHandle;
GetWorld()->GetTimerManager().SetTimer(SetBaselineTimerHandle, UNDeveloperSubsystem::Get(GetWorld()), &UNDeveloperSubsystem::SetBaseline,1.0f, false);
```    
  </TabItem>
</Tabs>

## Settings

![Developer Subsystem: Settings](developer-subsystem-settings.webp)

| Setting | Description | Default |
| :-- | --- | :-- |
| Use Developer Subsystem | Should the Developer Subsystem be created? It is required for `UObject` monitoring, and you still must call `UNDeveloperSubsystem::SetBaseline()`! | `false` |
| Warning Threshold | The number of `UObjects` added after setting the baseline when a warning message will be thrown. | `25000` |
| Snapshot Threshold | The number of `UObjects` added after after setting the baseline when a `FNObjectSnapshot` will be taken of the currnet `UObjects`. | `30000` |
| Save Capture? | Should the `FNObjectSnapshot` captured be outputted to the project's log folder with a prefix of `NEXUS_Snapshot_*`. | `false` |
| Compare Threshold | The number of `UObjects` added after after setting the baseline when another `FNObjectSnapshot` will be taken, and then compared against the previous. This will then output the detailed summary of the compare to the project's log folder wih the prefix `NEXUS_Compare_*`. | `40000` |
