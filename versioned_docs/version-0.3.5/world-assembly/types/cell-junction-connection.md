---
sidebar_class_name: type native-struct
description: One accepted junction pairing recorded by the connector pass, and the cleared route — center curve plus four socket-corner curves — handed to the connector that bridges it.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Junction Connection

<TypeDetails icon="native-struct" base="struct" type="FNCellJunctionConnection" typeExtra=" + FNCellJunctionConnectorPath + FNCellJunctionConnectorCurve" headerFile="NexusWorldAssembly/Public/Cell/NCellJunctionConnection.h" />

Three structs covering one idea: a pairing the [connector pass](../architecture/tasks.md#junction-connecting) accepted, and the route it proved clear between the two openings.

- **`FNCellJunctionConnection`** — the pairing itself, as recorded for the spawn stage to act on.
- **`FNCellJunctionConnectorPath`** — the cleared route, and the payload handed to [`INCellJunctionConnector::OnConnectJunctions`](cell-junction-connector.md#callback).
- **`FNCellJunctionConnectorCurve`** — a single routed curve, flattened to a polyline.

All three are `BlueprintType` and every field is read-only — they are generation output, not authoring surface.

## Connection

One accepted junction pairing, recorded by the matching pass so the spawn stage can act on it.

| Field | Type | Description |
|---|---|---|
| Connector Identifier | `int32` | Operation-unique identifier for this pairing, carried on **both** ends' [Link Details](junction-component.md#link-details). Defaults to `-1`. |
| Operation Ticket | `int32` | Ticket of the assembly operation that produced this pairing. |
| Start Node Identifier | `int32` | Graph node identifier of the start cell. Only unique **within that cell's own graph** — see [Ordering](#ordering). |
| Start Junction Instance Identifier | `int32` | Instance identifier of the start junction, as carried on its `FNCellJunctionDetails`. |
| Start Organ Identifier | `FGuid` | Identifier of the organ whose graph placed the start cell, used to resolve that organ's connector overrides. |
| Start Transform | `FTransform` | World-space frame of the start socket the path was solved against. |
| End Node Identifier | `int32` | Graph node identifier of the end cell. Only unique within that cell's own graph. |
| End Junction Instance Identifier | `int32` | Instance identifier of the end junction. |
| End Organ Identifier | `FGuid` | Identifier of the organ whose graph placed the end cell. |
| End Transform | `FTransform` | World-space frame of the end socket. |
| Path | `FNCellJunctionConnectorPath` | The [cleared route](#path) between the two sockets. |

### Ordering

The two ends are labelled **Start** and **End** by a deterministic ordering the matching pass fixes: **lower graph index first, then node identifier**. Nothing about proximity or spawn order comes into it.

That ordering is what makes *"the lowest cell node wins"* well defined when resolving which end's authored connector override takes priority — node identifiers are only unique within a single graph, so ordering on them alone would be ambiguous across graphs.

:::important[The Identifier Is the Runtime Key]

`ConnectorIdentifier` — **not** the node identifiers — is what rejoins the two ends of a pairing at runtime.

It is stamped into both junctions' [`FNCellLinkDetails`](junction-component.md#link-details), which **replicates with the cell**. Node identifiers restart per assembly graph, and a connector pairing can span graphs, so they cannot serve as the key. The [subsystem](world-assembly-subsystem.md#junction-connectors) keys its pending-pairing map on the connector identifier for exactly this reason.

:::

## Path

The full cached route between two paired junctions: a center curve plus the four socket-corner curves that bound the swept tube around it.

| Field | Type | Description |
|---|---|---|
| Control Points | `TArray<FVector>` | Control points of the center curve, in world space. The first and last sit at the two socket centers. |
| Control Tangents | `TArray<FVector>` | Hermite tangent at each entry of `ControlPoints`, letting a consumer rebuild the exact curve on a `USplineComponent`. |
| Center | `FNCellJunctionConnectorCurve` | The [center curve](#curve), sampled. |
| Corners | `TArray<FNCellJunctionConnectorCurve>` | The four socket-corner curves, parallel in sample count to `Center` and in the **start junction's** corner order. |
| Sample Step | `float` | Spacing the curves were sampled at, so a consumer can reason about the resolution it is handed. |

`IsValid()` returns true once the path holds a sampled center curve (more than one point) **and** exactly four corner curves.

### Center vs Corners

The two serve different purposes, and the distinction matters when building geometry:

| Curve | What Cleared It | Use It For |
|---|---|---|
| `Center` | The **coarse** radius sweep — square prisms of half-extent `Spline Radius` along the path. | Spawning props along the route, driving a spline-follow component, or a cheap debug read. |
| `Corners` | The **precise** pass — the exact volume a connector's geometry may occupy. | Lofting the actual bridging geometry. |

**Corner ordering is consistent end to end.** `Corners[k]` starts at the start junction's corner `k` and ends at the end junction's matching corner, so a consumer can build quads directly across the array without solving the correspondence itself. That correspondence is chosen by [`FNJunctionConnectorSolver::ResolveCornerPairing`](junction-connector-solver.md#corner-correspondence) to be the least-twisted join available.

## Curve

A single routed curve, flattened to the polyline the connector pass actually validated.

| Field | Type | Description |
|---|---|---|
| Points | `TArray<FVector>` | World-space samples along the curve, **start socket first**. |
| Length | `float` | Summed length of the sampled polyline, in world units. |

:::note[Why Samples, Not a Curve Definition]

The curves are stored **sampled** rather than as a curve definition because that is what was swept for collisions. A consumer that re-derived the curve at a different resolution would not be looking at the geometry that was proven clear.

The center curve does additionally keep its Hermite definition (`ControlPoints` + `ControlTangents`) so it *can* be re-evaluated — [Draw Junction Connector Path](world-assembly-library.md#draw-junction-connector-path) uses it to smooth the drawn line. It only ever subdivides at a whole multiple of the stored step, so the smoothed line still passes through every tested point.

The corner curves have no such definition — they are generated by sweeping a frame along the center — so they keep their sampled resolution permanently.

:::

## Where They Come From

Pairings are produced on a worker thread by [`FNConnectJunctionsTask`](../architecture/tasks.md#junction-connecting) and consumed in two places:

- At runtime, [`FNSpawnJunctionConnectorsTask`](../architecture/tasks.md#junction-connecting) hands each one to the [World Assembly Subsystem](world-assembly-subsystem.md#junction-connectors), which builds the connector once both cells are live and passes the `Path` through `OnConnectJunctions`.
- In the editor, `UNWorldAssemblyEditorSubsystem` retains each completed operation's pairings so the [editor mode](../editor-mode/index.mdx) can draw the routes — which works even in the default proxy-only preview, where no junction components exist at all.

:::note[Editor Previews Register Nothing]

`FNSpawnJunctionConnectorsTask` skips subsystem registration when the operation creates no level instances, which is the editor default. The routes live on the task-graph context, which is destroyed with the operation — so the editor subsystem copies them out before teardown. That retained copy is editor-side only.

:::
