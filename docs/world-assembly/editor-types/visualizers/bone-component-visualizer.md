---
sidebar_class_name: type native-class
description: Editor component visualizer that draws a bone's socket, reach, and mode-specific widgets, with a memoized world-penetration test behind it.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Bone Component Visualizer

<TypeDetails icon="native-class" base="FComponentVisualizer" type="FNBoneComponentVisualizer" typeExtra="" headerFile="NexusWorldAssemblyEditor/Public/Visualizers/NBoneComponentVisualizer.h" />

Draws a [Bone Component](../../types/bone-component.md)'s socket, reach, and mode-specific widgets into the level viewport, so an author can reason about where junction anchors sit without having to select each one.

Its public surface is a single `DrawVisualization` override. Everything else on the class exists to keep that draw affordable.

## Why There Is a Cache

Part of what the visualizer shows is how far a bone's socket corners **penetrate world collision**. That matters because a bone buried in geometry will not produce a usable junction. Computing it means sampling the socket corners against the level's **baked** [world collision](../../world-collision.md), read through [FNWorldCollisionPreview](../world-collision-preview.md). The preview is the same geometry an assembly collides with, and nothing is gathered live.

`DrawVisualization` runs on **every viewport redraw**. Recomputing a penetration sweep per bone per frame would make an idle viewport with a few dozen bones expensive for no reason, so the result is memoized and reused while its inputs are unchanged.

An entry is keyed on everything the result depends on:

| Key | Invalidated when |
| :-- | :-- |
| Bone world transform | The bone is moved or rotated. |
| Bone socket size | The bone's own socket dimensions change. |
| Project socket size | The [`Socket Size`](../../project-settings.md) setting changes. |
| World results generation | That world's collision preview changes: a bake, or an edit that invalidates it (`FNWorldCollisionPreview::GetGeneration`). Moving a bone is **not** such an edit. Bones carry no collision and are left out of the bake, so the readout stays live while you drag one. |

Any mismatch drops the entry and recomputes; the recompute itself goes through the shared, BVH-accelerated world-collision mesh rather than raw geometry.

:::note[The cache is per-bone but shared across worlds]

One static map serves every world the visualizer draws for — the level viewport *and* Blueprint-editor preview scenes. That is why each entry stores the **world generation it was built against** rather than trusting a single global counter: a collision rebuild in one world must not invalidate bones in another, and a shared counter would do exactly that.

Entries for destroyed bones are keyed weakly and pruned lazily on the recompute path, which is rare by design — so a deleted bone leaves a dead entry behind until something else forces that path. Harmless, but do not read the map's size as a live bone count.

:::

## When There Is Nothing To Measure Against

While the level's world collision is unbaked or stale, the bone is drawn in the `Unverified` [palette color](../../user-settings.md#bones) instead of its valid or invalid color. The readout can only sample what has been drawn as current this session, so it may read zero, and a zero drawn in the valid color would claim the bone is clear based on a check that never happened.

The visualizer does not raise a notification about this. It runs per bone, per viewport, per redraw, which is the wrong place to raise UI from. The bone's own color reports the condition to the person looking at the bone, for exactly as long as it holds. See [Is My Cache Current?](../../world-collision.md#is-my-cache-current).

## See Also

- [Bone Component](../../types/bone-component.md) — the component this visualizer renders.
- [Bone Actor](../../types/bone-actor.md) — the actor wrapper that carries one.
- [Project Settings](../../project-settings.md) — supplies the socket size the penetration test is measured against.
