---
sidebar_position: 9
description: The project settings for NWorldAssembly.
---

# Project Settings

From the `Edit > Project Settings` window, find the **World Assembly** section.

Backed by `UNWorldAssemblySettings`; from C++, read it with `UNWorldAssemblySettings::Get()`. Because these are project settings, every value here is shared by the whole team and applies to every generated world. The world-collision group is a nested `FNWorldAssemblyWorldCollisionSettings`.

![The World Assembly project settings showing the General, Network and Organ groups](/assets/images/docs/world-assembly/world-assembly-settings.webp)

The panel is taller than one screen, so the remaining groups are captured under their own headings below.

## Configuration Options

### General

| Setting | Description | Default |
| --- | :-- | :-- |
| `Voxel Size` | What is the size to use when generating voxel data around the space of a NCell. This sizing will also be used to calculate some additional meta data as a unit size. It doesn't need to be too tight; just remember the smaller the size, the greater the performance hit. | `(100, 100, 100)` |
| `Socket Size` | What is the unit base size for things like the junctions and bones. | `(50, 50)` |
| `Socket Depth` | The depth per side of a junction that is used for collision detection in some (PCG) scenarios. | `100.f` |
| `Player Size` | What is the size of the player's collider? | `(72.f, 184.f, 72.f)` |

### Network

| Setting | Description | Default |
| --- | :-- | :-- |
| `Mode` | How should `ANCellLevelInstance`s be replicated to clients, either based on relevancy (proximity) or treated as always relevant. | `ReplicatedLevelInstances` |
| `Initial Range` | The range to query for nearby `ANCellLevelInstance`s by `ANWorldAssemblyRelay`, used to determine if the client is considered loaded. Distance is calculated to the world position point of the `ANCellLevelInstance`. | `20000.f` |
| `Support Seamless Travel` | When enabled, the [subsystem](types/world-assembly-subsystem.md) periodically polls for `PlayerController`s and adds relays for them automatically. Leave disabled if you instead call `SpawnRelay(PC)` on the `UNWorldAssemblySubsystem` manually from the GameMode (the recommended path for seamless travel). | `false` |

### Organ

| Setting | Description | Default |
| --- | :-- | :-- |
| `Automatic Bone Direction` | The direction used to calculate the automatic bone placement on the volume. | `Backward` |
| `Automatic Bone Direction Offset` | Offset value applied to the direction provided by the enumeration. | `(0,0,0)` |

### Assembly

![The Assembly group with World Collisions expanded, alongside Junction Matching, Tagging and Spawning](/assets/images/docs/world-assembly/world-assembly-settings-assembly.webp)

