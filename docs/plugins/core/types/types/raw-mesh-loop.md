---
sidebar_position: 46
sidebar_label: Raw Mesh Loop
sidebar_class_name: type native-struct
description: One ordered index loop within an FNRawMesh (triangle, quad, or n-gon).
tags: [0.2.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Raw Mesh Loop

<TypeDetails icon="native-struct" base="struct" type="FNRawMeshLoop" typeExtra="" headerFile="NexusCore/Public/Types/NRawMeshLoop.h" />

One ordered index loop within an [`Raw Mesh`](raw-mesh.md) (triangle, quad, or n-gon). Indices are stored in winding order and reference entries in the parent mesh's `Vertices` array.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `Indices` | `TArray<int>` | Ordered list of vertex indices referencing the parent mesh's vertex buffer. |

## Constructors

```cpp
FNRawMeshLoop() = default;

/** Triangle constructor. */
FNRawMeshLoop(const int32 A, const int32 B, const int32 C);

/** Quad constructor. */
FNRawMeshLoop(const int32 A, const int32 B, const int32 C, const int32 D);

/** N-gon constructor accepting any vertex count. Moves InIndices into the loop. */
FNRawMeshLoop(TArray<int32> InIndices);
```

## Methods

```cpp
/** Exact order-sensitive equality with Other. */
bool IsEqual(const FNRawMeshLoop& Other) const;

/** Returns true when the loop has exactly three vertices. */
bool IsTriangle() const;

/** Returns true when the loop has exactly four vertices. */
bool IsQuad() const;

/** Returns true when the loop has more than four vertices. */
bool IsNgon() const;
```
