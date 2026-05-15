---
sidebar_position: 1
sidebar_label: Actor Pool Spawner Component Visualizer
sidebar_class_name: type native-class
description: Editor component visualizer that draws the distribution shape of a UNActorPoolSpawnerComponent in level viewports.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Actor Pool Spawner Component Visualizer

<TypeDetails icon="native-class" base="FComponentVisualizer" type="FNActorPoolSpawnerComponentVisualizer" typeExtra="" headerFile="NexusActorPoolsEditor/Public/Visualizers/NActorPoolSpawnerComponentVisualizer.h" />

Editor-only component visualizer that draws the distribution shape of an [Actor Pool Spawner Component](../../types/actor-pool-spawner-component.md) into level viewports. Registered with the editor's `ComponentVisualizers` module so the gizmo appears automatically whenever a selected actor carries a spawner component.

## Methods

### Draw Visualization

```cpp
virtual void DrawVisualization(const UActorComponent* Component, const FSceneView* View, FPrimitiveDrawInterface* PDI) override;
```

Reads the spawner component's configured distribution (box / sphere / cylinder / spline picker) and emits primitive draw commands so the shape is visible in the viewport.

## See Also

- [Actor Pool Spawner Component](../../types/actor-pool-spawner-component.md) — the component this visualizer renders.
