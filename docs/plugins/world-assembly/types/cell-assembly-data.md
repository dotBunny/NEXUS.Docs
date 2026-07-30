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
