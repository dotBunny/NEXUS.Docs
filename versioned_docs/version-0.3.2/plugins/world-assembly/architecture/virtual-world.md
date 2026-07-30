---
sidebar_class_name: type native-class
description: The off-thread snapshot of world collision and per-organ state that graph building reads instead of the live world.
---

# Virtual World

The reason generation can run off the game thread. Before any building starts, the pipeline copies everything it needs — world collision, organ topology, bone geometry, cell configuration — into plain structs with **all transforms pre-resolved**. Builder tasks then read those copies and never touch a live `UObject`.

That is the whole design: touch the world once, on the game thread, then go wide.

## Virtual World Context

The snapshot of the target world's collision geometry that graph-builder collision tests run against.

It is populated in **two phases**, which is easy to miss:

| Phase | By | Contents |
| :-- | :-- | :-- |
| Up front, game thread | `FNCreateVirtualWorldTask` | World collision geometry gathered from live actors. |
| Incrementally, between passes | `FNProcessPassTask` | Hulls of cells placed by the pass that just finished. |

The second phase is what makes phased organs compose. A later pass sees earlier passes' cells as collision to avoid, because their hulls were added to this context when those passes completed — see [Tasks](tasks.md#the-off-thread-work).

All transforms are pre-resolved so builder tasks never resolve a component transform themselves.

## Per-Organ State

`FNVirtualOrganContext` is the bundle one `FNOrganGraphBuilderTask` consumes: the cells it may draw from, the bones it expands out of, and the constraints it must satisfy.

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
