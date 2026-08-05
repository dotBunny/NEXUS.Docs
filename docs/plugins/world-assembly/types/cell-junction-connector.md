---
sidebar_class_name: type ue-interface
description: Interface implemented by actors that bridge two junctions the connector pass paired across open space.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Junction Connector

<TypeDetails icon="ue-interface" base="interface" type="INCellJunctionConnector" typeExtra=" / UNCellJunctionConnector" headerFile="NexusWorldAssembly/Public/Cell/INCellJunctionConnector.h" />

Implemented by actors that **bridge two junctions** the [connector pass](../architecture/tasks.md#junction-connecting) paired across open space — a corridor, a walkway, a pipe, whatever joins two cells whose openings face each other but do not touch.

Where a [filler](cell-junction-filler.md) caps a *single* opening, a connector spans *two*. That difference drives everything else about it: it is spawned **once per pairing** rather than once per junction, and only **after both cells have streamed in**.

Any actor assigned to a junction's or organ's [Connectors](cell-junction-connector-entry.md) array, or set as the project-wide `Junction Default Connector` (see [Project Settings](../project-settings.md#junction-connecting)), **must** implement this interface — the assignment fields enforce it via `MustImplement`.

## What It Is

- **Bridge Hook**: Defines the single callback the [World Assembly Subsystem](world-assembly-subsystem.md#junction-connectors) calls into once both ends of a pairing are live.
- **Route Carrier**: Hands the implementing actor the [`FNCellJunctionConnectorPath`](cell-junction-connection.md#path) the pass proved clear — the center curve plus the four socket-corner curves bounding it.
- **Opt-In Contract**: Only actors implementing the interface can be selected as connectors; the editor fields will not accept anything else.

## Callback

```cpp
/**
 * Called once both ends of a pairing are live, to build the geometry that joins them.
 * @param StartCellLevelInstance The cell owning the start junction.
 * @param StartJunctionComponent The junction the route leaves from.
 * @param StartJunctionIndex Instance identifier of the start junction.
 * @param EndCellLevelInstance The cell owning the end junction.
 * @param EndJunctionComponent The junction the route arrives at.
 * @param EndJunctionIndex Instance identifier of the end junction.
 * @param Path The route the connector pass proved clear: a center curve plus the four socket-corner curves that
 *        bound it. Geometry lofted through the corner curves is guaranteed to fit the space that was tested.
 * @note Which end is Start is decided by the connector pass, not by proximity or spawn order; it is the same end
 *       whose authored connector overrides won the selection that produced this actor.
 */
UFUNCTION(BlueprintNativeEvent, CallInEditor, Category="NEXUS|World Assembly")
void OnConnectJunctions(
	ANCellLevelInstance* StartCellLevelInstance, UNCellJunctionComponent* StartJunctionComponent,  int32 StartJunctionIndex,
	ANCellLevelInstance* EndCellLevelInstance, UNCellJunctionComponent* EndJunctionComponent,  int32 EndJunctionIndex,
	const FNCellJunctionConnectorPath& Path);
```

:::tip[Loft Through the Corner Curves]

Do not build geometry from the two endpoints and a straight line. The `Path` handed to `OnConnectJunctions` carries the exact volume that was collision-tested:

- **`Path.Corners`** — four [curves](cell-junction-connection.md#curve), one per socket corner, parallel in sample count to `Center` and in a **consistent end-to-end order**. `Corners[k]` starts at the start junction's corner `k` and ends at the end junction's matching corner, so you can build quads straight across the array without solving the correspondence yourself.
- **`Path.Center`** — the center curve, which is what the coarse radius sweep cleared. Useful for spawning props or a spline-follow component along the route.
- **`Path.ControlPoints`** / **`Path.ControlTangents`** — the Hermite definition, if you would rather rebuild the curve on a `USplineComponent` than consume the samples.

Geometry lofted through the corner curves is guaranteed to fit the space that was proven clear. Anything wider is not.

:::

:::note[Which End Is "Start"]

`Start` is **not** decided by proximity or spawn order. The connector pass fixes a deterministic ordering (lower graph index, then node identifier) and labels the ends from it — see [Cell Junction Connection](cell-junction-connection.md#ordering).

That same ordering decides whose authored overrides win, so the actor you are running in was selected from the *start* end's list. If a connector needs to orient itself, work from `StartJunctionComponent` rather than assuming the two ends are interchangeable.

:::

## Selection

At build time the [subsystem](world-assembly-subsystem.md#junction-connectors) walks a priority chain to decide which connector class to spawn: the **start junction's** own `Connectors` list, then the **end junction's**, then the organ that placed the **start** cell, then the organ that placed the **end** cell, and finally the project-wide `Junction Default Connector`.

Within whichever list wins, entries are gated by their context-tag and tag-counter constraints against the owning cell's assembly state, then one is picked weighted-at-random from the survivors — the same selection [fillers](cell-junction-filler.md#selection) use. See [Cell Junction Connector Entry](cell-junction-connector-entry.md) for the authoring surface.

## Lifecycle

A connector cannot be spawned when its pairing is produced. Cells stream in asynchronously, so at that point neither junction component exists — there is nothing to connect to and no way to resolve the junction-level overrides that live on those components.

Instead [`FNSpawnJunctionConnectorsTask`](../architecture/tasks.md#junction-connecting) registers the pairing with the [World Assembly Subsystem](world-assembly-subsystem.md#junction-connectors), and:

1. Each paired junction reports in at its own `BeginPlay`.
2. The **second** endpoint to arrive moves the pairing onto the spawn queue; the first simply waits.
3. The queue is drained time-sliced against `Junction Time Slice` (see [Project Settings](../project-settings.md)).
4. If either cell **streams out**, the connector actor is destroyed but the pairing is kept — so it is **rebuilt** if that cell streams back in.

:::warning[Both Ends Must Be Loaded]

A connector spans two cells that stream independently. Until both are resident, nothing occupies the opening — the junctions are flagged `bConnected` (so neither is capped with a filler) but the bridge itself is absent. See [`bConnector` on Link Details](junction-component.md#link-details).

Author connectors that tolerate appearing a frame or more after their cells, and do not assume a connector exists just because one of its junctions does.

:::
