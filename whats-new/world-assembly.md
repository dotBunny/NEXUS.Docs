---
description: A highlight reel for the World Assembly plugin and it's additions over time.
---

# World Assembly

## 0.4.0

This round is mostly about **trust**: knowing when the collision cache is lying to you, knowing whether a generation
actually worked, and making "ready" mean ready. There's a pile of multiplayer fixes, and you can finally see a
generated cell's junction dressing without pressing Play.

:::warning Expect things to change on upgrade

- **Every world collision cache reads as stale once** and re-bakes on the next save. Nothing to do; the first save per
  level just works harder.
- **`Is Ready?` returns true later** on a listen server or standalone game. It now waits for the cells to actually load.
- **Some junction dressing may disappear.** `Additional Connected Actors` on junctions that never connected used to be
  left visible by accident. They are now hidden, as authored.

:::

### Know When Your Cache Is Stale

The [World Collision](/docs/dev/world-assembly/world-collision) cache from 0.3.5 was quick, but it was quiet about being
out of date. Now it shows it everywhere you look:

- the World rail's `Cache World Collision` button wears a **warning badge** while the level needs a bake,
- the collision visualizer gets an orange **stale wireframe**,
- bones switch to an `Unverified` grey instead of claiming a penetration check nobody ran.

The notification that used to pop up every ten seconds, whether or not you were doing anything, now appears **once**
and is dismissed by a bake.

The cache actor also got a proper details panel: status, a visualizer toggle, and a `Bake World Collision` button, all
one Outliner click away without opening the edit mode. The visualizer itself moved out of the edit mode, so it can
be created from there too.

### Tag A Component, Not The Whole Actor

PCG writes its entire output onto one container actor, so tagging that actor out of world collision took everything
with it. `NWorldCollision_Ignore`, and the cell markup tags `NCell_Ignore`, `NCell_HullIgnore`, `NCell_BoundsIgnore`
and `NCell_VoxelIgnore`, now work on **individual components** too. Tag the spawner's components and keep exactly the
collision you want. Both rails' tag buttons act on selected components. The fingerprint records *whether* each
component is excluded rather than the tags themselves, so PCG re-stamping its components on every generate no longer
invalidates the cache forever. See [Tagging](/docs/dev/world-assembly/tagging).

### Did It Work?

