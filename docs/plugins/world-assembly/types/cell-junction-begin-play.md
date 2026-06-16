---
sidebar_class_name: type ue-interface
description: Interface implemented by actors that need to react when a cell junction begins play.
tags: [0.3.2]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Cell Junction Begin Play

<TypeDetails icon="ue-interface" base="interface" type="INCellJunctionBeginPlay" typeExtra=" / UNCellJunctionBeginPlay" headerFile="NexusWorldAssembly/Public/Cell/INCellJunctionBeginPlay.h" />

Implemented by actors that need to react when a [junction](junction-component.md) begins play. Actors assigned to a junction's BeginPlay callback list — the component's `OnBeginPlayCallback` (**Callbacks › BeginPlay** in the details panel) — are notified during the junction component's `BeginPlay`: each assigned actor that implements this interface receives `OnJunctionBeginPlay` with the junction's resolved link details. This lets gameplay actors react to how the junction was wired up during assembly, in particular whether it connected to another cell and which cell and junction it links to.

## What It Is

- **BeginPlay Hook**: Defines the single callback the junction invokes during its own `BeginPlay`, once per registered actor.
- **Connection-State Bridge**: Hands the implementing actor the junction's resolved `FNCellLinkDetails` — whether it connected (`bConnected`) and the connected node and junction identifiers.
- **Opt-In Contract**: Only actors on the junction's BeginPlay callback list that implement the interface are invoked; anything else assigned to the list is ignored. The assignment field enforces this via `AllowedClasses`.

## Callback

```cpp
/**
 * Called during the owning junction's BeginPlay for each actor registered on its BeginPlay callback list.
 * @param CellLinkDetails The junction's resolved connection state, including whether it connected to another cell and the connected node and junction identifiers.
 */
UFUNCTION(BlueprintNativeEvent, CallInEditor, Category="NEXUS|World Assembly")
void OnJunctionBeginPlay(FNCellLinkDetails CellLinkDetails);
```

## Assigning Callbacks

Register an actor for these notifications by adding it to the junction's [**Callbacks › BeginPlay**](junction-component.md#callbacks) list on the [Junction Component](junction-component.md). Unlike the [Cell Junction Filler](cell-junction-filler.md) — which is *spawned* by the junction to cap an unconnected opening — a BeginPlay callback target is an actor that already exists in the cell and simply wants to know how its junction resolved during assembly.
