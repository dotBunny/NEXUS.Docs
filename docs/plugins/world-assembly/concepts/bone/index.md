---
description: A Bone functions as a connection point outside of a Cell that is used as a starting point during World Assembly.
sidebar_class_name: type ue-scene-component
sidebar_label: Bone
title: Bone
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Bone

<TypeDetails icon="/assets/svg/world-assembly/world-assembly-bone-component.svg" iconType="img" base="USceneComponent" type="UNBoneComponent" typeExtra="" headerFile="NexusWorldAssembly/Public/Organ/NBoneComponent.h" />

A **Bone** functions as a connection point outside of a [Cell](../cell/index.md) that is used as a starting point during World Assembly. The overall goal is to connect all encompassed **bones** in an [Organ](../organ/index.md).

The connecting of [Junctions](../junction/index.md) to **bones** utilizes the same ruleset for matching that [Junction](../junction/index.md)-to-[Junction](../junction/index.md) connections must meet.

:::warning

Currently, only the **Bone** built-in to the [Organ](../organ/index.md) is used as a starting point for World Assembly. **Multi-bone** support is targeted for the `0.4.0` release. Explicitly, [Cell](../cell/index.md) placement between bones is not functional, nor is bone-to-bone between [Organs](../organ/index.md).

:::

![Bone Gizmo](bone-gizmo.webp)

A **Bone** represents itself in the world as a white-lined [Junction](../junction/index.md), with identical indicators.


:::tip[Bone Actor]


A `ANBoneActor` is available for situations where you want a bespoke **Bone**, and do not want to attach a `UNBoneComponent` to another `AActor`.

:::

## Component Details

![Bone Component Details](bone-component-details.webp)

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Socket Size | `FIntVector2` |  Size of the socket in grid units (width, height), used for matching against [Junctions](../junction/index.md). | `(2,4)` |
| Type | `ENCellJunctionType` | **NOT IMPLEMENTED** | `Two-Way` |
| Requirements | `ENCellJunctionRequirements` | **NOT IMPLEMENTED** | `AllowEmpty` |
| Mode | `ENBoneMode`| The **Bone** placement behaviour at author-time. | `Automatic` |
| Identifier | `FGuid` | A pseudo-unique identifier for the **Bone** component. | `N/A` |

## ENBoneMode

| Mode | Description |
| :-- | :-- |
| `Manual` | Allows for manual placement of the Bone inside of it's volume. |
| `Automatic` | Attempts to place the Bone at the extreme of the volume based on the project settings . |
| `Disabled` | Disables the Bone from being used inside of any assembly operation. |

## Project Settings

![Project Settings](project-settings-bone-placement.webp)

In `Project Settings > World Assembly > Organ`, the settings for how automatic placement is done in a project gets defined.

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Automatic Bone Direction | `ENDirection` |  The direction to trace out from the center of the volume to the border. | `Backward` |
| Automatic Bone Direction (Offset) | `FVector` |  An offset to apply to the given point determined by the trace above. | `(0,0,0)` |