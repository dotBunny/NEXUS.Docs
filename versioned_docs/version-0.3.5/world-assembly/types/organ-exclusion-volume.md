---
sidebar_class_name: type ue-volume
description: Volume actor that carves negative space out of overlapping organs, preventing cell placement inside it.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Organ Exclusion Volume

<TypeDetails icon="ue-volume" base="AVolume" type="ANOrganExclusionVolume" typeExtra="" headerFile="NexusWorldAssembly/Public/Organ/NOrganExclusionVolume.h" />

Negative space. World Assembly skips cell placement anywhere one of these overlaps an [Organ](organ-volume.md), so you can reserve room inside an otherwise procedurally-populated region.

## Usage

Drop one into the level and shape its brush over the area you want kept clear. There is nothing to configure — the volume declares its own bounds and the type carries **no properties or methods at all**. Overlap with an organ is the entire interface.

Typical uses:

- Reserving space for a hand-authored set-piece inside a generated area.
- Keeping a sub-level's footprint clear so streamed-in content does not collide with generated cells.
- Carving out a hazard, arena, or scripted encounter that must not be built over.

## How It Interacts With Organs

Exclusion is evaluated against the organ's placement region, so the useful mental model is subtraction: an organ's effective area is its own bounds **minus** every exclusion volume overlapping it.

:::note

Because exclusion narrows where cells can go, an aggressive volume can make an organ's [`Minimum Cell Count`](organ-volume.md) unreachable — the organ then fails validation and, if it is marked `Required`, fails the whole assembly operation. If an operation starts failing after you add an exclusion volume, that constraint is the first thing to check.

:::

An exclusion volume only affects organs it actually overlaps; it is not global. Organs elsewhere in the level are unaffected, so volumes can be placed freely without reasoning about the whole map.
