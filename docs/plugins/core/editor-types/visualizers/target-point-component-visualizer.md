---
sidebar_class_name: type native-class
description: Editor component visualizer that draws a target point marker's orientation, scale and tags in level viewports.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Target Point Component Visualizer

<TypeDetails icon="native-class" base="FComponentVisualizer" type="FNTargetPointComponentVisualizer" typeExtra="" headerFile="NexusCoreEditor/Public/Visualizers/NTargetPointComponentVisualizer.h" />

Editor-only component visualizer for [Target Point Component](../../types/pcg/target-point-component.md). Registered with the editor's `ComponentVisualizers` module, so markers appear automatically whenever a selected actor carries one.

This is the **authoring layer** over a marker, not the whole of it. The component's own editor-only billboard is what shows that a marker exists at all; what is drawn here is the detail that only matters while one is being placed.

## What It Draws

| Element | Why |
| :-- | :-- |
| **Scaled axes** at the marker | [Get Component Points](../../types/pcg/elements/get-component-points.md) emits the component transform whole, so an unnoticed rotation or scale reaches every spawner downstream. Drawing the axes scaled puts both on screen rather than just position. |
| **An arrow pointing world down**, in the Get Component Points node colour | A fixed reference against the axes beside it — the axes turn with the marker, the arrow does not — and a visual tie between the marker and the node that consumes it. |
| **The component's tags**, labelled beside the marker | Get Component Points filters on those tags, so which markers a given node will gather is readable off the level rather than inferred from the graph. |

The marker point itself is a **screen-space** handle rather than world-space geometry, so it stays visible and clickable at any zoom. A wire shape sized in world units shrinks to a speck exactly when a set of markers is being surveyed from a distance, which is when you most need to see them.

### Label Culling

Tags are joined onto one line per marker, and labels stop drawing past **2500 units** from the camera. An actor can carry a great many markers, and all of them labelled at once is a wall of text rather than information.

The distance cull is skipped in orthographic views, where the view origin sits outside the scene and a distance from it means nothing.

## Clicking Selects The Component

Everything the marker draws sits behind one hit proxy, and the visualizer accepts the click itself — which is what selects the **component** rather than the actor holding it. The transform gizmo therefore lands on the marker being moved, and alt-dragging that gizmo duplicates the marker the way it duplicates an actor.

The engine's own click handling would not do this. It gates component selection on the owning actor being blueprint*able*, and an actor that already **is** a Blueprint is not — so on a marker every click would resolve up to the actor that is already selected, and nothing would appear to happen.

:::warning[The click acceptance and the alt-drag hand-back are one mechanism]

Accepting a click makes this the **active** component visualizer. Both of the engine's alt-drag duplicate paths refuse to run alongside an active visualizer, so `TrackingStarted` hands that status back as a drag begins — early enough to land in the same function that goes on to test for it.

`VisProxyHandleClick`, `ShouldAutoSelectElementOnHandleClick` and `TrackingStarted` are three halves of one behaviour. Read all three, and the two `@note` comments on the header, before changing any of them.

:::

## Only While Selected

Component visualizers are only drawn for the components of a **selected** actor, so this layer appears while the marker's actor is selected and not otherwise. That is the right trade for authoring detail: orientation, scale and tag labels matter while a marker is being placed, and are clutter the rest of the time.

In a **Blueprint editor** viewport the gate is tighter still — `FSCSEditorViewportClient::Draw` feeds visualizers only the components selected in the Components panel, never the rest of the preview actor. This layer therefore appears there only while the marker itself is selected.

That is why the component carries a sprite rather than relying on this visualizer alone. The sprite is what makes a marker findable in the windows this layer does not reach, and what gives it a click target to be selected with in the first place — see [Target Point Component](../../types/pcg/target-point-component.md#why-the-sprite-is-not-decoration). Its hit proxy resolves to the same component this one does; the marker drawn here takes foreground priority where the two overlap.

## See Also

- [Target Point Component](../../types/pcg/target-point-component.md) — the component this visualizer renders.
- [Get Component Points](../../types/pcg/elements/get-component-points.md) — the node that consumes those markers.