`Get Operation Progress` gives you `0..1` for the operations in flight, and `GetFailedOperationResult` reports an
operation that finished with a required organ left unsatisfied. **Both work on clients**, because the server now sends
throttled progress and each operation's result through the relay. Before this, a loading screen could not tell a
failed generation from a successful one. See the
[subsystem](/docs/dev/world-assembly/types/world-assembly-subsystem#did-it-fail).

### Ready Means Ready

A listen server or standalone game used to call itself ready once no operation was running. But operations finish
when their cells are **spawned**, not **loaded**. Hosts with a local player now wait on their own relay, exactly as a
client does. Clients got two fixes of their own: a relay no longer reads as ready during the round trip after it asks
for nearby cells, and a junction whose cell data hasn't replicated yet [waits for
it](/docs/dev/world-assembly/types/junction-component#waiting-for-replicated-data) instead of hiding its connected
actors and spawning a filler into a doorway another cell is about to use.

### See The Dressing In The Editor

A junction's `Additional Filled Actors` and `Additional Connected Actors` are now applied at author time, so a cell
generated in the editor looks the way it will in game. The lists are also applied for **every** junction however it
resolved, not just the ones that connected, and `Skip Additional Actors` only takes effect once its filler has really
spawned.

### Smaller Things

- **Clear Generated Proxies** on the Quick Assembly toolbar undoes a run without opening the edit mode.
- `Level Script` joins the organ `Generation Trigger` options. It is reserved for now and behaves like `On Demand`.
- Saving a cell level no longer leaves an empty world-collision cache actor in it.

## 0.3.5

Two headliners this round. **World Collision Cache** stops World Assembly re-deriving the level's collision on every
single assembly — it bakes once, stores it in the level, and reads it back. And **Junction Connectors** finally do
something useful with the doorways a layout leaves dangling: instead of capping them off, matching pairs get routed to
each other and joined with real geometry.

:::warning Recalculate your cells
Two fixes in this release change what counts as world collision. Meshes with collision switched off are no longer read
as geometry, and everything now measures the same convex hulls an assembly actually collides against. Any
[Cell](/docs/world-assembly/types/cell) whose hull was baked before 0.3.5 should be recalculated — it will come out
tighter. Expect assemblies to start placing cells in spots they previously refused, because they were dodging geometry
that was never really there.
:::

### World Collision Cache

The expensive half of an assembly was never the assembly. It was gathering the world first: extracting collision from
every actor, stalling on pending static mesh compilation, converting everything to hulls, tracing the landscape. All of
that now happens once, up front, and gets stored in the level.

Saving a level re-bakes only the organs whose geometry actually changed — an untouched level costs nothing to save. When
you want to force it, `Cache World Collision` sits on the [World rail](/docs/world-assembly/editor-mode/world), it
reports progress per organ, and you can cancel it without leaving anything in a half-baked state. Each organ carries a
fingerprint of what it was baked against, so a cache that no longer matches is caught rather than trusted, and that
organ quietly falls back to a live gather.

Policy lives in [Project Settings](/docs/world-assembly/project-settings) under `World Collision Cache`:
`Cache On Save`, `Use Cache` and `Validate Cache`.

### Junction Connectors

A doorway that never found a partner used to get capped off with a filler and that was the end of it. Now the leftovers
get a second chance: each open junction is matched to the nearest compatible opening, a spline is routed between them,
the swept volume is proven clear of world geometry, placed cells and other connectors, and an
[actor you author](/docs/world-assembly/types/cell-junction-connector) is spawned to fill the gap. Both junctions
link, so neither gets capped.

You pick the actor the same way you pick a filler — a
[connector list](/docs/world-assembly/types/cell-junction-connector-entry) on the junction, on the organ, or the
project-wide default, with context tags and weighting. Connectors are built at runtime once both cells report in, time
sliced so a burst of streaming does not spike, and rebuilt if a cell streams out and back.

Because a connector is a route people walk, it comes with a
[solver](/docs/world-assembly/types/junction-connector-solver) that cares about shape: routes that fold through
themselves are rejected outright, and `Minimum Turn Radius Scale` sets a navigability floor so you do not get a corridor
that turns tighter than its own width. A blocked or too-tight route retries against a bounded set of detours and longer
tangents before giving up.

### Smarter Junction Pairing

Distance alone was never enough to decide two doorways should be joined. Pairs are now gated on **orientation** first —
`Maximum Facing Angle`, `Maximum Approach Angle` and `Maximum Elevation Difference` — which is what separates a sensible
right-angle corridor bend from a ceiling hatch bolted onto a wall door. Both are exactly 90 degrees of facing; only one
of them is a corridor. The gate runs before any routing, so the pass got cheaper, not more expensive.

Individual junctions can override all three with
[Connection Constraints](/docs/world-assembly/types/cell-junction-connection-constraints), and both ends are
consulted with the stricter winning — an override can only ever narrow what a junction will accept. A junction can also
opt out of connector pairing entirely with
[`Disable Connecting`](/docs/world-assembly/types/junction-component), while still mating normally during graph
building.

Two more niceties: `Allow Multiple Cell Connections` (off by default) caps a pair of cells at one connection, so several
openings facing each other produce one corridor instead of a bundle. And every rejection reason gets its own counter in
the [operation report](/docs/world-assembly/architecture/analytics), so when a layout comes out sparse you can see
exactly which rule ate the pairings.

### Coincident Junctions

Sometimes two junctions already sit in the same place, facing opposite ways — a graph looping back on itself, or two
organs growing into each other. That is an open doorway, and it was getting capped from both sides.
[`Connect Coincidences`](/docs/world-assembly/project-settings) picks them up and mates them as a plain cell
mating. Nothing routed, nothing spawned, no connector actor needed. Works whether or not the connector pass is on.

### Proximity Scores

Every generated cell now knows how far it is from the interesting parts of the level. `HotPathShortestScore` and
`HotPathSequentialScore` count how many cells separate it from the nearest hot path seed; `ImportanceScore` does the
same for the new `NEXUS.WorldAssembly.Flag.Important` tag, which — unlike `Hotpath` — changes nothing about routing and
exists purely so you can mark a landmark and measure outward from it.

Zero means "this is the seed", one means "directly connected to one", and it counts across the whole operation, so a
cell one connector away from a neighbouring organ's landmark scores one. It all lives on
[Cell Assembly Data](/docs/world-assembly/types/cell-assembly-data), is surfaced on
[the level instance](/docs/world-assembly/types/cell-level-instance), and is mirrored into Blueprint on the
[library](/docs/world-assembly/types/world-assembly-library) with `Is Near HotPath` and `Is Near Important`
threshold nodes.

The genuinely useful half is on the junctions. A cell knowing its own score tells you nothing about *which of its
doorways leads inward* — and the cell on the far side usually has not streamed in yet when you need to ask. So each
junction now carries the far cell's scores with it, and `DoesJunctionLeadTowardHotPath` and
`DoesJunctionLeadTowardImportant` do the comparison for you. Encounter density, loot weighting, ambient audio, "which
way is the boss" signage — all of it gets a lot easier.

### Floor and Ceiling Limits

`Minimum Floor` and `Maximum Ceiling`, each behind its own toggle, keep a cell out of any placement whose bounds would
reach below the floor or above the ceiling. They live on both a [tissue entry](/docs/world-assembly/types/tissue)
and the [organ](/docs/world-assembly/types/organ-volume), they are absolute world-space Z rather than organ
relative, and where both are set they combine by narrowing. Keep your basements out of the water table and your towers
under the skybox.

### The Edit Mode Got A Makeover

New toolkit, new look, new styling throughout. It also stops drawing itself over your game — the rail and panel are
hidden for the duration of a play session, rather than floating on top of the in-viewport PIE they were sharing a
viewport with.

The [Cell rail](/docs/world-assembly/editor-mode/cell) gained a `Display` group with `Draw Bounds`, `Draw Hull` and
`Draw Fill Bounds`, so you can switch off the red box, the blue hull and the grey filler preview independently. They are
per-developer preferences, mirrored in [User Settings](/docs/world-assembly/user-settings), and they gate the
component visualizers too — not just the edit mode's own render. Accepted connector routes are drawn as well, center
curve plus socket corners, and they work in the default proxy-only preview where there are no junction components at
all.

The Organ and Junction pickers also got straightened out: they report `Multiple Selected` when the level selection
covers more than one, and mark every selected entry in the dropdown with a check rather than a radio — because a column
of filled radio buttons says the exact opposite of what a radio button means.
