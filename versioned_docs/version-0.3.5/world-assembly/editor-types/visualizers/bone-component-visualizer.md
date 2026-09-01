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

Part of what the visualizer shows is how far a bone's socket corners **penetrate world collision** — useful, because a bone buried in geometry will not produce a usable junction. Computing that means sweeping the socket corners against the world-collision mesh.

`DrawVisualization` runs on **every viewport redraw**. Recomputing a penetration sweep per bone per frame would make an idle viewport with a few dozen bones expensive for no reason, so the result is memoized and reused while its inputs are unchanged.

An entry is keyed on everything the result depends on:

| Key | Invalidated when |
| :-- | :-- |
| Bone world transform | The bone is moved or rotated. |
| Bone socket size | The bone's own socket dimensions change. |
| Project socket size | The [`Socket Size`](../../project-settings.md) setting changes. |
| World results generation | That world's collision results are rebuilt. |

Any mismatch drops the entry and recomputes; the recompute itself goes through the shared, BVH-accelerated world-collision mesh rather than raw geometry.

:::note[The cache is per-bone but shared across worlds]

One static map serves every world the visualizer draws for — the level viewport *and* Blueprint-editor preview scenes. That is why each entry stores the **world generation it was built against** rather than trusting a single global counter: a collision rebuild in one world must not invalidate bones in another, and a shared counter would do exactly that.

Entries for destroyed bones are keyed weakly and pruned lazily on the recompute path, which is rare by design — so a deleted bone leaves a dead entry behind until something else forces that path. Harmless, but do not read the map's size as a live bone count.

:::

## See Also

- [Bone Component](../../types/bone-component.md) — the component this visualizer renders.
- [Bone Actor](../../types/bone-actor.md) — the actor wrapper that carries one.
- [Project Settings](../../project-settings.md) — supplies the socket size the penetration test is measured against.
