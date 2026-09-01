---
sidebar_class_name: type ue-object
description: PCG node that flattens every input point onto a single world-Z plane.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Set Position Z

<TypeDetails icon="ue-object" base="UPCGSettings" type="UNSetPositionZSettings" typeExtra=" + FNSetPositionZParams" headerFile="NexusCore/Public/PCG/Elements/NSetPositionZElement.h" />

**`NEXUS | Set Position Z`** — the simplest node in the [Elements](index.mdx) set. It takes points and snaps every one of them to the same world Z.

It exists to make the 2D nodes downstream honest. [Filter Edge Points 2D (XY)](filter-edge-points-2d-xy.md) and [Sort Line 2D (XY)](sort-line-2d-xy.md) reason about points as a plane, and a sampler that picked up terrain variation gives them a plane that is not one. Flatten first, and the rest of the chain behaves.

## Settings

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Z Value` | `float` | Target world Z that every input point is snapped to. | `0.f` |

The property lives on a nested `FNSetPositionZParams` struct exposed with `meta=(ShowOnlyInnerProperties, PCG_Overridable)` — so it presents as a plain field on the node, and `Z Value` can be driven by a graph parameter or an override pin rather than authored inline.

## Pins

| Direction | Pin | Type |
| :-- | :-- | :-- |
| In | `In` | Point |
| Out | `Out` | Point |

## Behavior

Absolute, not relative — the point's existing Z is discarded rather than offset. X, Y, rotation, scale, and all metadata pass through untouched, and the output preserves the input's attribute schema.

Empty inputs are skipped rather than emitted as empty data, so a node fed nothing produces nothing on its output pin.

:::note[Main-thread only, but cacheable]

`FNSetPositionZElement` overrides `CanExecuteOnlyOnMainThread` to return `true` — so despite being trivially parallelizable maths, it runs on the game thread. It also returns `true` from `IsCacheable`, which is what keeps that from mattering: a flatten with unchanged input and unchanged `Z Value` is served from PCG's cache instead of re-run.

:::
