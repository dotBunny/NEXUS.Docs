---
sidebar_class_name: type native-class
description: Static geometry for routing a connector between two unmatched junctions — curve construction, sampling, socket-corner correspondence, and the swept hulls that prove a route clear.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Junction Connector Solver

<TypeDetails icon="native-class" base="class" type="FNJunctionConnectorSolver" typeExtra=" + ENJunctionConnectorRouteResult + FNJunctionConnectorRoute + FNJunctionConnectorFrame" headerFile="NexusWorldAssembly/Public/Assembly/NJunctionConnectorSolver.h" />

The geometry behind [junction connectors](cell-junction-connector.md): curve construction, sampling, socket-corner correspondence, and the swept hulls used to prove a route is clear.

A static, native-only class. Not `UCLASS`, not Blueprint-exposed.

:::important[No UObjects, No Worlds, No Randomness]

The class is deliberately free of all three. The [connector pass](../architecture/tasks.md#junction-connecting) runs on a **worker thread**, and every decision here has to be reproducible for a given input so two runs of the same seed route identically.

**Collision testing is not part of this class.** It produces the hulls; the caller decides what they intersect. That split is what keeps the geometry testable in isolation and keeps the world-touching code on the task.

:::

## Constants

| Constant | Value | Purpose |
|---|---|---|
| `MaximumSampleCount` | `512` | Hard ceiling on samples per curve, so a pathological length/step ratio cannot blow up the sweep cost. |
| `AvoidanceDirectionCount` | `8` | Number of perpendicular directions each avoidance ring pushes a detour midpoint along. |

## Route Results

`ENJunctionConnectorRouteResult` reports why a candidate route was or was not usable. The reasons are distinguished rather than collapsed to a `bool` because they call for **different responses**: a route that is too tight can often be saved by straightening, while one that is already too long cannot — every straighter variant is longer still.

| Value | Meaning |
|---|---|
| `Success` | The route is within every limit and ready for collision testing. |
| `Degenerate` | The two sockets are too close together to define a curve at all. |
| `TooLong` | The center curve or one of the corner curves exceeds `Maximum Spline Length`. |
| `TooTight` | The route turns tighter than `Minimum Turn Radius Scale`, or tightly enough that the connector's geometry would fold through itself. |

## Supporting Structs

### Frame

`FNJunctionConnectorFrame` is one cross-section along a routed path: where it is, which way it heads, and how it is oriented.

| Field | Type | Description |
|---|---|---|
| Location | `FVector` | World-space position of this sample on the center curve. |
| Tangent | `FVector` | Unit direction of travel, start socket toward end socket. |
| Right | `FVector` | Unit socket-width axis, transported from the start junction's own right axis. |
| Up | `FVector` | Unit socket-height axis, derived as `Right × Tangent` so it stays orthogonal without a second transport. |

### Route

`FNJunctionConnectorRoute` is one candidate route: the frames sampled along it, and the path record handed downstream if it survives collision testing.

| Field | Type | Description |
|---|---|---|
| Frames | `TArray<FNJunctionConnectorFrame>` | Frames at each sample of the center curve; parallel to `Path.Center.Points`. |
| Path | `FNCellJunctionConnectorPath` | The [path record](cell-junction-connection.md#path), populated with the center curve, the four corner curves, and the control points. |

## Building a Route

```cpp
static ENJunctionConnectorRouteResult BuildRoute(const FNCellJunctionDetails& Start, const FNCellJunctionDetails& End,
	const FVector2D& SocketUnitSize, const FNWorldAssemblyJunctionConnectorSettings& Settings,
	const FVector* MidPoint, float TangentScale, FNJunctionConnectorRoute& OutRoute);
```

Builds a complete candidate route, including the four corner curves, and checks it against every shape limit. `MidPoint` is an optional detour point the curve is routed through — `null` builds the direct route. `TangentScale` overrides the configured value, which is how a caller retries a too-tight route with a straighter one. `OutRoute` is left in an unspecified state on any result but `Success`.

Length is checked before the corner curves are built where possible, so a route that is obviously too long costs little.

### Curve Construction

```cpp
static void BuildControlPoints(const FNCellJunctionDetails& Start, const FNCellJunctionDetails& End,
	float TangentScale, const FVector* MidPoint, TArray<FVector>& OutControlPoints, TArray<FVector>& OutTangents);

static FVector EvaluateCurve(const TArray<FVector>& ControlPoints, const TArray<FVector>& Tangents, float Alpha);

static float SampleCurve(const TArray<FVector>& ControlPoints, const TArray<FVector>& Tangents,
	float SampleStep, TArray<FVector>& OutPoints);
```

The curve is a **piecewise cubic Hermite**. It leaves the start socket along the direction that junction opens onto and arrives at the end socket travelling *into* the cell that owns it, so a connector welded to both ends meets each socket square on.

`EvaluateCurve` takes `Alpha` in the `0..1` range along the whole curve (clamped), returning `ZeroVector` for malformed input.

`SampleCurve` flattens a curve to a polyline at roughly `SampleStep` spacing and returns the summed length. Resolution is chosen from a **coarse length estimate rather than from the control polygon**, so a curve that bows well outside its control points is not under-sampled. The first and last samples land exactly on the terminal control points.

### Corner Correspondence

```cpp
static TStaticArray<int32, 4> ResolveCornerPairing(const TArray<FVector>& StartCorners,
	const TArray<FVector>& EndCorners, bool bSquareSocket);
```

Chooses which corner of the end socket each corner of the start socket connects to — returning, for each start corner index, the index of the end corner it pairs with.

Only the four mappings that **preserve the rectangle's edges** are considered; a tube joining two rectangles cannot pair corners arbitrarily without folding. On a non-square socket the two that would map a width edge onto a height edge are dropped as well, leaving two. The survivor with the **least total corner travel** wins, so the result is the least-twisted join available.

This is what makes `Path.Corners` safe to index across — see [Center vs Corners](cell-junction-connection.md#center-vs-corners).

## Shape Limits

### Turn Radius

```cpp
static float GetMinimumTurnRadiusScale(const FNJunctionConnectorRoute& Route, const FVector2D& SocketWorldSize);
```

Measures the tightest turn a built route makes, **relative to how much room its own socket needs there**. Returns the smallest radius-to-extent ratio along the route, or `MAX_flt` for a route with no measurable turn.

:::tip[Why a Ratio and Not a World Radius]

What counts as "too tight" depends on **which way the route bends**. A connector's geometry spans the whole socket, so a tall narrow opening tolerates a far sharper turn to the side than it does upward.

Dividing the turn radius by the socket's extent *in the direction of that particular turn* makes one number comparable across every turn plane and every socket size — and puts the point at which the geometry folds through itself at exactly **1**.

With the default 2×4 socket, a sideways turn clears 50cm where the same turn taken vertically clears 100cm. See [Minimum Turn Radius Scale](../project-settings.md#junction-connecting) for how the configured floor reads.

:::

### Folding

```cpp
static bool DoesRouteFold(const FNJunctionConnectorRoute& Route);
```

Returns true when any corner curve **doubles back on the direction of travel** — which is what a connector's inner wall does once the turn is tighter than the socket is wide.

Geometry lofted through such a route self-intersects, so this is a **validity failure rather than a tuning preference**: it is rejected no matter how `Minimum Turn Radius Scale` is configured, including at `0`.

Tested against the generated corner points rather than inferred from curvature, so it reports on the geometry a connector would actually receive.

## Avoidance

```cpp
static void BuildAvoidanceMidPoints(const FVector& Start, const FVector& End,
	float OffsetStep, int32 MaximumAttempts, TArray<FVector>& OutMidPoints);
```

Produces the deterministic detour midpoints to try when the direct route is blocked, ordered **least-deviating first**.

Candidates fan out in rings perpendicular to the straight line between the sockets, so the first accepted detour is the smallest one that clears. **No randomness is involved** — the same pair always produces the same sequence.

## Swept Hulls

Two sweeps, coarse then exact. Both emit one convex prism per path segment via [`FNRawMeshUtils::MakeConvexPrism`](../../core/types/types/raw-mesh-utils.md#make-convex-prism).

```cpp
static void BuildRadiusHulls(const FNJunctionConnectorRoute& Route, float Radius, TArray<FNRawMesh>& OutHulls);

static void BuildCornerHulls(const FNJunctionConnectorRoute& Route, TArray<FNRawMesh>& OutHulls);
```

| | Cross-Section | Role |
|---|---|---|
| `BuildRadiusHulls` | Square, half-extent `Radius`. | The **coarse** clearance volume — cheaper to test than the socket-shaped tube and independent of socket size, so a route plainly buried in geometry is rejected before the exact hulls are built. |
| `BuildCornerHulls` | Spans the four corner curves. | The **exact** volume a connector's geometry occupies. Requires a route carrying four corner curves. |

## Frame Transport

Orientation is carried along the sampled center curve using the **double-reflection rotation-minimizing frame**, which introduces no roll of its own. Whatever roll remains against the required end orientation is then measured and spread evenly along the curve.

The obvious alternative — interpolating the two socket orientations directly — **twists the tube wherever the curve bends**, which is why it is not used.
