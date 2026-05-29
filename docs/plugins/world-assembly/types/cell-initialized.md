---
sidebar_class_name: type ue-interface
description: Interface implemented by actors that need to react when their owning cell has been initialized from a proxy.
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Cell Initialized

<TypeDetails icon="ue-interface" base="interface" type="INCellInitialized" typeExtra=" / UNCellInitialized" headerFile="NexusWorldAssembly/Public/Cell/INCellInitialized.h" />

Implemented by actors placed inside a [Cell](cell.md) level that need to react once their owning cell has been initialized from a proxy. Such actors are discovered at runtime and registered as initialize-callback actors; when the `ANCellActor` finishes applying data from its proxy, it invokes `OnInitializedFromProxy` on each of them, handing over the spawned `ANCellLevelInstance`. This is the entry point for gameplay actors to read post-assembly context — for example the accumulated [Tissue](tissue.md) Output Tags — from the cell.

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

As a `BlueprintNativeEvent`, `OnInitializedFromProxy` can be implemented in C++ (override `OnInitializedFromProxy_Implementation`) or in a Blueprint event graph.
