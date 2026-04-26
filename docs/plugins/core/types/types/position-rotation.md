---
sidebar_position: 44
sidebar_label: Position Rotation
sidebar_class_name: type native-struct
description: Lightweight pairing of an FVector position and an FRotator rotation.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Position Rotation

<TypeDetails icon="native-struct" base="struct" type="FNPositionRotation" typeExtra="" headerFile="NexusCore/Public/Types/NPositionRotation.h" />

Lightweight pairing of an `FVector` position and an `FRotator` rotation. Use when an `FTransform` is overkill — no scale, no matrix decomposition.

## Properties

| Property | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `Position` | `FVector` | `ZeroVector` | World-space position. |
| `Rotation` | `FRotator` | `ZeroRotator` | World-space rotation. |