| Setting | Description | Default |
| --- | :-- | :-- |
| `Retry Count` | The maximum amount of full attempts at assembling a space before it is considered a complete failure. | `10000` |
| `World Collisions > Actor Ignore Tags` | Additional `FName` tags to query for when ignoring actors from world collision detection. Supplements the [`NWorldCollision_Ignore` markup tag](tagging.md#world-collision-markup-tags). | `(empty)` |
| `World Collisions > Exclude Non-Collision Enabled Actors` | Do not include actors that have their collision turned off when capturing world collision. | `true` |
| `World Collisions > Include Player Starts` | Player start positions should be considered (avoided) when capturing world collision. | `true` |
| `World Collisions > Include Landscapes (EXPERIMENTAL)` | Landscapes are sampled into the world collision representation. See [Terrain Is Opt-In](#terrain-is-opt-in). | `false` |
| `World Collisions > Include Mesh Terrains (EXPERIMENTAL)` | Mesh Terrain sections contribute to the world collision representation. See [Terrain Is Opt-In](#terrain-is-opt-in). | `false` |
| `World Collisions > Landscape Sample Spacing` | How far apart to sample a landscape when reconstructing it as world collision, in centimetres. `0` excludes landscape from world collision entirely. See [Landscape Is Sampled Rather Than Read](#landscape-is-sampled-rather-than-read). | `100.f` |
| `Tagging > Context Tags` | Default `Context Tags` provided to every Assembly Operation. | `(empty)` |
| `Tagging > Starting Counters` | Default `Tag Counters` provided to every Assembly Operation. | `(empty)` |
| `Direction Tolerance` | How close the placement bearing must be to a cell's `Direction Constraint` heading (within this many degrees +/-) for the cell to remain a valid candidate. | `15.f` |
| `Spawning > Cell Time Slice` | Frame-time goal limit when to split spawning cells to the next frame task (in milliseconds). | `1.f` |
| `Spawning > Junction Default Filler` | The default filler to spawn when no authored filler is eligible — a soft (`TSoftClassPtr`) reference to an `AActor` that must implement [`INCellJunctionFiller`](types/cell-junction-filler.md). Resolved lazily so the class is only loaded when actually needed. | `(empty)` |
| `Spawning > Delayed Junction Spawning` | Should time-slicing be used when spawning junction fillers. | `true` |
| `Spawning > Junction Time Slice` | Frame-time goal limit when to split spawning junctions to the next frame task (in milliseconds). | `0.5f` |

#### Terrain Is Opt-In

Both terrain flags default to **off**, and terrain support is early enough to be labelled experimental in the editor. `Landscape Sample Spacing` below is how *finely* a landscape is sampled once `Include Landscapes` has let it in — it is not the switch.

These are also not the only flags involved. The [cell generation settings](types/cell.md#terrain-is-two-flags) carry their own `Include Landscapes` and `Include Mesh Terrains` per calculation, likewise off by default. The two layers answer different questions: the settings here decide whether terrain exists in the **world representation an assembly routes around**, and the cell flags decide whether terrain shapes **the cell being authored**.

The two are enforced at different points, which shows up in the editor:

| | Landscape | Mesh Terrain |
| :-- | :-- | :-- |
| Where the flag is applied | At each gather site, **after** the actor filter — a landscape has to survive that filter for the sampling pass to find it at all. | By the **actor filter** itself. |
| What a refusal means | The actor is still gathered; nothing is sampled from it. | The section is absent from the source actors entirely. |
| Side effects of refusing | None beyond the missing geometry. | The section also stops highlighting in the [editor mode](editor-mode/world.md) and no longer triggers a collision-cache rebuild when edited. |

#### Landscape Is Sampled Rather Than Read

Every other actor contributes its **simple collision** to world collision, read straight off its body setup. A landscape has none — its collision is a Chaos heightfield behind no `UBodySetup` — so the geometry gather emits nothing for it, and an assembly would happily route cells straight through the ground.

`Landscape Sample Spacing` is how that gap is closed: the surface is reconstructed by tracing downward on a grid of that spacing. Smaller reproduces the ground more closely and costs one downward trace per sample, which is why this is the one part of world collision whose cost scales with the size of the level rather than with the number of actors in it. Setting it to `0` leaves landscape out.

This is the only terrain that needs sampling. A Mesh Terrain arrives as ordinary actors with real collision and is read like anything else — what its own `Include Mesh Terrains` flags buy it, here and on the [cell calculations](types/cell.md#terrain-is-two-flags), is a transient exemption rather than a sampling pass.

Terrain *authoring apparatus* — modifiers and helpers describing how a terrain is built — is filtered out of world collision entirely. A modifier's bounds are its region of influence, not a surface, so treating one as an obstacle would have assembly avoiding empty space.

### Junction Matching

Found under `Assembly > Junction Matching`. These govern how the graph builders **mate** two cells directly — socket onto socket, with the cells flush.

| Setting | Description | Default |
| --- | :-- | :-- |
| `Cell Penetration Tolerance` | The maximum depth of penetration a cell's hull can penetrate another to make a junction connection. | `10.f` |
| `World Penetration Tolerance` | The maximum depth of penetration a cell's hull can penetrate world geometry to make a junction connection. | `2.f` |
| `Connect Coincidences` | Mate two unmatched junctions that already sit in the **same place facing opposite ways**, as if the builder had joined them. See [Coincident Mating](#coincident-mating). | `false` |

#### Coincident Mating

The graph builders only ever grow a **new** cell off an open junction. So a graph that loops back on itself — or two organs that grow into each other — can leave two junctions sitting in exactly the same place facing opposite ways with **no link between them**. Both are then capped, walling off what is physically an open doorway.

`Connect Coincidences` picks those up and links them.

- They link as a **plain cell mating**, not a connector pairing. The cells are already flush, so nothing is routed and nothing is spawned.
- It runs **whether or not** the [connector pass](#junction-connecting) is enabled.
- It wires the node-level graph edge too, so hot paths route through.
- It still accepts a junction carrying [`Disable Connecting`](types/junction-component.md#disable-connecting) — that flag turns off routed connector geometry, and a coincident mating produces none.

Reported in analytics as `Inverse Matched` (see [Analytics](architecture/analytics.md)).

### Junction Connecting

![The Junction Connecting group: the default connector and the full connector-settings struct](/assets/images/docs/world-assembly/world-assembly-settings-junction-connecting.webp)

Found under `Assembly > Junction Connecting`. These tune the [connector pass](architecture/tasks.md#junction-connecting), which pairs junctions the graph builders left **unmatched** and proves a collision-free swept path between each pair — so two cells whose openings face each other across clear space are bridged by geometry instead of both being capped off.

| Setting | Description | Default |
| --- | :-- | :-- |
| `Junction Default Connector` | The fallback connector spawned for a paired junction when neither junction nor organ names one — a soft (`TSoftClassPtr`) reference to an `AActor` that must implement [`INCellJunctionConnector`](types/cell-junction-connector.md). | `(empty)` |

Everything below is nested under `Junction Connectors`, an `FNWorldAssemblyJunctionConnectorSettings`. The same struct is mirrored **per-operation** onto `FNAssemblyOperationSettings`, and it is the operation's copy the task graph actually reads — the pass runs on a worker thread and cannot touch the settings object.

| Setting | Description | Default |
| --- | :-- | :-- |
| `Enabled` | When false, the pass is skipped entirely and unmatched junctions are filled as before. | `true` |
| `Maximum Range` | Straight-line distance within which two unmatched junctions are considered a candidate pair. | `5000.f` |
| `Maximum Spline Length` | Upper bound on the arc length of the connecting spline; a pair whose path exceeds this is rejected. | `1000.f` |
| `Maximum Facing Angle` | How far from directly facing each other two junctions may be and still be paired. See [Orientation Gating](#orientation-gating). | `180.f` |
| `Maximum Approach Angle` | How far off its own facing a junction's partner may sit, tested at **both** ends. | `180.f` |
| `Maximum Elevation Difference` | How far two junctions may differ in how steeply they face up or down. | `45.f` |
| `Spline Radius` | Radius of the coarse clearance sweep run along the center spline before the exact socket-corner test. | `200.f` |
| `Sample Step` | Spacing between samples when a spline is flattened to a polyline for length and collision testing. Smaller is more accurate and slower. | `50.f` |
| `Tangent Scale` | Spline tangent magnitude at each socket, as a fraction of the straight-line distance between the two junctions. Larger values leave each socket more perpendicular before curving, at the cost of a longer path. | `0.5f` |
| `Minimum Turn Radius Scale` | Tightest turn a route may make, as a multiple of the socket's half-extent **in the direction of the turn**. See [Turn Radius](#turn-radius). | `2.f` |
| `Maximum Straightening Attempts` | Number of progressively straighter variants tried when a route turns too tightly, before the pair is abandoned. | `4` |
| `Maximum Avoidance Attempts` | Number of detour variants tried when the natural path collides, before the pair is abandoned. | `16` |
| `Avoidance Offset Step` | Distance each successive detour variant pushes its midpoint away from the direct path. | `200.f` |
| `Endpoint Exclusion` | Distance from each socket over which the owning cell's own hull is excluded from collision testing. See [Endpoint Exclusion](#endpoint-exclusion). | `100.f` |
| `Allow Multiple Cell Connections` | When false, two cells may hold at most **one** connection between them. See [One Connection Per Cell Pair](#one-connection-per-cell-pair). | `false` |

Distances are in centimetres; angles in degrees.

#### Orientation Gating

Candidate pairs are gated on how the two openings are **oriented**, not just how far apart they are. By the time the pass runs nothing is being rotated, so what is left to judge is the world-space relationship between two fixed openings.

A pair must clear **all three** angles:

| Angle | Measured Between | Notes |
| --- | :-- | :-- |
| `Maximum Facing Angle` | One socket's outward direction and the other's inward. | `0` is the head-on pairing the graph builder makes itself; `90` is perpendicular; `180` is two sockets opening *away* from one another. |
| `Maximum Approach Angle` | Each socket's outward direction and the straight line to its partner, tested at **both** ends. | Past `90` the partner sits behind the socket plane, so the route would have to leave the opening and double back around its own cell. |
| `Maximum Elevation Difference` | How steeply the two face up or down. | A ceiling hatch is `90`, a floor hatch `-90`, and every wall opening `0` regardless of which way it points. |

:::tip[Why Elevation Difference Carries the Load]

`Maximum Facing Angle` alone cannot separate the two cases you most need separated. A **ceiling hatch joined to a wall door** and a **right-angle corridor bend** are both exactly 90 degrees of facing.

Elevation difference tells them apart: the corridor bend is two wall openings, so its difference is `0`, while the hatch and the wall door differ by the full `90` and are rejected.

That is why facing and approach both default to a loose `180` — the elevation limit does the work. Tightening approach much below `90` also rejects the jog between two parallel corridors, where the partner sits almost side-on despite the two openings facing each other perfectly well.

:::

Evaluated **before any routing**, so the pass gets cheaper rather than more expensive. Rejections are reported as `Rejected (Angle)`.

Individual junctions can replace all three limits with their own via [Connection Constraints](types/cell-junction-connection-constraints.md); both ends are consulted and the stricter wins.

#### Turn Radius

`Minimum Turn Radius Scale` is a **multiple of the socket's half-extent in the direction of the turn**, not a world distance. With the default 2×4 socket, a sideways turn clears 50cm where the same turn taken vertically clears 100cm.

| Value | Reads As |
| --- | :-- |
| `1.0` | Exactly the fold point — below it the connector's inner wall folds through itself. |
| `2.0` | A corridor-width turn. The default. |
| `0` | Disables the floor, leaving only the always-on fold rejection. |

A route whose inner wall folds back through itself **always** fails, regardless of this value, because its own geometry would self-intersect. Above that, this sets a navigability floor.

A route rejected as too tight is retried with progressively longer spline tangents, bounded by `Maximum Straightening Attempts`. Reported as `Rejected (Turn Radius)`, `Rejected (Folded)` and `Straightening Successes`.

:::note[More Than One or Two Straightening Steps Is Worth It]

Longer tangents open a turn up **to a point** and then overshoot into a tighter one again, so the value that works often sits in the middle of the range rather than at its top.

Each step also lengthens the route, so `Maximum Spline Length` is what ultimately bounds the escalation — it stops as soon as a variant blows that budget, since every later one is longer still.

:::

#### Endpoint Exclusion

A socket sits **on** its cell's hull surface, so without an exclusion every path would collide at both endpoints.

`Endpoint Exclusion` is the distance from each socket over which the owning cell's own hull is ignored. Beyond that distance the hull is tested again — which is what rejects a path that curls back into its own cell.

Note the exclusion is limited to the hulls near each socket rather than exempting the two cells outright, precisely so a route cannot tunnel back through its own cell unnoticed.

#### One Connection Per Cell Pair

With `Allow Multiple Cell Connections` off (the default), a candidate pair whose two cells are **already linked** is rejected. Several openings facing each other across two cells then produce **one** connector rather than a bundle.

"Already linked" covers both a doorway the graph builders mated and a connector this same pass accepted earlier. Only a **direct** link between the two cells blocks — cells joined indirectly through others are still free to connect, which is usually the interesting case.

Reported as `Rejected (Existing Connection)`, and counted before any routing is attempted, so these cost nothing beyond the lookup.

### Debug

![The Debug group with its single Proxy Material property](/assets/images/docs/world-assembly/world-assembly-settings-debug.webp)

| Setting | Description | Default |
| --- | :-- | :-- |
| `Proxy Material` | The material to use with the DynamicMeshes as part of `ANCellProxy`. | `M_NCellProxy` |

:::warning Packaging

Assigning a `Junction Default Filler`, a `Junction Default Connector`, or a `Proxy Material` here does **not** guarantee the asset is pulled into a packaged build. Because all three are referenced indirectly, they can be dropped by the cooker — add them to your project's **Additional Asset Directories to Cook** (or otherwise force a hard reference) so they are included.

:::

## See Also

- [Editor Settings](editor-settings.md) — project-shared editor defaults for new cells and the collision visualizer.
- [User Settings](user-settings.md) — per-user, machine-local editor preferences stored outside project config.
