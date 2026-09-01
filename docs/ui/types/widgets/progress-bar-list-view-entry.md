---
sidebar_class_name: type ue-widget
description: A list-view entry widget rendering a progress bar plus label, message, and percent, driven by a bound UNProgressBarListEntry data object.
---

import TypeDetails from '@site/src/components/TypeDetails';

# ProgressBar ListView Entry

<TypeDetails icon="ue-widget" base="UUserWidget" type="UNProgressBarListViewEntry" typeExtra=" + UNProgressBarListEntry" headerFile="NexusUI/Public/Widgets/NProgressBarListViewEntry.h" />

A [UNListView](../components/list-view.md) entry that renders a progress bar with a label on the left, a status message in the middle, and a percentage on the right. The row is driven by a bound `UNProgressBarListEntry` data object and refreshes itself when that object changes.

It is the shipped answer to "show me a list of things that each have progress". [World Assembly](../../../world-assembly/index.mdx) uses it for per-stage [status channels](../../../world-assembly/architecture/task-graph.md#status-channels) inside each [operation row](../../../world-assembly/types/assembly-operation-list-view-entry.md).

For a plain label row, use [Text ListView Entry](text-list-view-entry.md); for a clickable one, [Button ListView Entry](button-list-view-entry.md).

## What It Is

- **Two-Type Pattern**: `UNProgressBarListViewEntry` is the widget; `UNProgressBarListEntry` is the `UObject` row data fed into the list.
- **Self-Refreshing**: The widget binds to the data object's `OnChanged` delegate, so mutating the data updates the row **in place**. The owning list only rebuilds when entries are added or removed.
- **Subclassable Template**: `Blueprintable` and `BlueprintType`, so the visual design lives in a Widget Blueprint.

## Bound Widgets

All four are `meta=(BindWidget)`, so a Widget Blueprint subclass must supply them by name. `NativeConstruct` also runs `N_VALIDATE` on each, so a binding that ends up null shows up in the log.

| Widget | Type | Role |
| :-- | :-- | :-- |
| `LeftText` | `UCommonTextBlock` | The entry's label. |
| `CenterText` | `UCommonTextBlock` | The entry's status message. |
| `RightText` | `UCommonTextBlock` | Percent, formatted `"%d%%"` (rounded to whole percent). |
| `ProgressBar` | `UProgressBar` | The entry's percent, unrounded. |

## Behavior

- **`NativeOnListItemObjectSet(UObject*)`** unbinds any previous data object, casts the item to `UNProgressBarListEntry`, binds `OnChanged`, and paints. A cast failure calls `Reset()` rather than leaving stale content on screen.
- **`NativeOnEntryReleased()`** unbinds, drops the data reference, and clears the row — so a recycled entry never briefly shows the previous row's values.
- **`OnDataChanged()`** is the delegate target; it repaints from the bound object.
- **`Reset()`** clears all three labels and sets the bar to `0`.

Every path that touches the widget tree checks its `BindWidget` pointers first. Those are required bindings in a compiling Blueprint, so the guard is belt-and-braces against a malformed cooked subclass — it fails soft rather than dereferencing null.

:::note[The bar and the text disagree on precision, deliberately]

`ProgressBar` receives the raw `0..1` value while `RightText` shows it rounded to a whole percent. A bar at `0.674` reads `67%` in text but sits at its true position, so the bar animates smoothly while the label does not flicker between neighbouring values.

:::

## The Percent Cache

`OnChanged` is a **single coarse broadcast** — label, message, and percent all share it — so the widget repaints fully whenever any one of them moves. Setting text on a `UCommonTextBlock` forces a Slate relayout, and a progress list updating many times a second makes that measurable.

So the widget caches the last whole percent it painted and skips `RightText->SetText` when the rounded value has not moved. A label-only change therefore costs one text update instead of two.

Two details make the cache safe:

- It is seeded to `MIN_int32`, so the first paint always happens.
- `Reset()` reseeds it, because `Reset` clears `RightText` directly — without that, a recycled entry whose new data landed on the same rounded percent would stay blank.

## Data Object — `UNProgressBarListEntry`

```cpp
UCLASS(ClassGroup = "NEXUS", DisplayName = "NEXUS | ProgressBar List Entry", BlueprintType)
class NEXUSUI_API UNProgressBarListEntry : public UObject
```

A plain `UObject` view-model. Fields are private; read them with `GetLabel()` / `GetMessage()` / `GetPercent()`.

| Setter | Effect |
| :-- | :-- |
| `SetLabel(const FString&)` | Sets the label. |
| `SetMessage(const FString&)` | Sets the status message. |
| `SetPercent(float)` | Sets the percent, **clamped to `0..1`**. |
| `SetStatus(const FString&, float)` | Sets message and percent together, broadcasting at most once. |

`OnChanged` is `BlueprintAssignable`, so Blueprint can react to the same signal the widget does.

:::info[Every setter is change-gated]

A setter that receives the value already stored does **not** broadcast. Pushing the same status repeatedly is free, so a producer polling at high frequency does not have to track what it last sent.

Note the clamp happens *before* the comparison, so `SetPercent(1.5)` on an entry already at `1.0` is correctly a no-op rather than a redundant broadcast. Prefer `SetStatus` when both message and percent change — the two separate setters would broadcast twice and repaint the row twice.

:::
