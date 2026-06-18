---
sidebar_class_name: type ue-widget
description: A reusable list-view entry widget that renders a UBorder + UCommonTextBlock pair driven by a bound UNTextListEntry.
tags: [0.2.7]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Text ListView Entry

<TypeDetails icon="ue-widget" base="UUserWidget" type="UNTextListViewEntry" typeExtra=" + UNTextListEntry" headerFile="NexusUI/Public/Widgets/NTextListViewEntry.h" />

A lightweight [UNListView](../components/list-view.md) entry widget that renders a `UBorder` framing a `UCommonTextBlock`, driven by a bound `UNTextListEntry` data model. The data object carries optional foreground (text) and background (border) color overrides — when an override is unset, the widget's defaults are left in place. This makes `UNTextListViewEntry` the simplest reusable label row in the framework: drop in text, optionally pick colors, done.

For interactive rows that respond to clicks, use [UNButtonListViewEntry](button-list-view-entry.md) instead.

## What It Is

- **Two-Type Pattern**: `UNTextListViewEntry` is the widget; `UNTextListEntry` is the `UObject` row data fed into the [UNListView](../components/list-view.md).
- **Optional Color Overrides**: The data object's `bHasForegroundColor` / `bHasBackgroundColor` flags gate whether the widget applies the stored color. Unset values leave the widget's own defaults intact.
- **Pure Display**: There are no click handlers, hover transitions, or owner callbacks beyond the standard `INListViewEntry::SetOwnerListView`.

## Bound Widgets

| Widget | Type | Role |
| :-- | :-- | :-- |
| `Container` | `UBorder` | The row background; recolored by `SetBackgroundColor` when the data object provides one. |
| `Text` | `UCommonTextBlock` | The row label, set by `SetText` from the bound data object. |

## Behavior

- **`NativeOnListItemObjectSet(UObject*)`** receives the `UNTextListEntry` and applies its text. If `HasForegroundColor()` is `true`, it also calls `SetTextColor`; if `HasBackgroundColor()` is `true`, it also calls `SetBackgroundColor`.
- **`SetOwnerListView`** caches the owner reference for any subclass logic that needs it.

## Public API

### Set Text

```cpp
/** Updates the text displayed by the bound UCommonTextBlock. */
UFUNCTION(BlueprintCallable, Category = "NEXUS|UI")
void SetText(const FText NewText) const;
```

### Set Text Color

```cpp
/** Applies a palette color to the text block's color-and-opacity. */
UFUNCTION(BlueprintCallable, Category = "NEXUS|UI")
void SetTextColor(ENColor NewColor) const;
```

### Set Background Color

```cpp
/** Applies a palette color to the container border's brush. */
UFUNCTION(BlueprintCallable, Category = "NEXUS|UI")
void SetBackgroundColor(ENColor NewColor) const;
```

## Data Object — `UNTextListEntry`

```cpp
UCLASS(BlueprintType, DisplayName = "NEXUS | Text List Entry")
class NEXUSUI_API UNTextListEntry : public UObject
```

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `Text` | empty | Label rendered in the row. |
| `ForegroundColor` | `NC_White` | Text color override; only applied when `HasForegroundColor()` returns `true`. |
| `BackgroundColor` | `NC_Transparent` | Border brush color override; only applied when `HasBackgroundColor()` returns `true`. |

Setting either color via `SetForegroundColor` / `SetBackgroundColor` flips the corresponding `bHas*` flag to `true`, so calling `Set*` is the canonical way to opt in to the override. There is no public way to clear a color back to "use widget default" once set.
