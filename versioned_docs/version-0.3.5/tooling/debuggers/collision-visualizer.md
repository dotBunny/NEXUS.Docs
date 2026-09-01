---
description: A tool used to quickly test world traces and their responses.
---

# Collision Visualizer

Opened by going to `Tools > Debug > Collision Visualizer`, this window can be used to quickly test world traces and their responses. Functioning in and out of PIE, as well as in SIE to draw the outcome of the defined trace.

![Collision Visualizer](/assets/images/docs/tooling/debuggers/collision-visualizer-demo.webp)

:::info

After watching George Prosser's UnrealFest 2023 talk [Collision Data in UE5](https://www.youtube.com/watch?v=xIQI6nXFygA) we set about creating our interpretation of the tool with a different method of integration. We later found out about the publicly available [UECollisionQueryTools](https://github.com/StudioGobo/UECollisionQueryTools) repository. Credits to George and the team at Studio Gobo for the great inspiration for this tool.

:::

## How It Is Put Together

Five types, worth knowing if you extend the tool:

| Type | Role |
| :-- | :-- |
| `UNCollisionVisualizerWidget` | The dockable window and its settings inspector. |
| `ANCollisionVisualizerActor` | A transient editor actor carrying the query's start/end handles so they are draggable in the viewport. |
| `UNCollisionVisualizerSceneComponent` | The component that actually draws the query and its results. |
| `FNCollisionVisualizerUtils` | Issues the configured query against the world and returns its hits. |
| `FNCollisionVisualizerSettings` | The persisted settings bundle, grouping the four structs documented below. |

The viewport actor is why the handles can be dragged: the tool does not draw a gizmo of its own, it places a real actor and lets the editor's existing transform tooling move it.

## Configuration

![Collision Viz Window](/assets/images/docs/tooling/debuggers/collision-visualizer-window.webp)

The configuration is persistent and copy-pastable for sharing (right-click on Settings).

:::tip

You can move both points and rotate the start point in the inspector or in the viewport; they will be synchronized.

:::

Settings are grouped into four structs, matching the four sections in the window.

### Points

`FNCollisionVisualizerPoints`

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Start Point` | `FVector` | The **absolute** world location the query starts from. | `(0, 0, 0)` |
| `End Point` | `FVector` | The location to query towards, **relative to `Start Point`**. | `(500, 0, 0)` |
| `Rotation` | `FRotator` | World-space rotation applied to the query shape. | `(0, 0, 0)` |

:::warning[Start is absolute, End is relative]

`Start Point` is a world location; `End Point` is an offset from it. Dragging the start handle therefore carries the end along with it, which is usually what you want — but it means typing the same numbers into both fields does *not* produce a zero-length query.

:::

### Query

`FNCollisionVisualizerQuery` — what to trace for. Several fields are hidden unless the fields they depend on select them.

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Method` | `ENCollisionVisualizerMethod` | The kind of query — `Line Trace`, `Sweep`, or `Overlap`. | `Line Trace` |
| `Type` | `ENCollisionVisualizerPrefix` | `Single`, `Multi`, or `Test` (boolean). Hidden when `Method` is `Overlap`. | `Single` |
| `Blocking` | `ENCollisionVisualizerOverlapBlocking` | Which overlap responses count as hits — `Blocking`, `Any`, or `Multi`. Only shown when `Method` is `Overlap`. | `Any` |
| `By` | `ENCollisionVisualizerBy` | How collision is filtered — by `Channel`, `ObjectType`, or `Profile`. | `Channel` |
| `Channel` | `ECollisionChannel` | Trace channel. Only shown when `By` is `Channel`. | `ECC_Pawn` |
| `Object Type` | `EObjectTypeQuery` | Object type. Only shown when `By` is `ObjectType`. | `ObjectTypeQuery1` |
| `Collision Profile` | `FName` | Profile name, picked from every profile registered with the engine. Only shown when `By` is `Profile`. | `BlockAll` |
| `Collision Responses` | `FCollisionResponseContainer` | Per-channel responses. Only shown when `By` is `Channel`. | engine defaults |
| `Shape` | `ENCollisionVisualizerShape` | `Box`, `Capsule`, or `Sphere`. Hidden for `Line Trace`, which has no shape. | `Capsule` |
| `Radius` *(capsule)* | `float` | Capsule radius. Shown for a capsule shape. | `40.0` |
| `Half Height` | `float` | Capsule half-height. Shown for a capsule shape. | `80.0` |
| `Half Extent` | `FVector` | Box half-extents. Shown for a box shape. | `(25, 25, 25)` |
| `Radius` *(sphere)* | `float` | Sphere radius. Shown for a sphere shape. | `42.0` |

Note there are **two** `Radius` fields — one on the capsule and one on the sphere. Only the one matching the current `Shape` is visible, so they never appear together, but they hold separate values: switching shape back and forth does not carry a radius across.

### Options

`FNCollisionVisualizerOptions` — the secondary `FCollisionQueryParams` toggles.

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Trace Complex` | `bool` | Trace against complex (per-poly) collision instead of simple. | `false` |
| `Find Initial Overlaps` | `bool` | Report overlaps already present at the sweep's start location. | `true` |
| `Ignore Blocks` | `bool` | Exclude blocking hits from the results. | `false` |
| `Ignore Touches` | `bool` | Exclude touch/overlap hits from the results. | `false` |
| `Skip Narrow Phase` | `bool` | Return broad-phase results only. | `false` |
| `Mobility Type` | `ENCollisionVisualizerMobility` | Restrict results to `Any`, `Static`, or `Dynamic` actors. | `Any` |

`Skip Narrow Phase` is the one to reach for when a query returns nothing and you want to know whether the broad phase saw the geometry at all — broad-phase results are conservative, so a hit here with nothing after it points at the narrow phase.

### Drawing

`FNCollisionVisualizerDrawing` — how the result is rendered.

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Draw Mode` | bitmask | Which editor contexts to draw in — **Editor**, **PIE**, **SIE**. All three are on by default. | Editor + PIE + SIE |
| `Line Thickness` | `float` | Thickness of the drawn query lines. | `1.5` |
| `Point Size` | `float` | Size of the drawn impact points. | `15.0` |
| `Draw Timer` | `float` | Seconds between successive queries and draws. **`0` re-queries every tick.** | `0.0` |
| `Hit Color` | `FColor` | Blocking hits — the line up to the impact, plus the impact points. | `#00FF58` |
| `Mid Color` | `FColor` | Non-blocking touches and overlaps. | `#0000C8` |
| `Miss Color` | `FColor` | Queries that hit nothing. | `#FF0000` |

The three colors encode a query's outcome at a glance: green stopped on something solid, blue passed through something, red found nothing.

:::tip[Raise `Draw Timer` on a heavy query]

At the default `0` the query re-runs every tick. That is fine for a line trace, but a `Multi` sweep with complex collision against dense geometry is real work happening every frame in the editor. Setting `Draw Timer` to something like `0.1` keeps the visualization responsive while cutting the query rate an order of magnitude.

:::
