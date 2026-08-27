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

A marker is drawn in two layers, and the split matters because they appear at different times.

An **editor-only billboard** carries the marker's presence: it uses the engine's own `S_TargetPoint` sprite — the one `ATargetPoint` uses — so a marker reads as the same kind of thing as the built-in it stands in for. It is what tells you a marker exists at all.

[Target Point Component Visualizer](../../editor-types/visualizers/target-point-component-visualizer.md) layers the authoring detail on top, once the marker's actor is selected:

- **Scaled axes** at the marker, which turn with it.
- **An arrow pointing world down**, in the Get Component Points node colour — a fixed reference against the axes beside it.
- **The component's tags**, labelled beside the marker, so you can read off the level which node will gather it.

Clicking either layer selects **the component**, not the actor holding it, so the transform gizmo lands on the marker you are moving. The visualizer draws at foreground priority, so it wins over the sprite where the two overlap — both routes end at the same component regardless.

### Why The Sprite Is Not Decoration

Drawing the marker purely in its visualizer is what the component used to do, and it fails in the Blueprint editor. A Blueprint viewport runs component visualizers only for components selected in the **Components panel** (`FSCSEditorViewportClient::Draw`), never for the rest of the preview actor the way a level viewport does. A marker with nothing else in the world is therefore invisible there — and, being invisible, offers no click target to become selected with. The sprite breaks that loop: clicking it resolves up the attachment chain to the component's tree node, which is what then brings the visualizer in.

### A Billboard Is The Only Primitive Allowed

`Get Actor Data` walks every component on an actor and turns each `UPrimitiveComponent` it does not recognise into `UPCGPrimitiveData`. There is exactly one carve-out — `UBillboardComponent`, in `FPCGGetDataFunctionRegistry::DefaultDataFromComponent`.

That carve-out is the entire reason a sprite is safe here and an arrow, a shape, or a mesh used as the icon would not be: any of those would feed the marker's own decoration back into the graph as geometry.

:::note[The icon is built at register time, not in the constructor]

A marker is a Blueprint-spawnable component, and a default subobject of a *component* serializes an `AttachParent` pointing at the component template rather than the instance. So the icon comes from `N_WORLD_ICON_ON_REGISTER` and is outered to the owning **actor** — never serialized, never a default subobject — which is the same pattern the engine uses for `USceneCaptureComponent`'s proxy mesh. It is also always `Movable`: marker components force themselves `Static`, and a `Static` child under a `Movable` parent is refused outright.

:::

## Tags Are Visible On Purpose

Most NEXUS marker components hide the `Tags` category. This one does not.

[Get Component Points](elements/get-component-points.md) filters on this component's **own** tags — not its actor's — so hiding the category would put the filter out of reach. One actor can therefore hold several sets of markers that different nodes pick up separately, distinguished by tag.

The `HideCategories` list covers everything else that would only be noise on a marker: `Activation`, `AssetUserData`, `Cooking`, `Navigation`, `HLOD`, `LOD`, `Rendering`, `Collision`, `Physics`.

## Transform Is Read Whole

Get Component Points emits the component transform in full — position, rotation **and** scale. An unnoticed rotation or scale on a marker reaches every spawner downstream, which is exactly why the visualizer draws the axes scaled rather than drawing a fixed gizmo.
