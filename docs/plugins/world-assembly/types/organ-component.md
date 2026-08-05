---
sidebar_class_name: type ue-actor-component
description: Component attached to an actor to mark it as a procedural organ, supplying the tissues and constraints World Assembly uses to populate a region.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Organ Component

<TypeDetails icon="ue-actor-component" base="UActorComponent" type="UNOrganComponent" typeExtra="" headerFile="NexusWorldAssembly/Public/Organ/NOrganComponent.h" />

The component that marks an actor as a procedural **organ** — a region World Assembly should populate. The owning actor's transform and bounds drive *where* cells go; this component supplies the *rules*: which [Tissues](tissue.md) to draw from, how many cells are acceptable, and what must be true for the result to count as a success.

If you just want to drop an organ into a level, use [Organ Volume](organ-volume.md) — a ready-made actor that bundles this component with a [Bone Component](bone-component.md). **That page documents every setting on this component**; this page covers the component as a type.

## Attaching It Yourself

`UNOrganComponent` is a plain `UActorComponent`, so it can be added to any actor — it is not restricted to volumes. That choice has one consequence worth understanding, because the pipeline reads bounds from the owner:

| Owner | Behaviour |
| :-- | :-- |
| An `AVolume` | The volume's brush supplies the region. Cells are constrained to it unless `Unbound` is set. |
| Any other actor | There is no brush to constrain against. The organ effectively behaves as unbounded, anchored at the owner's transform. |

```cpp
/** @return true when the owning actor is an AVolume, so the organ has authored bounds to place cells within. */
UFUNCTION(BlueprintCallable, Category = "NEXUS|World Assembly")
bool IsVolumeBased() const;

/** @return The owning actor cast to AVolume, or nullptr if the owner isn't a volume. */
UFUNCTION(BlueprintCallable, Category = "NEXUS|World Assembly")
AVolume* GetVolume() const;
```

Both are Blueprint-callable. `GetVolume()` returns `nullptr` for a non-volume owner rather than asserting, so it doubles as a safe accessor and a test.

:::note

`Organ Center` [direction mode](organ-volume.md#direction-mode) needs a volume to have a meaningful centre. On a non-volume owner — or a volume marked `Unbound` — it falls back to `Start Bone`.

:::

## Generation Trigger

```cpp
UENUM(BlueprintType)
enum class ENOrganGenerationTrigger : uint8
{
    OnDemand = 0    UMETA(DisplayName="On Demand"),
    BeginPlay = 1   UMETA(DisplayName="Begin Play")
};
```

| Value | When the organ queues itself |
| :-- | :-- |
| `OnDemand` | Only when something asks — Blueprint, the [subsystem](world-assembly-subsystem.md), or the editor-mode toolbar. This is the default. |
| `BeginPlay` | Automatically, when the component receives `BeginPlay`. |

:::warning[Begin Play is server-only]

An organ set to `BeginPlay` queues **only on the authority**. On a client the request is dropped, and the resulting cells replicate in from the server rather than being generated locally — which is what keeps a multiplayer session consistent instead of having every machine generate its own layout.

:::

## Connectors

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Connectors | `TArray<FNCellJunctionConnectorEntry>` | Candidate connectors used when the [connector pass](../architecture/tasks.md#junction-connecting) pairs a junction on a cell **this organ placed**. Each entry's actor must implement [INCellJunctionConnector](cell-junction-connector.md). | `(Empty)` |

Authored under `Organ Component > Connect`. This is the organ-wide fallback for junctions that name no connector of their own, and it in turn falls back to the project-wide `Junction Default Connector` (see [Project Settings](../project-settings.md#junction-connecting)).

Entries are [`FNCellJunctionConnectorEntry`](cell-junction-connector-entry.md) and are gated and weighted exactly as a junction's own list is.

:::note[Which Organ Is Consulted First]

A connector pairing can span **two** organs. When it does, the organ that placed the *start* cell is consulted before the one that placed the end cell — and both are consulted only after **both** junctions' own lists.

Which end is "start" is fixed by the pass's deterministic ordering; see [Cell Junction Connection → Ordering](cell-junction-connection.md#ordering) and the full chain in [Priority](cell-junction-connector-entry.md#priority).

:::

## Native Helpers

| Method | Purpose |
| :-- | :-- |
| `GetDebugLabel()` | Human-readable label drawn in the viewport overlay. |
| `GetDebugLabelPositionRotation()` | Where that label should be rendered, as an [`FNPositionRotation`](../../core/types/types/position-rotation.md). |
| `DrawDebugPDI(PDI)` | Draws the organ's debug representation through a primitive draw interface. |
| `GetTissueMap(OutMap, OutTagGroups)` | Flattens the organ's tissue list into a cell-to-entry map and the union of their tag groups — see [Tissue](tissue.md#additional-tissue) for how nesting resolves. |

There is also a static filter helper that extracts every `UNOrganComponent` from a heterogeneous weak-object set, which is how the editor mode turns a viewport selection into a list of organs.
