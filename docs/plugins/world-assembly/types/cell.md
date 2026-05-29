---
description: A reusable level wrapper that lets World Assembly reason about placement without loading the source map.
sidebar_class_name: type ue-data-asset
---


import TypeDetails from '../../../../src/components/TypeDetails';

# Cell

<TypeDetails icon="/assets/svg/world-assembly/world-assembly-cell-data.svg" iconType="img" base="UDataAsset" type="UNCell" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NCell.h" />

:::info[Wikipedia Definition]

The basic structural and functional unit of all living organisms. It is the smallest unit of life classified as a living thing, acting as the fundamental building block of all tissues and organs

:::

![Editing Convex Hull](cell-edit-hull-vertex.webp)

A cell represents a map's meta-data, allowing it to be placed in a World Assembly operation. It is meant to disconnect the actual `UWorld` (Map) from this data, allowing for generation to occur without having to load any of the actual map data itself until it is actually used (`FNSpawnCellProxiesTask`).

This allows for an extremely efficient World Assembly operation, off of the Game Thread.

## Side-Car Data

Each cell is stored as a side-car asset (`<CellName>_NCell.uasset`) that lives next to the source level. The side-car holds the cached bounds, hull, voxel data, junction set, and a thumbnail snapshot of the level — none of which require the level itself to be loaded for the assembly task graph to schedule work against the cell.

When a thumbnail is captured for the `ANCellActor` in the level editor (via the **Capture Thumbnail** button in [Editor Mode](../editor-mode.md)), it propagates to the side-car automatically so the cell shows the same preview in the content browser as the source level.

The side-car asset's content-browser context menu includes a **Select Level** action button that jumps to the source level in the content browser — handy when triaging a generation result and you need to open the source map for the cell that produced a particular proxy.

## Editing

Cell-level instances spawned at runtime are locked out from editing — the level-instance editing tools refuse to open a generated cell so an in-flight or just-completed assembly result cannot be modified out from underneath the system. Open the source level directly when you need to make changes.
