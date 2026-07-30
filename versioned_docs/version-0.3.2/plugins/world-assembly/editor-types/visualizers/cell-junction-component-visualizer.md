---
sidebar_class_name: type native-class
description: Editor component visualizer that draws a junction's socket footprint and orientation gizmo in level viewports.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Junction Component Visualizer

<TypeDetails icon="native-class" base="FComponentVisualizer" type="FNCellJunctionComponentVisualizer" typeExtra="" headerFile="NexusWorldAssemblyEditor/Public/Visualizers/NCellJunctionComponentVisualizer.h" />

Draws a [Junction Component](../../types/junction-component.md)'s socket footprint and orientation gizmo into the level viewport, so connection points are visible without selecting each junction in turn.

The simplest of the three visualizers — one `DrawVisualization` override and no state.

## Methods

### Draw Visualization

```cpp
virtual void DrawVisualization(const UActorComponent* Component, const FSceneView* View, FPrimitiveDrawInterface* PDI) override;
```

The visualizer itself draws nothing directly. It resolves the component, then calls the junction's own `DrawDebugPDI`, passing the editor mode's cached valid and invalid junction colours. That in turn builds a `FNDrawSocketSettings` and hands it to [`FNWorldAssemblyDebugDraw::DrawSocket`](../../types/world-assembly-debug-draw.md#drawing-a-socket) — which is what makes a junction look identical here and anywhere else sockets are rendered.

Because the socket rectangle is drawn rotated 90° from the junction's forward direction, it reads as a doorway you pass *through* rather than a panel you look at.

:::note[It stands down while Editor Mode is active]

`DrawVisualization` draws **only when the World Assembly [Editor Mode](../../editor-mode/index.mdx) is not active**. While the mode is running it draws junctions itself, with the fuller state it has available — fill depth, connection status, per-junction validity — so the visualizer skipping its own pass is what prevents two overlapping sets of socket geometry.

The practical consequence: junction gizmos you see with the mode closed and with it open come from different code paths, so they are not guaranteed to look the same. The mode's version is the richer one.

:::

Unlike the [Cell Root Component Visualizer](cell-root-component-visualizer.md), this one is **draw-only** — it handles no clicks or drags, so junctions are edited through the [Junction menu](../../editor-mode/cell-editor.md#junction-menu) and the details panel rather than in the viewport.

## See Also

- [Junction Component](../../types/junction-component.md) — the component this visualizer renders.
- [World Assembly Debug Draw](../../types/world-assembly-debug-draw.md) — the shared socket-drawing helper it calls.
