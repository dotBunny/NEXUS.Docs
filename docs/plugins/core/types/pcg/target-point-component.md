---
sidebar_class_name: type ue-scene-component
description: A bare positional marker placed on an actor for PCG graphs to read back as points.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Target Point Component

<TypeDetails icon="ue-scene-component" base="USceneComponent" type="UNTargetPointComponent" typeExtra="" headerFile="NexusCore/Public/PCG/NTargetPointComponent.h" />

**`NEXUS | Target Point`** — a positional marker you add to an actor so a PCG graph can read it back as a point. It is deliberately the emptiest useful component in the framework: a `USceneComponent` with no properties of its own.

Pair it with [Get Component Points](elements/get-component-points.md), which gathers these off the actor running the graph and emits one point per marker.

## Why It Exists

PCG's built-in component parsing only understands splines, shapes, primitives and virtual textures. A plain scene component returns **nothing** through `Get Actor Data` — so without a node that reads them directly, a marker like this would be invisible to the graph.

The alternative is to scatter separate marker *actors* through the outliner and gather those. This keeps markers authorable as components on the PCG actor itself, which is where they belong when they describe that actor's layout.

## In The Viewport

The component attaches nothing of its own to be seen by. Everything visible is drawn by [Target Point Component Visualizer](../../editor-types/visualizers/target-point-component-visualizer.md):

- **Scaled axes** at the marker, which turn with it.
- **An arrow pointing world down**, in the Get Component Points node colour — a fixed reference against the axes beside it.
- **The component's tags**, labelled beside the marker, so you can read off the level which node will gather it.

Two consequences follow from drawing entirely in a visualizer rather than from an attached primitive:

| | Why |
| :-- | :-- |
| Markers are only drawn while their actor is **selected**. | Component visualizers only run for a selected actor's components. That is when a marker is being authored, which is when you want to see it. |
| Nothing of the marker reaches `Get Actor Data`. | Any primitive hung off the marker — a sprite, a billboard, anything — would be something PCG's actor parsing has to be trusted to skip. Attaching none is the guarantee. |

Clicking a marker selects **the component**, not the actor holding it, so the transform gizmo lands on the marker you are moving and alt-drag duplicates it the way it duplicates an actor.

## Tags Are Visible On Purpose

Most NEXUS marker components hide the `Tags` category. This one does not.

[Get Component Points](elements/get-component-points.md) filters on this component's **own** tags — not its actor's — so hiding the category would put the filter out of reach. One actor can therefore hold several sets of markers that different nodes pick up separately, distinguished by tag.

The `HideCategories` list covers everything else that would only be noise on a marker: `Activation`, `AssetUserData`, `Cooking`, `Navigation`, `HLOD`, `LOD`, `Rendering`, `Collision`, `Physics`.

## Transform Is Read Whole

Get Component Points emits the component transform in full — position, rotation **and** scale. An unnoticed rotation or scale on a marker reaches every spawner downstream, which is exactly why the visualizer draws the axes scaled rather than drawing a fixed gizmo.
