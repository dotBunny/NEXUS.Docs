---
sidebar_position: 11
sidebar_label: Actor Pool ListView Entry
sidebar_class_name: type ue-widget
description: A UMG list view entry widget for displaying a single Actor Pool row, used by the developer overlay.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool ListView Entry

<TypeDetails icon="ue-widget" base="UUserWidget" type="UNActorPoolListViewEntry" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolListViewEntry.h" />

A `UUserWidget` that renders one row of the [Developer Overlay](../developer-overlay.md) for a single [FNActorPool](actor-pool.md). It implements `INListViewEntry`, so any `UNListView` configured to produce these entries will receive a populated, refreshable widget per pool.

## What It Is

- **Pool Row Widget**: A single visual element representing one pool — its template, capacity, and in/out counts.
- **Subclassable Template**: Marked `Blueprintable` and `BlueprintType`, so you can build a Blueprint widget on top of it (`WB_NActorPoolsDeveloperOverlay` in the plugin content is the shipped example).
- **List-View Aware**: Implements `INListViewEntry` to receive its owning `UNListView` and bound `UNActorPoolObject` automatically when the list rebuilds.

## Bound Widgets

The widget expects the following named widgets in any Blueprint subclass — they are wired via `meta=(BindWidget)` and Unreal will fail compilation if a subclass omits them.

| Widget | Type | Role |
| :-- | :-- | :-- |
| `TypeImage` | `UImage` | Icon representing the pool's `AActor` template. |
| `ProgressBar` | `UProgressBar` | Visualizes how full the pool is (in vs. out). |
| `LeftText` | `UCommonTextBlock` | Typically the `AActor` class name. |
| `CenterText` | `UCommonTextBlock` | Typically the in/out counts. |
| `RightText` | `UCommonTextBlock` | Typically the pool's capacity or descriptor. |

## Behavior

- **`NativeOnListItemObjectSet(UObject*)`** receives the [UNActorPoolObject](actor-pool-object.md) that the row is bound to and triggers the initial population.
- **`Refresh()`** is `BlueprintCallable` and reads the current state from the bound pool wrapper; call it on a tick or in response to pool events to keep the row live.
- **`NativeDestruct()`** clears the bound pool reference; if you subclass and override, call `Super` to avoid a dangling pointer.

:::tip

To restyle the overlay without rewriting its logic, duplicate `WB_NActorPoolsDeveloperOverlay` from the plugin content and reparent the entry widget to your own Blueprint subclass of `UNActorPoolListViewEntry`. The bound widget contract is the only thing you must preserve.

:::
