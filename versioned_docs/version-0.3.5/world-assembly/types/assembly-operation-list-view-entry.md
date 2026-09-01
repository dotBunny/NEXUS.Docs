---
sidebar_class_name: type ue-widget
description: The list-view row widget that renders one Assembly Operation's name, message, and task progress in the developer overlay.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Assembly Operation ListView Entry

<TypeDetails icon="ue-widget" base="UUserWidget" type="UNAssemblyOperationListViewEntry" typeExtra="" headerFile="NexusWorldAssembly/Public/Assembly/NAssemblyOperationListViewEntry.h" />

One row of the [Developer Overlay](../developer-overlay.md)'s operation list. It binds to a single [Assembly Operation](assembly-operation.md) and renders its display name, current status message, and task progress — plus a nested list of per-stage progress bars and a cancel button.

The row is **self-updating**. It subscribes to the operation's own delegates when the list hands it an item, so nothing has to poll it or push refreshes into it.

## What It Is

- **A Row, Not a Panel**: Implements `INListViewEntry`, so any [UNListView](../../ui/types/components/list-view.md) configured to produce these entries gets one populated row per operation.
- **Two-Level**: The outer row is the operation; the nested `ChildProgressListView` holds one [ProgressBar ListView Entry](../../ui/types/widgets/progress-bar-list-view-entry.md) per [status channel](../architecture/task-graph.md#status-channels) the operation reports.
- **Subclassable Template**: Marked `Blueprintable` and `BlueprintType` so the visual design lives in a Widget Blueprint.

## Bound Widgets

Every widget below is `meta=(BindWidget)`, so a Widget Blueprint subclass must provide a widget of the matching name and type. `NativeConstruct` additionally runs `N_VALIDATE` on each one, so a binding that ends up null surfaces as a log message rather than a silent blank row.

| Widget | Type | Role |
| :-- | :-- | :-- |
| `LeftText` | `UCommonTextBlock` | The operation's display name. |
| `CenterText` | `UCommonTextBlock` | The operation's current status message. |
| `RightText` | `UCommonTextBlock` | Completed/total task counts, formatted `"%d/%d"`. |
| `ProgressBar` | `UProgressBar` | Completed ÷ total tasks. |
| `ChildProgressListView` | `UNListView` | Nested per-channel progress rows. Starts empty. |
| `CancelButton` | `UButton` | Calls the operation's `Cancel()`. |

## Behavior

- **`NativeOnListItemObjectSet(UObject*)`** unbinds the previously bound operation, clears the child rows, casts the item to [UNAssemblyOperation](assembly-operation.md), binds `OnStatusMessageChanged` and `OnTasksChanged`, then calls `Reset()`. The unbind-first order matters: list entries are recycled, so a row arriving at a new operation is usually still holding the last one.
- **`Reset()`** repaints every field from the operation's current state, or clears everything when there is no bound operation. It is used both on (re)bind and on destruct.
- **`OnOperationTasksChanged(int32, int32)`** and **`OnOperationDisplayMessageChanged(const FString&)`** are the delegate targets that keep the row live.
- **`NativeDestruct()`** unbinds both delegates, clears the child list, and drops the operation reference.

:::note[A task count of zero shows a *full* bar]

When total tasks is `0`, the row clears `RightText` and sets the progress bar to **100%**, not 0%. An operation that has not yet built its task graph — or one that finished with nothing to do — therefore reads as complete rather than stalled. This is deliberate: a zero-denominator bar sitting at empty looks like a hung operation.

:::

## Cancel Button Visibility

The button is `Visible` only while the bound operation reports `IsRunning()`; otherwise it is `Hidden` (not `Collapsed`, so the row's layout does not shift as operations finish). Visibility is re-evaluated on every message change, task change, and `Reset()`.

## Channel Updates

```cpp
/**
 * Apply a batch of progress-channel deltas routed from the developer overlay. Lazily creates a
 * UNProgressBarListEntry (and child-list row) for any channel id not yet seen, then updates it.
 * @param Changes The channels that changed since the operation's last drain.
 */
void ApplyChannelUpdates(const TArray<FNStatusChannelUpdate>& Changes);
```

This is the row's one externally-driven entry point — the [Developer Overlay](../developer-overlay.md) drains the operation's changed channels and forwards them here.

Channels are **discovered from the deltas**, not declared up front. For each `FNStatusChannelUpdate`, the row looks up the channel id in its own map: a known id updates its existing `UNProgressBarListEntry` in place (whose `OnChanged` refreshes the bound widget without the list rebuilding), and an unknown id gets a view-model and a child row created on the spot.

That is the consumer side of the [status-channel contract](../architecture/task-graph.md#status-channels) — updates carry only what changed, so a listener must keep its own map keyed by id and merge rather than replace. `ChildProgressListView` being null makes `ApplyChannelUpdates` a no-op, so a Blueprint that omits the nested list still renders the top-level row correctly.
