---
sidebar_class_name: type native-class
description: Native helpers for drawing NEXUS canvas items to an FCanvas.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Canvas Utils

<TypeDetails icon="native-class" base="class" type="FNCanvasUtils" typeExtra="" headerFile="NexusUI/Public/NCanvasUtils.h" />

Native helpers for drawing NEXUS [Canvas Items](canvas-items/index.mdx) onto an `FCanvas`. Friend class to every canvas-item struct, so the helpers can reach into their private layout state without exposing it on the public API.

## Methods

### Draw Canvas Text Box

```cpp
/**
 * Draw a multi-line text box onto Canvas with its top-left aligned to TopLeftPosition.
 * Re-runs the box's measurement pass when it is dirty, then renders background, border, and each line.
 * @param TextBox The canvas-item to render. Caller retains ownership.
 * @param Canvas The FCanvas to draw into.
 * @param TopLeftPosition Pixel position of the box's top-left corner in Canvas space.
 */
static void DrawCanvasTextBox(FNMultiLineTextBoxCanvasItem* TextBox, FCanvas* Canvas, FVector2D TopLeftPosition);
```

See [`FNMultiLineTextBoxCanvasItem`](canvas-items/multi-line-text-box-canvas-item.md) for the input shape and severity-driven border styling.
