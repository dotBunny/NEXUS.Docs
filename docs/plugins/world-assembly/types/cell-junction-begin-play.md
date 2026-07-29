---
sidebar_class_name: type ue-interface
description: Interface implemented by actors that need to react when a cell junction begins play.
tags: [0.3.2]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Cell Junction Begin Play

<TypeDetails icon="ue-interface" base="interface" type="INCellJunctionBeginPlay" typeExtra=" / UNCellJunctionBeginPlay" headerFile="NexusWorldAssembly/Public/Cell/INCellJunctionBeginPlay.h" />

Implemented by actors that need to react when a [junction](junction-component.md) begins play. Actors assigned to a junction's `OnBeginPlayTargets` list (**Cell Junction › OnBeginPlay Targets** in the details panel) are notified during the junction component's `BeginPlay`: each assigned actor that implements this interface receives `OnJunctionBeginPlay` with the calling junction and its resolved link details. This lets gameplay actors react to how the junction was wired up during assembly, in particular whether it connected to another cell and which cell and junction it links to.

## What It Is

- **BeginPlay Hook**: Defines the single callback the junction invokes during its own `BeginPlay`, once per registered actor.
- **Connection-State Bridge**: Hands the implementing actor the calling junction plus its resolved [`FNCellLinkDetails`](junction-component.md#link-details) — whether it connected (`bConnected`), the connected node and junction identifiers, and the two hot-path flags.
- **Opt-In Contract**: Only actors on the junction's target list that implement the interface are invoked; anything else assigned to the list is ignored and logs a warning. The assignment field enforces this via `AllowedClasses`.

## Callback

```cpp
/**
 * Called during the owning junction's BeginPlay for each actor registered on its BeginPlay callback list.
 * @param Junction The cell junction component that is making the call.
 * @param CellLinkDetails The junction's resolved connection state, including whether it connected to another cell and the connected node and junction identifiers.
 */
UFUNCTION(BlueprintNativeEvent, CallInEditor, Category="NEXUS|World Assembly")
void OnJunctionBeginPlay(UNCellJunctionComponent* Junction, FNCellLinkDetails CellLinkDetails);
```

The `Junction` parameter means a single actor can serve as the target of several junctions and still tell them apart — useful for a cell-wide controller that reacts to how every one of its openings resolved.

## When It Fires

The callback runs for **every** junction, connected or not, and fires *before* any filling happens. See [Order of Operations](junction-component.md#order-of-operations) for exactly where it sits relative to the [Additional Actors](junction-component.md#additional-actors) pass and filler spawning.

Because it precedes filling, this is the right place to influence what a junction is about to do — and the wrong place to inspect a spawned filler, which does not exist yet.

## Assigning Callbacks

Register an actor for these notifications by adding it to the junction's [**OnBeginPlay Targets**](junction-component.md#callbacks) list on the [Junction Component](junction-component.md). Unlike the [Cell Junction Filler](cell-junction-filler.md) — which is *spawned* by the junction to cap an unconnected opening — a BeginPlay callback target is an actor that already exists in the cell and simply wants to know how its junction resolved during assembly.

For the simpler case of just showing or hiding existing actors based on connection state, the junction's [Additional Actors](junction-component.md#additional-actors) lists do that declaratively without any code.
