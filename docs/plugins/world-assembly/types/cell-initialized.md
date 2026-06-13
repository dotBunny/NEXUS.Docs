---
sidebar_class_name: type ue-interface
description: Interface implemented by actors that need to react when their owning cell has been initialized from a proxy.
tags: [0.3.0, 0.3.1, 0.3.2]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Cell Initialized

<TypeDetails icon="ue-interface" base="interface" type="INCellInitialized" typeExtra=" / UNCellInitialized" headerFile="NexusWorldAssembly/Public/Cell/INCellInitialized.h" />

Implemented by actors placed inside a [Cell](cell.md) level that need to react once their owning cell has been initialized from a proxy. Such actors are discovered during author-time saving and are registered as initialize-callback actors with the `ANCellActor`. When the `ANCellActor` finishes applying data from its proxy, it invokes `OnInitializedFromProxy` on each of them, handing over the spawned `ANCellLevelInstance`. This is the entry point for gameplay actors to read post-assembly context — for example the accumulated [Tissue](tissue.md) Context Tags, or whether the cell ended up on the assembly's [hot path](../tagging.md#nexusworldassemblyflaghotpath) — from the cell.

## What It Is

- **Initialization Hook**: Defines the single callback `ANCellActor` calls into after `InitializeFromProxy` has applied the proxy's data.
- **Post-Assembly Context Bridge**: Hands the implementing actor the `ANCellLevelInstance` so it can pull context produced during assembly.
- **Opt-In Contract**: Only actors implementing the interface are registered as callback targets — actors in the cell that don't implement it are left untouched.

## Callback

```cpp
/**
 * Called once the owning cell has been initialized from its proxy.
 * @param CellLevelInstance The level instance the cell was initialized from, providing post-assembly context.
 */
UFUNCTION(BlueprintNativeEvent, CallInEditor, Category="NEXUS|World Assembly")
void OnInitializedFromProxy(ANCellLevelInstance* CellLevelInstance);
```

:::warning

The callback occurs **before** the [Cell's](cell.md)'s Actors have been **positioned**. Anything involving accessing the placed **World Position** or **World Rotation** of an `AActor` should be done during or after `BeginPlay`.

:::

## Reading Hot Path Membership

The handed-in `ANCellLevelInstance` is also how an implementor learns whether its cell landed on the assembly's [hot path](../tagging.md#nexusworldassemblyflaghotpath) — the route threaded through every `NEXUS.WorldAssembly.Flag.Hotpath`-flagged cell. The level instance exposes `IsHotPath()`, `IsHotPathShortest()`, and `IsHotPathSequential()`, mirrored by the Blueprint-callable `Is HotPath` helpers on the [World Assembly Library](world-assembly-library.md).

```cpp
void AMyCellActor::OnInitializedFromProxy_Implementation(ANCellLevelInstance* CellLevelInstance)
{
    if (IsValid(CellLevelInstance) && CellLevelInstance->IsHotPath())
    {
        // This cell sits on the critical route — light it up, spawn the encounter, etc.
    }
}
```

Use `IsHotPathShortest()` / `IsHotPathSequential()` when you need to distinguish the two variants rather than just "on the path or not".