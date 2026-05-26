---
sidebar_position: 1
sidebar_label: Multi-Line Text Box Canvas Item
sidebar_class_name: type native-struct
description: A canvas-renderable multi-line text box with severity-driven border styling.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Multi-Line Text Box Canvas Item

<TypeDetails icon="native-struct" base="struct" type="FNMultiLineTextBoxCanvasItem" typeExtra="" headerFile="NexusUI/Public/CanvasItems/NMultiLineTextBoxCanvasItem.h" />

A canvas-renderable text box that holds an ordered list of small / large text lines, per-line colors, and a current severity level. Intended for HUDs, developer overlays, and diagnostic readouts that need to be drawn directly via [`FNCanvasUtils::DrawCanvasTextBox`](../canvas-utils.md) without the cost of Slate / UMG.

The struct owns its own dirty flag, severity tracking, and on-demand measurement pass — callers just push lines, set severity, and ask `FNCanvasUtils` to draw it.

## Adding Content

```cpp
/** Append a small-font line in the supplied color. */
void AddSmallLine(const FText& Line, const FLinearColor Color = FLinearColor::White);

/** Append a large-font line in the supplied color. */
void AddLargeLine(const FText& Line, const FLinearColor Color = FLinearColor::White);

/** Clear every line, reset severity to Message, and restore the default border / background colors. */
void Clear();
```

Each `Add*Line` call sets the dirty flag — `FNCanvasUtils` will re-measure the box on the next draw if any line has been added or modified since the last paint.

## Severity

Severity drives the border color of the text box and is meant to be aggregated from many sources over a render frame. Set the value explicitly when you know it, or use `AddSeverity` to monotonically raise it as more serious lines are appended.

```cpp
/** Set the current severity and update BorderColor accordingly. */
void SetSeverity(const ENSeverity Severity);

/** Raise the current severity only when New is louder than the cached level; no-op otherwise. */
void AddSeverity(const ENSeverity Severity);
```

| [Severity](../../../core/types/types/severity.md) | Border Color |
| :-- | :-- |
| `Info` | Dark grey (`FNColor::GreyDark`) |
| `Message` | Light grey (`FNColor::GreyLight`) — default |
| `Warning` | Yellow |
| `Error` | Red |
| `Fatal` | Pink (`FNColor::Pink`) |

## State Queries

```cpp
/** True when the box has any lines. */
bool HasContent() const;

/** True when content has been added/modified since the last successful draw. */
bool IsDirty() const;
```

## Drawing

The struct holds private layout state and is rendered via the friend class [`FNCanvasUtils`](../canvas-utils.md):

```cpp
FNCanvasUtils::DrawCanvasTextBox(&TextBox, Canvas, TopLeftPosition);
```

`DrawCanvasTextBox` re-runs the internal measurement pass when the box is dirty, then draws background, border, and each line at the correct offset.
