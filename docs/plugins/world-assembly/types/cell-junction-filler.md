---
sidebar_class_name: type ue-interface
description: Interface implemented by actors that are spawned to fill an unconnected cell junction during World Assembly generation.
tags: [0.3.2]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Cell Junction Filler

<TypeDetails icon="ue-interface" base="interface" type="INCellJunctionFiller" typeExtra=" / UNCellJunctionFiller" headerFile="NexusWorldAssembly/Public/Cell/INCellJunctionFiller.h" />

Implemented by actors that are spawned to **fill** a [junction](junction-component.md) left unconnected at the end of generation. When a junction has no neighbour attached, it selects one of its `Fillers` entries (or the project-wide `Junction Default Filler`) and spawns it to cap the opening. The freshly spawned actor is then handed the junction it fills through `OnInitializedFromJunction`, letting it size or configure itself to match.

Any actor assigned to a junction's [Fillers](junction-component.md#fillers) array, or set as the project-wide `Junction Default Filler` (see [Project Settings](../project-settings.md)), **must** implement this interface — the assignment fields enforce it via `MustImplement`.

## What It Is

- **Fill Hook**: Defines the single callback the junction calls into immediately after spawning the filler actor.
- **Junction Context Bridge**: Hands the implementing actor the owning [`ANCellLevelInstance`](cell.md), the [`UNCellJunctionComponent`](junction-component.md) being filled, and the filled junction's link identifier.
- **Opt-In Contract**: Only actors implementing the interface can be selected as fillers; the editor fields will not accept anything else.

## Callback

```cpp
/**
 * Called on a freshly spawned filler actor immediately after it is placed at a junction, letting it size or
 * configure itself from the junction it fills.
 * @param CellLevelInstance The cell level instance that owns the junction being filled.
 * @param JunctionComponent The junction this actor was spawned to fill.
 * @param JunctionIndex The filled junction's link instance identifier (LinkDetails.JunctionInstanceIdentifier).
 */
UFUNCTION(BlueprintNativeEvent, CallInEditor, Category="NEXUS|World Assembly")
void OnInitializedFromJunction(ANCellLevelInstance* CellLevelInstance, UNCellJunctionComponent* JunctionComponent, int32 JunctionIndex);
```

## Selection

At fill time the owning cell filters the junction's `Fillers` down to the entries whose `Required Context Tags` and `Tag Counter Constraints` are satisfied by the cell's final assembly state, then picks one **weighted-at-random** from the survivors. If every entry is gated out, the project-wide `Junction Default Filler` is used as the fallback. See [Junction Component → Fillers](junction-component.md#fillers) for the authoring surface.
