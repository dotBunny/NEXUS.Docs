---
sidebar_class_name: type native-class
description: Editor component visualizer that draws the distribution shape of a UNActorPoolSpawnerComponent in level viewports.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Actor Pool Spawner Component Visualizer

<TypeDetails icon="native-class" base="FComponentVisualizer" type="FNActorPoolSpawnerComponentVisualizer" typeExtra="" headerFile="NexusActorPoolsEditor/Public/Visualizers/NActorPoolSpawnerComponentVisualizer.h" />

Editor-only component visualizer that draws the distribution shape of an [Actor Pool Spawner Component](../../types/actor-pool-spawner-component.md) into level viewports. Registered with the editor's `ComponentVisualizers` module so the gizmo appears automatically whenever a selected actor carries a spawner component.

![Two spawners selected in a level viewport, one drawing a Radius distribution as concentric circles and the other a Sphere distribution as a three-axis wireframe](/assets/images/docs/plugins/actor-pools/editor-types/visualizers/actor-pool-spawner-component-visualizer.webp)

Above, two of the sample spawners in `DEMO_NActorPools`: the **Radius** distribution on the left, the **Sphere** on the right. Nothing is drawn for an unselected spawner — the shape appears on selection and disappears with it.

## Methods

### Draw Visualization

```cpp
virtual void DrawVisualization(const UActorComponent* Component, const FSceneView* View, FPrimitiveDrawInterface* PDI) override;
```

Reads the spawner component's configured distribution (box / sphere / cylinder / spline picker) and emits primitive draw commands so the shape is visible in the viewport.

## See Also

- [Actor Pool Spawner Component](../../types/actor-pool-spawner-component.md) — the component this visualizer renders.
