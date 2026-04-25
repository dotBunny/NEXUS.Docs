---
sidebar_position: 2
sidebar_label: Guardian Subsystem
sidebar_class_name: type ue-world-subsystem
description: A developer-focused subsystem to help monitor specific metrics related to UObject usage.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Guardian Subsystem

<TypeDetails icon="ue-world-subsystem" base="UTickableWorldSubsystem" type="UNGuardianSubsystem" typeExtra="" headerFile="NexusGuardian/Public/NGuardianSubsystem.h" />

A developer-focused `UTickableWorldSubsystem` that monitors `UObject` count growth against a baseline and triggers a staged warning → snapshot → compare ladder once configured thresholds are crossed. The subsystem is only created in build configurations selected by [`Build Availability`](../project-settings.md), so it can ship in development builds and be entirely absent from `Shipping`.

For a live readout of the same counters, use the [Developer Overlay](../developer-overlay.md).

## Snapshots

Over the course of a game's development, there comes a point where you start to wonder, _do I have a leak?_ While there are many great tools included with the **Unreal Engine** — we are looking at you [Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine)! Sometimes you _just_ want to go old-school and `printf` everything to a log. _We have you covered!_

:::tip

While the `UNGuardianSubsystem` provides an automatic monitoring solution,  you can manually use `N.Developer.CacheSnapshot` and `N.Developer.CompareSnapshot` console commands to create your own diffs! Check out the other [console commands](/docs/plugins/core/console-commands.md)!

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
GetWorld()->GetTimerManager().SetTimer(SetBaselineTimerHandle, UNGuardianSubsystem::Get(GetWorld()), &UNGuardianSubsystem::SetBaseline,1.0f, false);
```    
  </TabItem>
</Tabs>

The subsystem is `Conditional`-tickable and only consumes tick budget after the baseline has been captured.

### The Threshold Ladder

Once the baseline is set, every tick samples the total `UObject` count and compares it against three thresholds resolved from [Project Settings](../project-settings.md) (`baseline + setting`):

| Threshold | Action when crossed | Latched flag |
| :-- | :-- | :-- |
| Warning | Emits a log warning. | `HasPassedWarningThreshold()` |
| Snapshot | Captures an `FNObjectSnapshot` of every live `UObject`. Held in memory; written to `Saved/Logs/NEXUS_Snapshot_*` if `Save Capture` is enabled. | `HasPassedSnapshotThreshold()` |
| Compare | Captures a second snapshot and diffs it against the first; writes `Saved/Logs/NEXUS_Compare_*` if `Save Capture` is enabled. | `HasPassedCompareThreshold()` |

Each action fires exactly once — the latched flag is checked before the action runs, so the subsystem will not re-warn or re-snapshot until the world (and its subsystem) is recreated.

## Reading State

The following accessors are intended for HUD overlays, automated tests, or any tooling that wants to observe the subsystem without driving it:

| Method | Returns |
| :-- | :-- |
| `GetLastObjectCount()` | The most recent `UObject` count sampled in tick. |
| `GetBaseObjectCount()` | The count latched by `SetBaseline()`. Zero before baseline is set. |
| `GetObjectCountWarningThreshold()` | The resolved warning threshold (baseline + setting). |
| `GetObjectCountSnapshotThreshold()` | The resolved snapshot threshold. |
| `GetObjectCountCompareThreshold()` | The resolved compare threshold. |
| `HasPassedWarningThreshold()` | `true` once the warning fired. |
| `HasPassedSnapshotThreshold()` | `true` once the snapshot was captured. |
| `HasPassedCompareThreshold()` | `true` once the compare ran. |
