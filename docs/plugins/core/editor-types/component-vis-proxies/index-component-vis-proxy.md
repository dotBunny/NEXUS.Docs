---
sidebar_position: 11
sidebar_label: Index Component Vis Proxy
sidebar_class_name: type native-struct
description: Hit-proxy that identifies an individual indexed element rendered by a component visualizer.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Index Component Vis Proxy

<TypeDetails icon="native-struct" base="HComponentVisProxy" type="HNIndexComponentVisProxy" typeExtra="" headerFile="NexusCoreEditor/Public/ComponentVisProxies/NIndexComponentVisProxy.h" />

Hit-proxy that identifies an individual indexed element (e.g. a vertex) rendered by a component visualizer. The `Index` value lets the owning `FComponentVisualizer` route picks back to a specific element. Returns `EMouseCursor::Crosshairs` when hovered.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Index` | `int32` | Index of the element this proxy represents within its owning component. |

## Constructor

```cpp
HNIndexComponentVisProxy(const UActorComponent* InComponent, const int32 InVertexIndex);
```

## See Also

- [Edge Component Vis Proxy](edge-component-vis-proxy.md) — two-endpoint variant for edges.
