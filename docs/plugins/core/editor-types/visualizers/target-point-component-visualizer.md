---
sidebar_class_name: type native-class
description: Editor component visualizer that draws a target point marker's orientation, scale and tags in level viewports.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Target Point Component Visualizer

<TypeDetails icon="native-class" base="FComponentVisualizer" type="FNTargetPointComponentVisualizer" typeExtra="" headerFile="NexusCoreEditor/Public/Visualizers/NTargetPointComponentVisualizer.h" />

Editor-only component visualizer for [Target Point Component](../../types/pcg/target-point-component.md). Registered with the editor's `ComponentVisualizers` module, so markers appear automatically whenever a selected actor carries one.

This is **the whole of a target point's presence in the world**. The component attaches nothing of its own, so what is drawn here is all there is to see and all there is to click.

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

Component visualizers are only drawn for the components of a **selected** actor, so markers are visible while their actor is selected and not otherwise.

That is deliberate rather than a limitation to work around. Drawing entirely from the visualizer is what keeps markers out of `Get Actor Data` with no exceptions relied on — any primitive hung off a marker, sprite or otherwise, is something PCG's actor parsing has to be trusted to skip, and PCG's component parsing is the reason the component exists at all. The trade is that markers are only drawn when they are being authored, which is when you want them.

## See Also

- [Target Point Component](../../types/pcg/target-point-component.md) — the component this visualizer renders.
- [Get Component Points](../../types/pcg/elements/get-component-points.md) — the node that consumes those markers.
