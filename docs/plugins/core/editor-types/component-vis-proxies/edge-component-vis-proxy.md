---
sidebar_position: 10
sidebar_label: Edge Component Vis Proxy
sidebar_class_name: type native-struct
description: Hit-proxy that represents an edge — a pair of indexed endpoints — rendered by a component visualizer.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Edge Component Vis Proxy

<TypeDetails icon="native-struct" base="HComponentVisProxy" type="HNEdgeComponentVisProxy" typeExtra="" headerFile="NexusCoreEditor/Public/ComponentVisProxies/NEdgeComponentVisProxy.h" />

Hit-proxy that represents an edge — a pair of indexed endpoints — rendered by a component visualizer. The `StartIndex` / `EndIndex` pair lets the owning `FComponentVisualizer` identify which edge was picked.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Cursor` | `EMouseCursor::Type` | Mouse cursor shown when the edge is hovered. Defaults to `ResizeLeftRight`. |
| `StartIndex` | `int32` | Index of the edge's first endpoint within the owning component. |
| `EndIndex` | `int32` | Index of the edge's second endpoint within the owning component. |

## Constructor

```cpp
HNEdgeComponentVisProxy(const UActorComponent* InComponent, const int32 InStartIndex, const int32 InEndIndex,
  const EMouseCursor::Type InCursor = EMouseCursor::ResizeLeftRight);
```

## See Also

- [Index Component Vis Proxy](index-component-vis-proxy.md) — single-vertex variant.
