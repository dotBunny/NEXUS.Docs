---
sidebar_position: 5
sidebar_label: DynamicRef ListView Entry
sidebar_class_name: type ue-widget
description: A UMG list view entry widget for a single dynamic-reference row, used by the developer overlay.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# DynamicRef ListView Entry

<TypeDetails icon="ue-widget" base="UUserWidget" type="UNDynamicRefListViewEntry" typeExtra="" headerFile="NexusDynamicRefs/Public/NDynamicRefListViewEntry.h" />

A `UUserWidget` that renders one row of the [Developer Overlay](../developer-overlay.md) for a single [ENDynamicRef](dynamic-ref.md) slot or `FName` bucket. It implements `INListViewEntry`, so any `UNListView` configured to produce these entries will receive a populated, refreshable widget per slot/bucket.

## What It Is

- **Reference Row Widget**: One row representing a single slot/bucket — its display name plus a nested list of every `UObject` currently registered under it.
- **Subclassable Template**: Marked `Blueprintable` and `BlueprintType`, so you can build a Blueprint widget on top of it (`WB_NDynamicRefsListViewEntry` in the plugin content is the shipped example).
- **Two-Level**: The outer widget is the row; the inner `References` list holds one button per `UObject` registered to that slot/bucket.

## Bound Widgets

The widget expects the following named widgets in any Blueprint subclass — they are wired via `meta=(BindWidget)` and Unreal will fail compilation if a subclass omits them.

| Widget | Type | Role |
| :-- | :-- | :-- |
| `Reference` | `UCommonTextBlock` | Label showing the [ENDynamicRef](dynamic-ref.md) display name or the `FName`. |
| `References` | `UNListView` | Nested list of objects currently claiming the reference. |

## Behavior

- **`NativeOnListItemObjectSet(UObject*)`** receives the [UNDynamicRefObject](dynamic-ref-object.md) the row is bound to and triggers the initial population.
- **`NativeOnEntryReleased()`** is called when the list view recycles the row; bound state is cleared so the row can be reused for a different slot/bucket.
- **`Refresh()`** is `BlueprintCallable` and re-reads the bound wrapper. The shipped overlay calls it in response to the wrapper's `Changed` delegate.
- **`OnButtonPressed(UObject*)`** is the row's per-object button handler; it forwards the click up to the [Developer Overlay](../developer-overlay.md)'s `OnButtonClicked` delegate, which the editor wires up to actor selection.
