---
sidebar_class_name: type ue-object
description: PCG node that emits one point per target point component found on the actor running the graph.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Get Component Points

<TypeDetails icon="ue-object" base="UPCGSettings" type="UNGetComponentPointsSettings" typeExtra=" + FNGetComponentPointsElement" headerFile="NexusCore/Public/PCG/Elements/NGetComponentPointsElement.h" />

**`NEXUS | Get Component Points`** — reads marker components off the actor running the graph and emits one point per marker.

This is the node that makes [Target Point Component](../target-point-component.md) usable. PCG's own component parsing understands splines, shapes, primitives and virtual textures, and returns nothing for anything else — so a bare scene component produces no data at all through `Get Actor Data`. This node reads them directly.

## Settings

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Component Class` | `TSubclassOf<USceneComponent>` | Component class to gather. Narrow it to a subclass to keep separate sets of markers on one actor apart. | `UNTargetPointComponent` |
| `Filter By Tag?` | `bool` | Gather only components carrying the tag below. | `false` |
| `Component Tag` | `FName` | The tag to require. Shown only when `Filter By Tag?` is on. | *(empty)* |

Both are `PCG_Overridable`, so either can be driven by a graph parameter or an override pin.

## Pins

| Direction | Pin | Carries |
| :-- | :-- | :-- |
| Out | `Out` | One point per gathered component. |

The node is an `InputOutput` settings type — it originates data rather than transforming it.

## Two Ways To Narrow

`Component Class` and `Component Tag` do the same job at different granularities, and they compose.

**By class** is the coarser split, and the one to reach for when the two sets of markers mean genuinely different things — subclass `UNTargetPointComponent` twice and each node gathers only its own kind. Nothing distinguishes them in the viewport beyond the class name in the outliner.

**By tag** is the finer split, and the one you can change without recompiling. The tags are matched against **the component's own** tags, not its actor's — which is why [Target Point Component](../target-point-component.md) leaves the `Tags` category visible where the framework's other marker components hide it. The visualizer labels each marker with its tags, so which node will gather which marker is readable off the level.

:::note[An enabled filter with no tag matches everything]

Turning `Filter By Tag?` on and leaving `Component Tag` empty gathers every component, not none.

Matching nothing would read as the node being broken rather than as a filter that happens to exclude everything — an empty result with no error is the hardest kind of graph problem to find. The tag being blank is the state you pass through on the way to typing one.

:::

## Behavior

The transform is emitted **whole** — position, rotation and scale — so a marker that has been rotated or scaled carries that through to whatever consumes the points.

`MatchesTagFilter` is exposed as a pure static so the filter rule can be unit-tested without PCG types:

```cpp
/**
 * Tests whether a component's tags satisfy the tag filter.
 * @param ComponentTags The component's own tags.
 * @param bFilterByTag Whether filtering is enabled at all.
 * @param Tag The tag to require.
 * @return True when the component should be gathered.
 */
static NEXUSCORE_API bool MatchesTagFilter(TConstArrayView<FName> ComponentTags, bool bFilterByTag, FName Tag);
```

:::warning[Main-thread only, and never cached]

`FNGetComponentPointsElement` returns `true` from `CanExecuteOnlyOnMainThread` and **`false` from `IsCacheable`**, which is unusual — most nodes want the cache.

Both follow from the same fact: it reads live actor components. Touching those away from the game thread is unsafe, and caching the result would keep serving the markers' old positions after you moved one. A node whose whole purpose is to reflect what is in the level has to re-read the level.

:::
