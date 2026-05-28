---
sidebar_position: 2
sidebar_label: DynamicRef
sidebar_class_name: type ue-enum
description: An enumerated list of fixed reference identifiers used as keys for dynamic references.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Dynamic Reference

<TypeDetails icon="ue-enum" base="UEnum" type="ENDynamicRef" typeExtra="" headerFile="NexusDynamicRefs/Public/NDynamicRef.h" />

A compact, fixed-identifier `int32` enumeration used as the key for a dynamic reference. Each value identifies a slot that can be claimed by one or more `UObjects` per world via the [UNDynamicRefSubsystem](dynamic-ref-subsystem.md). Slots are grouped by conceptual role (Location, Objective, Target, Secret, Spawn, Enemy, Pickup, Item) so manually assigning them in the editor is ergonomic — pick the role first, then a letter.

For free-form keys that aren't covered by these fixed slots, use the `*ByName` overloads on the [UNDynamicRefSubsystem](dynamic-ref-subsystem.md) — they accept any `FName` as a bucket and live alongside the slot-based map.

## Single-Value Slots

| Value | Display | Use |
| :-- | :-- | :-- |
| `NDR_None` (`0`) | None | Sentinel for "no slot"; the default value. |
| `NDR_Player` (`1`) | Player | The local player Pawn or its controller. |
| `NDR_Enemy` (`2`) | Enemy | A canonical antagonist (the boss, the active enemy, etc.). |
| `NDR_NonPlayableCharacter` (`3`) | NPC | A canonical non-player character. |

The single-value slots are intentionally narrow — use them when there's exactly one Actor of that role per world.

## A–Z Group Slots

The remaining values are grouped into eight 26-letter blocks. Each block reserves one slot per letter so designers can place up to 26 distinct Actors of that role without resorting to free-form names.

| Group | Range | Display Format | Typical Use |
| :-- | :-- | :-- | :-- |
| Location | `32`–`57` | `Location A` … `Location Z` | Named map landmarks, regions. |
| Objective | `58`–`83` | `Objective A` … `Objective Z` | Quest or mission targets. |
| Target | `84`–`109` | `Target A` … `Target Z` | Lookat / shoot targets. |
| Secret | `110`–`135` | `Secret A` … `Secret Z` | Hidden collectibles or rooms. |
| Spawn | `136`–`161` | `Spawn A` … `Spawn Z` | Spawn anchors. |
| Enemy | `162`–`187` | `Enemy A` … `Enemy Z` | Per-encounter enemy slots. |
| Pickup | `188`–`213` | `Pickup A` … `Pickup Z` | Item drops, ammo. |
| Item | `214`–`239` | `Item A` … `Item Z` | Inventory or interaction items. |

The terminating sentinel `NDR_Max = 240` is hidden from the editor and used internally to size the subsystem's fast-array storage.

:::tip

Need more slots in a group, or a group that doesn't exist? Use the `*ByName` overloads on [UNDynamicRefSubsystem](dynamic-ref-subsystem.md). The named buckets are stored in a separate `TMap` so adding ad-hoc keys does not bloat the fast-array slot table. Of course, you can also use the `FGameplayTag` approach as well!

:::
