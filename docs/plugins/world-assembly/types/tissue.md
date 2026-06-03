---
description: A Junction serves as a sized (XY) connection point between two Cells.
sidebar_class_name: type ue-data-asset
tags: [0.3.0, 0.3.1]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Tissue

<TypeDetails icon="/assets/svg/world-assembly/world-assembly-tissue.svg" iconType="img" base="UDataAsset" type="UNTissue" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NTissue.h" />


:::info[Wikipedia Definition]

An ensemble of similar (or dissimilar in structure but same in origin) cells that together carry out a specific function.

:::


A tissue defines the [Cells](cell.md) which can be used in that specific tissue. If multiple **Tissues** are assigned to an [Organ](organ-volume.md) a combinatory effect will apply where all **tissue** entries will be flattened down into a single list, similarly to how **sub-tissues** work.

## Creating

A `UNTissue` can be created through the common `UDataAsset` creation wizard. 

![Data Asset Wizard](tissue-data-asset-wizard.webp)

Or as an added bonus it can be created through its own direct asset factory from the **Content Browser** context-menu, under `NEXUS > NTissue`.

## Dataset

![Tissue Data](tissue-data.webp)

### Tag Groups

These are collections of tags that correspond to specific described behavior when used. They pull their possible tags from `NEXUS.WorldAssembly.*`. User-created tags should be added under that namespace if you wish for them to show up in the details inspector.

#### `Unique`

Identifying an `FGameplayTag` as part of `Tag Groups > Unique` will create a behavioral contract during the assembly operation of a `UNOrganComponent` that ensures that once a Cell is placed that has that `FGameplayTag` as part of its `Assembly Tags`, no other Cell with that `FGameplayTag` can be used.

> As an example, you may want to have only one **hero** piece appear in a given assembly operation. You could add your `Hero` tag to all the **hero** Cell entries in their `Assembly Tags` and would then also add it to the `Tag Groups > Unique`. 

#### `RequiredAny`

When an `FGameplayTag` is added to `Tag Groups > Required (Any)`, after the generation of the `Cell Graph` during an assembly operation, the graph will be validated to ensure that at least one `UNCell` was used that had this `FGameplayTag` associated to it via `Assembly Tags`. If none were, the graph is regenerated.

#### `BadNeighbors`

When an `FGameplayTag` is part of the `Tag Groups > Bad Neighbors` it prevents any cell in that group from being connected to another of that same group.

#### `Unique` & `RequiredAny` Special Behavior

A common requirement when generating gameplay spaces is ensuring that there is some sort of Boss encounter. This is where combining `Unique` and `RequiredAny` has a compound effect with a little extra magic behind the scenes. In a contrived example, you would have two `UNCell` boss-room entries, both would be set to have a `MinimumCount` and `MaximumCount` of `1`, and would get tagged with some `FGameplayTag` that ends up in `Tag Groups > Unique` and `Tag Groups > Required (Any)`. When it's set up like this, the `MinimumCount` is ignored, as well as the "every" part of `Required` when validating the graph.

### Cells

| Settings | | Default |
| --- | --- | --- |
| Assembly Tags | Tags used to define behavior during the assembly process, pulled from `NEXUS.WorldAssembly.*`. _See [Tagging](../tagging.md#assembly-gameplay-tags)_ | `(Empty)` |
| Added Context Tags | Tags which get accumulated based on `UNCell` usage, and are provided for context post-assembly. Initial `Context Tags` are established by the `FNAssemblyOperationSettings` used. Default settings are also available in the `Project Settings`. Accessible by `INCellInitialized` interface via the `ANCellLevelInstance`. | `(Empty)` |
| Required Context Tags | Tags that must exist in the accumulated `Context Tags` of the assembly operation for this cell to be placable.| `(Empty)` |
| Tag Counter Constriants | Requirements for this cell to be made available for selection. If a `FGameplayTag` is not part of the `TagCounter` a constraint will fail. | `(Empty)` |
| Tag Counter Operations | If a cell is placed the operations will be applied against the `Tag Counters` of the assembly operation. This is only replicated outside of the organ at the end of the pass. If ther resulting numerical value is less then zero, it will be clamped to `0`. | `(Empty)` |
| Minimum Count | ***NOT IMPLEMENTED*** Only used to determine specific-unique case exclusion (_not tag related_). | `-1` |
| Maximum Count | The maximum number of times this cell can be used in the generated `FNAssemblyGraph`. (_-1 no constraint_) | `-1` | 
| Minimum Node Distance | The minimum number of cell links away this cell must be to be used again. | `1` | 
| Minimum Node Depth | The minimum number of nodes away from the start when this can be used. | `0`  |
| Weighting | Relative weight for random selection during generation. | `1`| 
| Cell | A soft-object reference to the `UNCell` asset that will be consumed. | `n/a` | 