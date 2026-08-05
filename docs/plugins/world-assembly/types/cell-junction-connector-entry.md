---
sidebar_class_name: type native-struct
description: An authored candidate connector for a junction the connector pass paired with another cell's junction.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Junction Connector Entry

<TypeDetails icon="native-struct" base="struct" type="FNCellJunctionConnectorEntry" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NCellJunctionConnectorEntry.h" />

An authored candidate for **connecting** a junction that the [connector pass](../architecture/tasks.md#junction-connecting) paired with another cell's junction.

The connector counterpart to the filler entry, and selected the same way: entries are gated by their context-tag and tag-counter constraints against the owning cell's assembly state, then one is picked **weighted-at-random** from the survivors.

## Settings

| Setting | Type | Description | Default |
|---|---|---|---|
| Actor | `TSubclassOf<AActor>` | The actor to spawn when this entry is selected. Must implement [INCellJunctionConnector](cell-junction-connector.md) — enforced via `MustImplement`. | `(None)` |
| Offset | `FTransform` | Placement offset applied relative to the **start** junction's frame: the location is rotated by that junction's orientation before being added, the rotation spins the actor in place at that spot, and the scale multiplies the actor's own scale. | `Identity` |
| Required Context Tags | `FGameplayTagContainer` | Tags that must be present in the generated cell's `Context Tags` for this entry to be eligible. | `(Empty)` |
| Tag Counter Constraints | `TArray<FNGameplayTagCounterConstraint>` | `Tag Counter` constraints that must **all** pass for this entry to be eligible. A constrained tag absent from the counter compares as `0`. | `(Empty)` |
| Weighting | `int32` | Relative weight for random selection among eligible entries. Higher values are more likely to be chosen. | `1` |

:::note[Offset Is Relative to the Start End]

`Offset` is applied in the **start** junction's frame, not the end's and not the route's midpoint. Which end is "start" is fixed by the pass's deterministic ordering — see [Cell Junction Connection → Ordering](cell-junction-connection.md#ordering).

Most connectors will not need an offset at all: the [route](cell-junction-connection.md#path) handed to `OnConnectJunctions` is already in world space, so an actor that lofts geometry through the corner curves does not care where its own transform sits.

:::

## Where They Are Authored

The same struct is authored in two places, which is what gives the priority chain its shape:

| Authored On | Scope |
|---|---|
| [`UNCellJunctionComponent::Connectors`](junction-component.md#connectors) | A single junction. |
| [`UNOrganComponent::Connectors`](organ-component.md#connectors) | Every junction on every cell the organ places. |

## Priority

A junction's own list wins over its organ's, and both win over the project-wide `Junction Default Connector` (see [Project Settings](../project-settings.md#junction-connecting)).

Because a pairing has **two** ends, the full chain the [subsystem](world-assembly-subsystem.md#junction-connectors) walks is:

1. The **start** junction's `Connectors`.
2. The **end** junction's `Connectors`.
3. The organ that placed the **start** cell.
4. The organ that placed the **end** cell.
5. The project-wide `Junction Default Connector`.

The first level that yields an eligible entry wins — so where both ends author a list, the **start end's wins**. Note that gating matters here: a list whose every entry is constrained out does not stop the walk, it falls through to the next level.

:::tip[Selection Is Deterministic]

Connector selection runs on a Mersenne Twister seeded from the owning cell's own seed, its node identifier, and the pairing's `ConnectorIdentifier` combined together.

That means the same seed produces the same connector on every run and every machine, while a junction paired twice in different layouts does not always land on the same entry.

Like [filler selection](junction-component.md#selection-is-deterministic), connectors do not break seed reproducibility.

:::
