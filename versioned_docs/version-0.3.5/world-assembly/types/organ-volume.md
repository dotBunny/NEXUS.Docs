---
description: A spatial volume that defines where World Assembly of Cells (via Tissues) should be generated.
sidebar_class_name: type ue-volume
---

import TypeDetails from '@site/src/components/TypeDetails';

# Organ Volume

<TypeDetails icon="/assets/svg/world-assembly/world-assembly-organ-volume.svg" iconType="img" base="AVolume" type="ANOrganVolume" typeExtra="" headerFile="NexusWorldAssembly/Public/Organ/NOrganVolume.h" />

:::info[Wikipedia Definition]

A collection of tissues joined in a structural unit to serve a common function.

:::

An Organ represents a spatial unit where World Assembly of [Cells](../types/cell.md) (via [Tissues](../types/tissue.md)) should be generated.
Organs can have sub-organs, and generation will account for and determine the most parallelizable order possible.

`ANOrganVolume` itself is a convenience actor: it bundles a [Bone Component](bone-component.md) and an organ component together so that dropping one into a level is all it takes to declare a region for World Assembly to populate. The organ component supplies the tissue and cell rules; the bone component supplies the spatial skeleton that shapes placement during graph construction. Both are exposed as `BlueprintReadOnly` properties, and native code can reach them via `GetOrganComponent()` and `GetBoneComponent()`.

Everything below documents the bundled organ component's settings.

<div class="image-tri">
![Phased Organs](/assets/images/docs/world-assembly/types/organ-phases.webp "Organ Phases")
![Brush Organ](/assets/images/docs/world-assembly/types/organ-brush.webp "Organ Brushes")
![Unbounded Organ](/assets/images/docs/world-assembly/types/organ-unbounded.webp "Unbounded Organ")

</div>

## Actions

When you have an Organ selected, its component has some action buttons available to **Generate** and **Clear**, similar to [Selected Organ](../editor-mode/organ.md#selected-organ) as part of the [World Assembly Editor Mode](../editor-mode/index.mdx).

## Component Settings

![Organ Component Details](/assets/images/docs/world-assembly/types/organ-component-details.webp)

### Tissues

An array of [Tissues](../types/tissue.md) defining what should be used to populate an Organ. Stored as `TArray<TSoftObjectPtr<UNTissue>>`, so referencing a tissue here does not pull it into memory until an assembly operation builds its cell map. At that point the tissue and the [Cell](cell.md) data assets it names are loaded — but each cell's *level* stays unloaded until the cell is actually placed, which is what the side-car design buys you. This is the one organ setting that is editor-only (`EditAnywhere` without `BlueprintReadWrite`); the tissue list cannot be swapped from Blueprint at runtime.

### Inputs

| Setting | Type | Description | Default |
|---|---|---|---|
| Activated | `bool` | Should this Organ be included in World Assembly? | `true` |
| Required | `bool` | Is a successful generation of this organ required for the whole assembly operation to be considered successful? | `true` |
| Unbound | `bool` | Should the Organ **NOT** enforce that placed Cells during generation fall within its bounds / brush. | `false` |
| Use Minimum Floor | `bool` | When enabled, no cell this Organ places may reach below `Minimum Floor`. Independent of `Unbound`. | `false` |
| Minimum Floor | `float` | The lowest world-space Z, in world units, any cell this Organ places may occupy. **Absolute world height**, not relative to the Organ. Shown while `Use Minimum Floor` is set. | `0.0` |
| Use Maximum Ceiling | `bool` | When enabled, no cell this Organ places may reach above `Maximum Ceiling`. Independent of `Unbound`. | `false` |
| Maximum Ceiling | `float` | The highest world-space Z, in world units, any cell this Organ places may occupy. Absolute world height, as with `Minimum Floor`. Shown while `Use Maximum Ceiling` is set. | `0.0` |

#### Height Constraints

The floor and ceiling clip placement to a vertical band of the world, and are **independent of `Unbound`** — they are in fact the only vertical limit an unbound Organ can express, since an unbound Organ carries no volume bounds for the containment check to clip against.

A cell can narrow the window further through its own [tissue entry](tissue.md#height-constraints): whichever floor sits *higher* is enforced, and whichever ceiling sits *lower*, so a cell may be stricter than its Organ but never escape it.

### Requirements

| Setting | Type | Description | Default |
|---|---|---|---|
| Minimum Cell Count | `int32` | An optional minimum required placed cell count that will invalidate an assembly operation if it is not met. `0` leaves this feature disabled. | `0` |
| Maximum Cell Count | `int32` | An optional maximum required placed cell count that will invalidate an assembly operation if it is not met. `0` leaves this feature disabled. | `0` |
| Context Tags | `FGameplayTagContainer` | A collection of `Context Tags` which must be present for the Organ to be generated successfully. | `(Empty)` |
| Tag Counters | `TArray<FNGameplayTagCounterConstraint>` | A set of constraints that are evaluated to determine if the Organ was successfully generated. | `(Empty)` |

### Operation

| Setting | Type | Description | Default |
|---|---|---|---|
| Generation Trigger | `ENOrganGenerationTrigger` | Determine if the Organ should automatically queue itself for generation on `Begin Play` or indicate that it will be manually generated `On Demand`. | `OnDemand` |
| Seed | `int32` | Overrides the seed passed to the `FNVirtualOrganContext`, used for deterministic random for this given Organ during its assembly operation. If the value is `-1` it will not override, and preserves the passed seed. | `-1` |
| Direction Mode | `ENOrganDirectionConstraintMode` | The reference point this Organ's Cell [directional constraints](../types/tissue.md#cells) measure candidate bearings from. See [Direction Mode](#direction-mode) below. | `Start Bone` |
| Identifier | `FGuid` | A constructor generated identifier used to sort Organs. | `<ctor>` |

#### Direction Mode

When a Cell has a `Direction Constraint`, it can only be placed when its prospective bearing lands within the [`Direction Tolerance`](../project-settings.md) of the constrained compass heading. **Direction Mode** chooses the point that bearing is measured *from*, letting each Organ shape how its directional content lays out independently of every other Organ.

| Mode | Description |
|---|---|
| `Start Bone` | Measure bearings from the Organ's start bone (the generation anchor). This is the default and the original behavior. |
| `Organ Center` | Measure bearings from the geometric center of the Organ volume's bounds. `Unbound` Organs have no meaningful volume center, so they fall back to `Start Bone`. |
| `Dynamic Centroid` | Measure bearings from the running centroid of the Cells already placed in the Organ, so the reference point shifts as the Organ fills in. Before the first Cell is placed it falls back to `Start Bone`. |

:::note[Multiplayer]

Generation only runs with world authority. An Organ set to generate on `Begin Play` is queued on the server only — on clients the request is dropped and the resulting Cells replicate in from the server rather than being generated locally.

:::
