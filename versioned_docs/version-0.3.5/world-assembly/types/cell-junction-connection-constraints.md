---
sidebar_class_name: type native-struct
description: Per-junction override of the angle limits the connector pass gates candidate pairings on.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Junction Connection Constraints

<TypeDetails icon="native-struct" base="struct" type="FNCellJunctionConnectionConstraints" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NCellJunctionDetails.h" />

A per-junction override of the three angle limits the [connector pass](../architecture/tasks.md#junction-connecting) gates candidate pairings on.

The operation's limits (see [Junction Connectors](../project-settings.md#junction-connecting)) apply to every junction by default. A junction that opts in here supplies its own instead, for **any pairing it takes part in**.

Authored on a junction's [Details](junction-component.md#details) as `Connection Constraints`.

## Settings

| Setting | Type | Description | Default |
|---|---|---|---|
| Override Angle Limits? | `bool` | Enables the three limits below in place of the operation's. While `false` the others are hidden. | `false` |
| Maximum Facing Angle | `float` | This junction's replacement for the operation's `Maximum Facing Angle`. `180` accepts any facing. | `90.0` |
| Maximum Approach Angle | `float` | This junction's replacement for the operation's `Maximum Approach Angle`. `180` accepts a partner anywhere, including directly behind. | `90.0` |
| Maximum Elevation Difference | `float` | This junction's replacement for the operation's `Maximum Elevation Difference`. `180` accepts any difference. | `45.0` |

All four are `EditInstanceOnly` — set them on a placed junction inside the cell level, not on a blueprint default. The three limits are clamped to `0`–`180` degrees and hidden unless `Override Angle Limits?` is ticked.

:::note[The Defaults Here Are Not the Operation's Defaults]

This struct's own defaults are `90` / `90` / `45`. The operation-wide defaults are `180` / `180` / `45` — deliberately looser, because the elevation limit is what does the real work there.

Ticking `Override Angle Limits?` therefore **tightens** facing and approach to 90 degrees unless you change them. That is usually what you want from an override, but it is a change even if you touch nothing else.

:::

## Both Ends Are Consulted, Stricter Wins

An override can only ever **narrow** what a junction accepts.

Both ends of a candidate pair are consulted, and for each of the three limits the **stricter** value wins. A permissive override on one end never loosens a stricter partner — mirroring the dual veto the placement gate already uses.

The practical consequence: **exempting a pairing takes an override on both ends.** Setting `Maximum Facing Angle` to `180` on one junction does nothing if its partner still carries the operation's limit.

## What It Does Not Affect

:::important[Only the Routed Connector Pass Reads These]

Two other kinds of junction pairing ignore this struct entirely:

- **Junctions the graph builder mated.** Those are aligned by construction — the builder places the mating cell so the two sockets coincide head-on — so there is no angle to gate.
- **Flush pairs picked up by [Connect Coincidences](../project-settings.md#junction-matching).** Same reason: the two sockets already occupy the same opening.

Only pairings that need a route built between them are gated on angle.

:::

:::warning[Distinct From Rotation Constraints]

`Connection Constraints` sits beside `Rotation Constraints` on the same junction and the two are easy to confuse. They govern different things at different times:

| | Governs | When |
|---|---|---|
| **Rotation Constraints** | How the owning **cell** may be rotated when the generator places it. | Graph building, while cells are still being positioned. |
| **Connection Constraints** | The world-space relationship between two **fixed** openings. | The connector pass, after both cells are already down. |

By the time the connector pass runs, nothing is being rotated — so what is left to judge is how the two openings sit relative to each other. See [Are Junctions Within Connection Angles](world-assembly-utils.md#connection-angles) for the three angles themselves.

:::
