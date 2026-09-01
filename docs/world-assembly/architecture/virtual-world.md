---
sidebar_class_name: type native-class
description: The off-thread snapshot of world collision and per-organ state that graph building reads instead of the live world.
---

# Virtual World

The reason generation can run off the game thread. Before any building starts, the pipeline copies everything it needs — world collision, organ topology, bone geometry, cell configuration — into plain structs with **all transforms pre-resolved**. Builder tasks then read those copies and never touch a live `UObject`.

That is the whole design: touch the world once, on the game thread, then go wide.

## Virtual World Context

The snapshot of the target world's collision geometry that graph-builder collision tests run against.

It is populated in **three phases**, which is easy to miss:

| Phase | By | Contents |
| :-- | :-- | :-- |
| Up front, game thread | `FNCreateVirtualWorldTask` | World collision geometry gathered from live actors, [filtered as it is gathered](tasks.md#why-the-game-thread-jobs-are-pinned). |
| Incrementally, between passes | `FNProcessPassTask` | Hulls of cells placed by the pass that just finished. |
| Once, after every pass | `FNConnectJunctionsTask` | Swept volumes of each [junction connector](tasks.md#junction-connecting) it accepts. |

The second phase is what makes phased organs compose. A later pass sees earlier passes' cells as collision to avoid, because their hulls were added to this context when those passes completed — see [Tasks](tasks.md#the-off-thread-work).

All transforms are pre-resolved so builder tasks never resolve a component transform themselves.

### Three Collision Domains

Those three phases stay in **three separate arrays** rather than being appended into one, and the reason is entirely about who may touch what, and when:

| Domain | Grows | Indexed by |
| :-- | :-- | :-- |
| `WorldCollisionMeshes` | Never, after `FNProcessVirtualWorldTask` bakes it | One BVH, built once and then immutable. |
| `NodeCollisionMeshes` | Between passes | Parallel to `NodeIndex`; each builder snapshots a **prefix** and indexes that. |
| `ConnectorCollisionMeshes` | During the connector pass | A BVH over a prefix, with the tail scanned linearly. |

**World collision is immutable**, which is what lets every organ builder in every pass share one tree without synchronisation. Appending placed cells to it would mean rebuilding that tree mid-run, and every builder would need to be told about it.

**Node collision is parallel to `NodeIndex`**, so a connector — which has no cell node — cannot live there without breaking the pairing that lets a collision hit resolve back to the cell it belongs to.

**Connector volumes arrive one pairing at a time while the same array is being queried.** Rebuilding the tree per acceptance would be quadratic, so it covers a prefix and the remainder is scanned, rebuilt once the unindexed tail passes 64 entries. The [organ graph](organ-graph.md#the-cell-node-index) indexes its cell nodes the same way, for the same reason.

:::note[The meshes a broadphase cannot help with]

A mesh whose bounds are invalid cannot be rejected by an AABB test, so the intersection routine skips its bounds check entirely for that pair. Those indices are tracked separately — `UnboundedWorldCollisionIndices` — and tested against **every** candidate, which keeps the indexed path exactly equivalent to the linear scan it replaced.

The array is empty for well-formed input. A non-empty one is a data problem, and it costs a full scan per candidate placement.

:::

## Per-Organ State

`FNVirtualOrganContext` is the bundle one `FNOrganGraphBuilderTask` consumes: the cells it may draw from, the bones it expands out of, and the constraints it must satisfy.

It also carries this organ's **view of the placed-cell collision** — how many entries of the shared `NodeCollisionMeshes` its build may consider, snapshotted when the task starts, and the broadphase over exactly that prefix. The two live side by side deliberately: they must describe the same set, and separating them invites one to be updated without the other. Because a builder only ever reads its snapshot's prefix, the shared array can keep growing behind it without any locking.

Two tolerances sit here rather than in settings, because they are per-organ: `CellHullPenetration`, how far two cell hulls may overlap before they count as colliding, and `WorldHullPenetration`, the same allowance against world geometry. The world figure is the tighter of the two by default — cells are authored to interlock with each other, not with the level.

Its `FilterCellInputData` query is the hot path of generation — it narrows the tissue pool to candidates that could legally sit at a given junction. The query bundle carries the **real node depth** of the node being stepped away from, where a bone is `0`, the start cell is `1`, and each hop adds one. That numbering is what [`Minimum Node Depth`](../types/tissue.md#cells) and `Maximum Node Depth` are expressed against.

## Derived State

Two structs are computed once during the operation context's `LockAndPreprocess` and then read many times:

| Struct | Holds |
| :-- | :-- |
| `FNWorldOrganData` | Topological relationships between organs (which intersect, which contain which), the bones falling inside each organ, and the graph-builder **retry budget**. |
| `FNWorldBoneData` | The bone component plus its computed world-space corner points, so downstream stages do not recompute them per access. |

The organ topology is what produces the generation *ordering* — organs that contain or intersect one another cannot build in parallel, while independent ones can. The retry budget lives here because a graph that fails validation re-rolls, and something has to bound how often.

## Cell Data

| Struct | Purpose |
| :-- | :-- |
| `FNVirtualCellData` | A cell's input configuration for generation. |
| `FNVirtualCellDataSummary` | A lightweight summary of a cell's tagging, used to classify starter/finisher eligibility. |
| `FNVirtualBoneData` | A bone's spatial data, copied so it can be consumed **without touching the live `UNBoneComponent`**. |

The summary exists so the common classification question — can this cell start a graph, can it finish one — is answered from a small struct rather than by re-reading the full tag containers.

:::note[Why copies rather than pointers]

Every struct here is a copy taken on the game thread, not a reference to a live component. A builder task running on a worker cannot safely read a `UNBoneComponent` or query an actor's collision, and the [Registry](../types/world-assembly-registry.md) it would have to go through is game-thread only. Copying up front is what removes that constraint from the entire build.

:::
