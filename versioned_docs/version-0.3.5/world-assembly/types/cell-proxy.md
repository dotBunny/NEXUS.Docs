---
sidebar_class_name: type ue-actor
description: A lightweight stand-in for a placed cell, showing a preview mesh while the real level streams in behind it.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Proxy

<TypeDetails icon="ue-actor" base="AActor" type="ANCellProxy" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NCellProxy.h" />

The lightweight actor World Assembly spawns for each placed [Cell](cell.md). A proxy is what exists in the world *before* — and while — the cell's actual level streams in: it carries a dynamic preview mesh built from the cell's side-car data, and pairs itself with a [Cell Level Instance](cell-level-instance.md) that loads the real content.

This is the type that makes generation feel instant. The graph can place hundreds of cells and show their shapes immediately, because nothing has had to come off disk yet.

:::note

`ANCellProxy` is `NotPlaceable`, `Hidden`, `HideDropdown`, and **`Transient`** — you cannot place one by hand and it is never saved. Proxies are created by generation and exist only for the lifetime of the world.

:::

## Creation

```cpp
/**
 * Factory for creating a cell proxy for a graph node.
 * @param World World to spawn into.
 * @param CellNode The graph node that sourced this cell (supplies transform and junction data).
 * @param InstanceData Information about the generation of this cell.
 * @param bPreLoadLevel When true, the underlying level asset begins loading immediately.
 */
static ANCellProxy* CreateInstance(UWorld* World, FNAssemblyGraphCellNode* CellNode,
    const FNCellAssemblyData& InstanceData, bool bPreLoadLevel = false);
```

The proxy takes its transform and junction data from the graph node that produced it, and its generation metadata from [Cell Assembly Data](cell-assembly-data.md). `bPreLoadLevel` decides whether streaming begins at once or waits to be asked.

## Properties

| Property | Type | Purpose |
| :-- | :-- | :-- |
| `Mesh` | `UDynamicMeshComponent` | The preview mesh standing in for the level while it streams. |
| `Cell` | `UNCell` | The [cell](cell.md) data asset this proxy represents. |
| `LevelInstance` | `ANCellLevelInstance` | The paired actor carrying the cell's streamed content. |

All are `VisibleAnywhere` — inspect them on a generated proxy, but drive changes through the methods below.

## Level Instance Lifecycle

The proxy owns its paired level instance and exposes each step separately, so a caller can pace streaming rather than taking it all at once:

| Method | Effect |
| :-- | :-- |
| `CreateLevelInstance()` | Spawns the paired [Cell Level Instance](cell-level-instance.md) so content *can* be loaded. |
| `LoadLevelInstance(bBlocking)` | Begins loading the level asset. Pass `true` to block. |
| `UnloadLevelInstance(bTagActorsToIgnore)` | Unloads the level asset **without** destroying the actor. |
| `DestroyLevelInstance(bUnregister, bTagActorsToIgnore)` | Destroys the level instance, asynchronously via the level-streaming subsystem. Optionally removes it from the registry. |

Note the split between *unload* and *destroy*: unloading frees the content but keeps the pairing, so the same proxy can reload it later. Destroying tears the pairing down.

`bTagActorsToIgnore` — also available directly as `TagActorsToIgnore()` — marks every actor owned by the level instance so subsequent operations skip them. That is how a re-run avoids treating content from a previous run as world geometry to collide against.

## Visual Handover

| Method | Effect |
| :-- | :-- |
| `InitializeFromNCell(InCell)` | Configures the proxy from a cell asset — preview mesh, junction details. |
| `Show()` | Reveals the preview mesh and its visualization components. |
| `Hide()` | Hides the preview mesh. |
| `OnProxyMaterialLoaded()` | Applies the proxy material once its async load completes. |

The handover is `Show()` while streaming, `Hide()` once the paired level instance is fully loaded — so the preview disappears exactly as the real content appears. Because the proxy material itself streams in, `OnProxyMaterialLoaded` exists to apply it whenever it arrives rather than blocking on it.
