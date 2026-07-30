---
sidebar_class_name: type native-class
description: The in-memory graph one organ's layout is built as — its node types, ownership rules, and how expansion terminates.
---

# Organ Graph

The data structure generation actually produces. One `FNAssemblyGraph` per organ, built by `FNOrganGraphBuilderTask`, describing which cells go where and how they connect. Everything downstream — spawning, analytics, the placed [proxies](../types/cell-proxy.md) — reads from it.

## FNAssemblyGraph

Owns the node set the builder produces, plus the spatial extents the nodes must stay within. Nodes are registered as they are expanded, so the graph grows during the build rather than being assembled at the end.

Two members matter to anyone extending the builder:

- **`RegisterNode`** transfers ownership. A node created by the factory is not owned until it is registered, and from then on the graph frees it.
- **`CleanupBuilderReferences`** is called once the graph is handed to the next stage, dropping the scratch state expansion needed but consumers do not.

It also serves bounds queries from a spatial index rather than walking every node — `QueryCellNodesByBounds` is what the builder's placement checks go through, and the reason a large organ does not degrade quadratically.

## Node Types

All three derive from `FNAssemblyGraphNode` and are discriminated by an `ENAssemblyGraphNodeType` on that base, so a consumer walking the node set can branch without a dynamic cast. Construction goes through an `FNAssemblyGraphNodeParams` bundle rather than a long parameter list.

| Node | Represents |
| :-- | :-- |
| `FNAssemblyGraphBoneNode` | A **bone** — a pre-placed junction anchor. Owns a single socket and at most one linked neighbour. |
| `FNAssemblyGraphCellNode` | A **selected cell** placed in world space. Tracks free and linked junctions plus cached world-space bounds and hull. |
| `FNAssemblyGraphNullNode` | A **cap**. Terminates a branch without spawning content. |

Bone nodes are the fixed points expansion starts from; cell nodes are what expansion adds; null nodes are how it stops.

### Why Null Nodes Exist

A blocked or deliberately closed junction still needs *something* on the other side, or the graph would be topologically incomplete — a junction with no neighbour is indistinguishable from one that was never visited. A null node caps the branch while keeping the graph well-formed, and spawns nothing.

That distinction is what lets the [fill](../types/junction-component.md#fillers) stage tell "this junction was left open" from "this junction was closed on purpose".

## Cell Node Caching

`FNAssemblyGraphCellNode` caches its world-space bounds and baked hull because placement tests hit them constantly. Two accessors expose them — `GetWorldBounds()` for the node's AABB and `GetHullBounds()` for its baked hull's AABB — and both feed the broadphase built over placed cells.

Its junction data is built **lazily on first access** rather than in the constructor. Most candidate nodes are rejected by placement tests and never linked into the graph, so building a junction map for each one was pure waste — roughly 29% of the per-candidate construction cost. The lazy fill needs no locking because a candidate node is owned by a single builder thread for its entire life and is never published to another.

:::note[The voxel field is declared but not filled]

The node also declares a world-space [Cell Voxel Data](../types/cell-voxel-data.md) member, and it is deliberately left **unassigned**. Nothing in placement reads voxel data yet, so the constructor does not pay for [`RotateAroundPivot`](../types/cell-voxel-data.md#rotating-onto-the-shared-lattice) — and leaving the field empty rather than half-populated means a future consumer fails loudly instead of silently testing against an unrotated grid.

:::

`GetHullIntersectDepth` comes in two overloads — against another cell node, or against a raw mesh — both taking an `EarlyExitDepth` threshold so the caller's usual `if (depth >= threshold)` rejection can short-circuit inside the intersection test rather than after it.

## The Factory

```cpp
/** Thin factory that allocates graph nodes with new, keeping ownership semantics explicit. */
class FNAssemblyGraphNodeFactory;
```

Its only job is to make ownership legible. Nodes come from the factory, go to `RegisterNode`, and the graph owns them from that point until it is destroyed.

:::warning

A node allocated by the factory and **not** registered is a leak — the factory allocates with `new` and does not track what it produced. If a candidate is rejected before registration, the builder is responsible for freeing it.

:::

## Expansion Model

The builder uses a **Frontier** model: start at each bone, and repeatedly take an open junction and try to attach a cell to it, until no open junctions remain or the organ's bounds or cell limits are hit.

Because candidates are drawn from a seeded stream, the *order* junctions are consumed in is part of the result — which is why determinism depends on sorted input all the way up at [operation creation](../types/assembly-operation.md#creation).
