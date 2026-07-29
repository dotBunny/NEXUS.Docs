---
description: A Junction serves as a sized (XY) connection point between two Cells.
sidebar_class_name: type ue-scene-component
tags: [0.3.0, 0.3.1, 0.3.2]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Junction Component


<TypeDetails icon="/assets/svg/world-assembly/world-assembly-junction-component.svg" iconType="img" base="USceneComponent" type="UNCellJunctionComponent" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NCellJunctionComponent.h" />


:::info[Wikipedia Definition]

Cell junctions are a class of cellular structures consisting of multiprotein complexes that provide contact or adhesion between neighboring cells or between a cell and the extracellular matrix in animals.

:::

A Junction serves as a sized (XY) connection point between two [Cells](cell.md). During the assembly process, Junctions are used to determine if a Cell can be attached based on its own collision data, `Socket Size` and additional constraints.

In [Returnal](https://housemarque.com/games/returnal), when looking at the area map, you can clearly see where its junctions are, and if they have been filled or connected to other areas.

![Returnal Junctions](/assets/images/docs/plugins/world-assembly/types/junction-returnal.webp "Returnal")

## Creating Junctions

A Junction is represented in the world by adding a `UNCellJunctionComponent` to an object in the world. This can be done while in `World Assembly Mode` for a NCell, and selecting the Junction dropdown's **Add Component**.

![Junction Gizmo](/assets/images/docs/plugins/world-assembly/types/junction-add.webp)

A Junction will only persist on a Cell if the level contains a `UNCellRootComponent`. If you add one to a level without a root, the component will log an error and remove itself on the next tick. Each surviving Junction is automatically registered against the owning `ANCellActor` and assigned a stable `InstanceIdentifier`, which is what the side-car data used during generation keys off of.

:::warning[Static Mobility]

A Junction forces its own `Mobility` to **Static**. If you attach one beneath a component or actor that is *not* Static, you get a Static-under-Movable pairing that **errors during cook**.

The component warns about this at author time when it registers, and `UNWorldAssemblyEditorValidator` is the authoritative gate — it also catches a parent whose mobility is changed *after* the junction has registered. Set the owning actor and any intermediate components to Static.

:::

## Component Details

![Junction Component Details](/assets/images/docs/plugins/world-assembly/types/junction-component-details.webp)

### Details

| Setting | Type | Description | Default |
|---|---|---|---|
| Type | `ENCellJunctionType` | Directionality of the junction — `Two-Way`, `In-Only`, `Out-Only`, or `One-Way`. **Not yet enforced during graph traversal**; today it drives the gizmo's [corner-point lines](#corner-points) and the socket bounds emitted by the [PCG nodes](#pcg-integration). | `Two-Way` |
| Requirements | `ENCellJunctionRequirements` | How an unconnected junction is resolved after the graph is linked. `Required` — the junction must connect to another for the graph to be considered valid, and its selection weight is automatically **doubled**; `Allow Blocking` — a junction left unconnected is [filled](#fillers); `Allow Empty` — a junction left unconnected stays unfilled. | `AllowBlocking` | 
| Socket Size | `FIntVector2` | Size of the junction socket in grid units (width, height) | `(2,4)` | 
| Fill Depth Mode | `ENCellJunctionFillDepthMode` | How deep a fill volume is and which way it grows from the socket plane. See [Fill Depth](#fill-depth). | `Default Forward` |
| Override Fill Depth | `float` | Depth in centimetres used by the three `Override*` modes. Only editable when Fill Depth Mode is an `Override*` value. | `10.0` |
| Rotation Constraints | `FNRotationConstraints`| What rotations can be made by this junction to match another. | |
| Weighting | `int32` | Relative weight against other junctions in the cell when the graph builder picks an open junction to extend from. `Required` junctions have this **doubled** automatically. | `1` | 

The following are derived rather than authored, and are shown read-only in the details panel:

| Setting | Type | Description |
|---|---|---|
| World Location | `FVector` | World-space location, kept in sync from the component transform. |
| World Rotation | `FRotator` | World-space rotation, kept in sync from the component transform. |
| Instance Identifier | `int32` | Stable per-cell identifier allocated on registration. This is the key the side-car `UNCell` data and [Link Details](#link-details) reference. |

### Fillers

When a junction is left **unconnected** at the end of generation, World Assembly can spawn a _filler_ actor to cap it — closing the opening with a wall, door, cover piece, or any other actor you author. Each junction carries an array of `FNCellJunctionFillerEntry` candidates; at fill time the owning cell gates them by their constraints, picks one weighted-at-random from the survivors, and spawns it. When no entry qualifies, the project-wide `Junction Default Filler` (see [Project Settings](../project-settings.md)) is used instead.

The spawned actor **must** implement [INCellJunctionFiller](cell-junction-filler.md); it receives an `OnInitializedFromJunction` callback so it can size or configure itself from the junction it fills.

| Setting | Type | Description | Default |
|---|---|---|---|
| Actor | `TSubclassOf<AActor>` | The actor to spawn when this entry is selected. Must implement [INCellJunctionFiller](cell-junction-filler.md). | `(None)` |
| Offset | `FTransform` | Placement offset relative to the junction's frame: the location is rotated by the junction's orientation before being added, the rotation spins the actor in place, and the scale multiplies the actor's own scale. | `Identity` |
| Required Context Tags | `FGameplayTagContainer` | Tags that must be present in the generated cell's `Context Tags` for this entry to be eligible. | `(Empty)` |
| Tag Counter Constraints | `TArray<FNGameplayTagCounterConstraint>` | `Tag Counter` constraints that must **all** pass for this entry to be eligible. A constrained tag absent from the counter compares as `0`. | `(Empty)` |
| Weighting | `int32` | Relative weight for random selection among eligible entries. Higher values are more likely to be chosen. | `1` |
| Skip Additional Actors | `bool` | When this entry wins selection, leave the [Additional Filled Actors](#additional-actors) hidden instead of revealing them. Useful for a filler that already provides its own geometry and would otherwise double up. Additional Connected Actors are still hidden as normal. | `false` |

#### Disable Filling

| Setting | Type | Description | Default |
|---|---|---|---|
| Disable Filling | `bool` | Never fill this junction, regardless of its `Requirements`. Setting this greys out the `Fillers` array and `Spawn Filler Immediately`. | `false` |

A junction with `Disable Filling` set still participates in generation normally and still runs its [Additional Actors](#additional-actors) pass in the *unconnected* direction — it simply never spawns a filler actor. Reach for this when a cell authors its own capping geometry and only wants the connected/unconnected actor toggling.

#### Spawn Filler Immediately

| Setting | Type | Description | Default |
|---|---|---|---|
| Spawn Filler Immediately | `bool` | Bypass filler time-slicing and spawn this junction's filler immediately during `BeginPlay`, rather than spreading the work across frames. | `false` |

Time-slicing of filler spawns is otherwise governed project-wide by `Delayed Junction Spawning` and `Junction Time Slice` (see [Project Settings](../project-settings.md)).

### Additional Actors

Separate from spawning a filler, a junction can toggle actors that **already exist** in the cell based on how it resolved. This is the cheaper option when a cell only needs to swap between an open doorway and a wall it already contains.

| Setting | Type | Description | Default |
|---|---|---|---|
| Additional Filled Actors | `TArray<TObjectPtr<AActor>>` | Actors shown when the junction ends up **unconnected** (filled), and hidden when it connects. | `(Empty)` |
| Additional Connected Actors | `TArray<TObjectPtr<AActor>>` | Actors shown when the junction ends up **connected**, and hidden when it is filled. | `(Empty)` |

Both are `EditInstanceOnly` — assign them on a placed junction inside the cell level, not on a blueprint default.

:::info[What "Shown" Means]

Toggling here is **not** spawning or destroying. Each actor gets `SetActorHiddenInGame` and `SetActorEnableCollision` applied together, so the actors persist in the level either way and simply become visible and collidable, or invisible and non-collidable.

Anything else the actor does — ticking, audio, lights, gameplay logic — keeps running. If an actor needs to fully stand down when its junction resolves the other way, implement [INCellJunctionBeginPlay](cell-junction-begin-play.md) and handle it explicitly.

:::

:::important[Ordering]

The **connected** list is processed *after* the **filled** list. An actor appearing in both ends up in whatever state the connected pass leaves it in — the connected list wins.

:::

### Callbacks

| Setting | Type | Description | Default |
|---|---|---|---|
| OnBeginPlay Targets | `TArray<TObjectPtr<AActor>>` | Actors notified during the junction's `BeginPlay`. Each assigned actor that implements [INCellJunctionBeginPlay](cell-junction-begin-play.md) receives an `OnJunctionBeginPlay` call carrying the junction itself and its resolved [Link Details](#link-details), letting it react to how the junction was wired up during assembly. The field only accepts actors implementing that interface. | `(Empty)` |

Unlike a [Filler](#fillers) — which the junction *spawns* to cap an unconnected opening — a BeginPlay callback target is an actor that already exists in the cell and simply wants to know how its junction resolved.

## Fill Depth

Every junction carries a **fill depth**: how far a fill volume extends along the junction's forward axis, and which side of the socket plane it grows from. It is what gives a filler — or a PCG graph, or a debug draw — a consistent volume to occupy rather than a flat plane.

`Fill Depth Mode` encodes two independent choices in a single enum value.

**Where the depth comes from:**

| Prefix | Depth Source |
|---|---|
| `Default*` | The project-wide `Socket Depth` (see [Project Settings](../project-settings.md)). Change it once, every junction follows. |
| `Override*` | This junction's own `Override Fill Depth`, in centimetres. |

**Which way the volume grows,** relative to the socket plane and the junction's forward direction:

| Suffix | Volume Occupies | Anchor |
|---|---|---|
| `*Forward` | Entirely ahead of the socket plane. | `0` |
| `*Backward` | Entirely behind the socket plane. | `-depth` |
| `*Centered` | Straddles the socket plane, half on each side. | `-depth / 2` |

The **anchor** is the signed distance at which the volume's near edge sits before extruding forward by the full depth. A filler that wants to place itself correctly should offset its own location by that anchor along the junction's forward vector — which is exactly what [Get Junction Fill Depth Offset](world-assembly-library.md#get-junction-fill-depth-offset) returns.

:::tip

Because `Forward` is the default and anchors at `0`, a filler that simply spawns at the junction transform and extrudes forward is already correct for the default mode. You only need the anchor offset once you start using `Backward` or `Centered` — but reading it unconditionally costs nothing and keeps the filler correct for every mode.

:::

## Filling at Runtime

### Order of Operations

When a junction's `BeginPlay` runs, it works through the following in order:

1. If the junction **connected**, its [Additional Actors](#additional-actors) pass runs immediately in the connected direction.
2. Every actor on [OnBeginPlay Targets](#callbacks) is invoked, connected or not.
3. If the junction connected, it stops here.
4. Otherwise `Requirements` decides: `Required` does nothing (a required junction that reached this point failed to satisfy the graph), `Allow Empty` does nothing, and `Allow Blocking` either fills immediately or registers with the [World Assembly Subsystem](world-assembly-subsystem.md) for time-sliced filling.

### Selection Is Deterministic

Filler selection is driven by a Mersenne Twister seeded from the assembly seed, the cell's node identifier, and the junction's instance identifier combined together. The same seed therefore produces the same filler at the same junction on every run and on every machine — fillers do not break seed reproducibility, and a bug reported with a seed is reproducible right down to which wall got picked.

### Filler Lifecycle

Spawned fillers are **transient**. They are created with `RF_Transient`, registered against the cell's operation ticket with the [World Assembly Subsystem](world-assembly-subsystem.md), and destroyed alongside the junction when the cell is destroyed or streamed out. They are never saved into the level.

:::note[Default Filler Latency]

Authored `Fillers` are hard references on the junction, so they are always resident and spawn synchronously.

The project-wide `Junction Default Filler` is a **soft** reference. On the first junction that needs it, it is requested asynchronously and the filler appears once the load lands — potentially a frame or more after `BeginPlay`. If a visible pop matters, author the filler on the junction instead of relying on the project default, or preload the class yourself.

:::

## Link Details

`LinkDetails` is the junction's resolved connection state, written during generation and read-only at runtime. It is the payload handed to [INCellJunctionBeginPlay](cell-junction-begin-play.md), and its `bConnected` flag is what gates whether the junction fills at all.

| Field | Type | Description |
|---|---|---|
| Junction Instance Identifier | `int32` | This junction's own identifier within its cell. |
| Node Identifier | `int32` | The assembly-graph node this junction's cell was placed as. |
| bConnected | `bool` | Whether this junction linked to another junction or bone. |
| Connected Node Identifier | `int32` | The graph node of the cell on the other side; `-1` when unconnected. |
| Connected Junction Instance Identifier | `int32` | The identifier of the junction on the other side; `-1` when unconnected. |
| bHotPathShortest | `bool` | Whether this junction joins two cells that *both* sit on the shortest-path hot path. |
| bHotPathSequential | `bool` | Whether this junction joins two cells that *both* sit on the sequential hot path. |

The two hot-path flags describe the **link**, not the cells — a junction is only flagged when the connection it forms is itself part of the hot path, which is what lets you decorate the route through a level rather than every room adjacent to it. See [Tagging](../tagging.md#nexusworldassemblyflaghotpath) for how the hot path is resolved, and [Is HotPath](world-assembly-library.md#is-hotpath) for the per-cell equivalents.

Alongside `LinkDetails`, two more runtime values are exposed read-only under **Assembly Operation**:

| Field | Type | Description |
|---|---|---|
| Filler Actor | `TWeakObjectPtr<AActor>` | The filler this junction spawned, if any. |
| Level Instance | `TWeakObjectPtr<ALevelInstance>` | The cell level instance this junction streamed in as part of. |

## Gizmo

![Junction Gizmo](/assets/images/docs/plugins/world-assembly/types/junction-gizmo.webp)

The in-editor drawing of the Junction is meant to convey specific information about the settings of the Junction.

### Sizing

The circular nubs are representative of the size and scale of the defined `Socket Size`.

### Directionality

The arrow in the middle indicates the forward direction of the **Junction**.

:::important[Facing Direction]

It is important that the direction of the **Junction** in a Cell always faces inwards.

:::

### Color

When in `World Assembly Mode`, the gizmo color is derived from the penetration depth into the [UNCell](cell.md)'s hull. So long as it remains green the junction is matchable and will not be excluded due to the depth setting (see `Cell Penetration Tolerance` in the [Project Settings](../project-settings.md)). 

<div class="image-split">
![Junction Gizmo w/ Depth](/assets/images/docs/plugins/world-assembly/types/junction-gizmo-distance.webp)
![Junction Gizmo w/ Depth](/assets/images/docs/plugins/world-assembly/types/junction-gizmo-distance-bad.webp)
</div>

:::danger

If it is **RED**, it's dead.

:::

### Corner Points

The corner-point lines indicate the junction's `Type` — `Two-Way`, `In-Only`, `Out-Only`, or `One-Way`.

### Fill Volume

The gizmo also draws the junction's [fill volume](#fill-depth) — the box a filler is expected to occupy, extruded from the socket plane by the resolved fill depth and positioned according to the `Fill Depth Mode`. Switching between `Forward`, `Backward`, and `Centered` moves the box in the viewport immediately, which is the fastest way to confirm a mode is doing what you meant before authoring a filler against it.

Junctions with a fill depth of `0` draw no volume.

## PCG Integration

Junction data is exposed to PCG through two nodes, both under the **NEXUS** category:

| Node | Input | Emits |
|---|---|---|
| `NEXUS \| Get Junction Data` | A param set carrying a `ComponentReference` attribute (soft object paths to junction components). | One point per successfully resolved junction. |
| `NEXUS \| Get All Junction Data` | None. | One point per junction currently registered with the World Assembly registry. |

Both output on a **Junctions** pin, and both emit points in the same shape:

- **Transform** — the junction's world location and rotation.
- **`SocketSize`** *(FVector2D)* — the socket size in grid units, as authored.
- **`WorldSize`** *(FVector2D)* — that socket size scaled by the project's `Socket Size`, so it is already in world units.
- **Bounds** — sized from `WorldSize` and the project's `Socket Depth`, with the depth axis shaped by the junction's `Type`: `Two-Way` straddles the plane, `In-Only` extends behind it, `Out-Only` ahead of it, and `One-Way` stays flat.

Neither node is cacheable, and both execute on the main thread because they walk live components. `Get All Junction Data` additionally tracks each junction's location, rotation, and socket size in its dependency CRC, so moving or resizing a junction in the editor re-runs the graph.

:::note

The bounds these nodes emit are derived from the junction's `Type` and the project-wide `Socket Depth` — they do **not** account for the per-junction [Fill Depth Mode](#fill-depth). For a volume that honours the authored mode, build it from [Get Junction World Size](world-assembly-library.md#get-junction-world-size) and [Get Junction Fill Depth Offset](world-assembly-library.md#get-junction-fill-depth-offset) instead.

:::

## Penetration Matching

There is nothing novel about the idea of stitching a map together from discrete pieces — where `NWorldAssembly` shines is in its ability to overcome hurdles that still show up in games today. By planning for penetration testing from the start it can avoid the gaps commonly associated with stitching. An example of the gaps can be seen in this image from the recent, [SAROS](https://housemarque.com/games/saros).

![SAROS Gap](/assets/images/docs/plugins/world-assembly/types/junction-saros.webp "SAROS")
