---
sidebar_class_name: type native-struct
description: Per-cell assembly metadata recorded on a generated cell, identifying the operation and graph node that produced it.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Assembly Data

<TypeDetails icon="native-struct" base="struct" type="FNCellAssemblyData" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NCellAssemblyData.h" />

The record of *how* a placed cell came to be. Every generated cell carries one, and it is the bridge between a cell sitting in the world and the assembly operation that produced it — the provenance you need when triaging a generation result or reacting to one at runtime.

## Provenance

| Field | Type | Purpose |
| :-- | :-- | :-- |
| `OperationTicket` | `int32` | Ticket of the [operation](assembly-operation.md) that generated this cell. |
| `NodeIdentifier` | `int32` | Identifier of the assembly graph node this cell was generated from. |
| `Seed` | `uint64` | The seed used to generate this cell. |

These three answer "which run, which node, which seed" — enough to reproduce a specific cell's placement or correlate it with the [context cache](world-assembly-library.md) keyed by that same ticket.

## Hot Path

| Field | Meaning |
| :-- | :-- |
| `bHotPathShortest` | The cell lies on the shortest-path hot path (spokes from the start). |
| `bHotPathSequential` | The cell lies on the sequential hot path (nearest-first visiting chain). |

Two independent notions of "the route through the level", so a cell may be on one, both, or neither. See [Tagging](../tagging.md#nexusworldassemblyflaghotpath) for how each is resolved.

:::note

These flags describe the **cell**. The equivalent flags on [Cell Link Details](#junctions) describe a **link** — a junction is only flagged when the connection it forms is itself on the hot path. That distinction is what lets you decorate the route rather than every room adjacent to it.

:::

## Proximity

| Field | Type | Meaning |
| :-- | :-- | :-- |
| `HotPathShortestScore` | `uint8` | Cells between this one and the nearest cell on the shortest-path hot path. |
| `HotPathSequentialScore` | `uint8` | The same, measured against the sequential hot path. |
| `ImportanceScore` | `uint8` | Cells between this one and the nearest cell tagged `NEXUS.WorldAssembly.Flag.Important`. |

Where the flags above answer *whether*, these answer *how far*. A cell that is itself a seed scores `0`, one directly connected to a seed scores `1`, one connected to that scores `2`, and so on outward. So a hot path score of `0` is exactly the corresponding flag being `true`, and the scores turn a binary "on the route or not" into a falloff you can drive decoration, encounter density, or lighting intensity with.

Distance is counted in **cells**, not in graph nodes: Bones and null terminators sit in the graph too, and are stepped through without adding to the count. It is also counted across the whole operation rather than one organ at a time, because the [junction connector](cell-junction-connector.md) pass links cells belonging to different graphs — a cell one connector away from a neighbouring organ's important cell scores `1`, the same as if they shared a wall.

The two hot path variants are scored separately rather than against the union of the flags, because they disagree: wherever the sequential chain takes a shortcut the shortest spokes do not, a cell can sit on one variant and one hop off the other.

:::note

`UnreachableScore` (`255`) means no seed of that kind reaches the cell — which is *every* cell when nothing in the assembly carries the tag in question, mirroring how the flags all stay `false` with no hot path. It doubles as the saturation point: a cell further than 254 away is reported at `255` rather than wrapping. The scores are bytes because they ride replication on every generated cell, and the difference between "very far" and "disconnected" does not survive contact with anything that consumes a proximity falloff.

:::

Read them through [Cell Level Instance](cell-level-instance.md) or the [World Assembly Library](world-assembly-library.md), which widens them to `int32` for Blueprint and adds `Is Near HotPath` / `Is Near Important` predicates over the same values.

## Tag State

| Field | Type | Purpose |
| :-- | :-- | :-- |
| `AssemblyTags` | `FGameplayTagContainer` | Assembly tags applied to this cell during the operation. |
| `ContextTags` | `FGameplayTagContainer` | The **final** context tags for the whole operation. |
| `ContextTagsAdded` | `FGameplayTagContainer` | Only the context tags *this* cell contributed. |
| `TagCounter` | `TArray<`[`FNGameplayTagCount`](../../core/types/collections/gameplay-tag-count.md)`>` | The final tag counter, flattened. |

`ContextTags` versus `ContextTagsAdded` is the useful pair: the first is the operation's end state, shared by every cell; the second is this cell's own contribution. Compare them when you need to know whether a tag arrived because of this cell or was already present.

The counter is stored as a flat array rather than an [`FNGameplayTagCounter`](../../core/types/collections/gameplay-tag-counter.md) so it can ride Blueprint and serialization boundaries.

## Junctions

| Field | Type | Purpose |
| :-- | :-- | :-- |
| `JunctionDetails` | `TArray<FNCellJunctionDetails>` | World-space details for every junction on this cell, captured from the source graph node. |
| `LinkDetails` | `TArray<FNCellLinkDetails>` | Per-junction connection state — what each junction linked to, if anything. |

The two arrays are generated together and describe the same junctions from two angles: `JunctionDetails` is the junction's own geometry and configuration, `LinkDetails` is the outcome of trying to connect it. See [Junction Component](junction-component.md#link-details) for the fields of each.

## Access

Every field is `VisibleInstanceOnly` — this is a generated record, not something you author. The tag and junction fields are additionally `BlueprintReadOnly`, so gameplay can read them; the three provenance fields and both hot-path flags are inspector-only.

At runtime this data reaches gameplay through the [Cell Level Instance](cell-level-instance.md) handed to [Cell Initialized](cell-initialized.md) implementors.
