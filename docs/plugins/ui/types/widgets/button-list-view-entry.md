---
sidebar_label: Button ListView Entry
sidebar_class_name: type ue-widget
description: A reusable list-view entry widget that renders a UButton + UCommonTextBlock pair driven by a bound UNButtonListViewEntryObject.
tags: [0.2.7]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Button ListView Entry

<TypeDetails icon="ue-widget" base="UUserWidget" type="UNButtonListViewEntry" typeExtra=" + UNButtonListViewEntryObject" headerFile="NexusUI/Public/Widgets/NButtonListViewEntry.h" />

A reusable [UNListView](../components/list-view.md) entry widget that renders a `UButton` with a child `UCommonTextBlock` label, driven by a bound `UNButtonListViewEntryObject` data model. Hover, press, and release transitions swap the button's foreground/background colors using palette slots on the bound data object — so a single Blueprint widget can render rows in any color scheme by populating the data object's per-state `ENColor` fields.

Used by the [UNActorPools](/docs/plugins/actor-pools/developer-overlay.md) and [UNDynamicRefs](/docs/plugins/dynamic-references/developer-overlay.md) developer overlays as the per-object button rows you click to focus an actor.

## What It Is

- **Two-Type Pattern**: `UNButtonListViewEntry` is the widget; `UNButtonListViewEntryObject` is the `UObject` row data fed into the [UNListView](../components/list-view.md). Each row's data object carries the label text, a `TargetObject` payload, and per-state palette colors.
- **Hover/Press/Release**: Native click and pointer events recolor the button and label using the bound data object's palette slots.
- **Click Forwarding**: Pressing the button fires the data object's `OnPressedEvent` delegate, passing the row's `TargetObject` to subscribers.

## Bound Widgets

| Widget | Type | Role |
| :-- | :-- | :-- |
| `Button` | `UButton` | The pressable surface; click/hover events drive the color transitions. |
| `Text` | `UCommonTextBlock` | The button's label, pulled from the bound data object's `Text` field. |

## Behavior

- **`NativeConstruct()`** wires `Button->OnClicked`, `OnHovered`, `OnUnhovered`, and `OnReleased` to internal handlers that recolor the button.
- **`NativeOnListItemObjectSet(UObject*)`** receives the `UNButtonListViewEntryObject`, copies its label into `Text`, and binds the button's `OnClicked` to the object's `OnPressed` so the click forwards out via `OnPressedEvent`.
- **`NativeOnEntryReleased()`** unbinds the row from the data object when the list view recycles the row.
- **`NativeDestruct()`** unwires every button delegate, including when the bound `Button` has already been torn down.

## Data Object — `UNButtonListViewEntryObject`

```cpp
UCLASS(BlueprintType)
class NEXUSUI_API UNButtonListViewEntryObject : public UObject
```

The data model is a plain `UObject` (not the widget itself) that the list view binds to one row. The widget reads the following fields when its row is created:

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `Text` | empty | Label rendered in the button. |
| `TargetObject` | `nullptr` | Arbitrary payload forwarded to `OnPressedEvent` subscribers. |
| `HoverStateForegroundColor` | `NC_White` | Text color while the pointer hovers. |
| `HoverStateBackgroundColor` | `NC_BlueLight` | Button color while the pointer hovers. |
| `PressedStateForegroundColor` | `NC_White` | Text color while pressed. |
| `PressedStateBackgroundColor` | `NC_BlueDark` | Button color while pressed. |
| `UnhoveredStateForegroundColor` | `NC_White` | Idle text color. |
| `UnhoveredStateBackgroundColor` | `NC_GreyDark` | Idle button color. |

The data object also exposes an `OnPressedEvent` delegate that fires when the bound button is clicked — subscribers receive the row's `TargetObject` for context.

:::tip

Construct one `UNButtonListViewEntryObject` per row, set its `Text` and `TargetObject`, bind your handler to `OnPressedEvent`, then push the array of objects into a [UNListView](../components/list-view.md) configured to use `UNButtonListViewEntry` (or a Blueprint subclass of it). The plugin's developer overlays follow this pattern verbatim.

:::
