---
sidebar_position: 2
sidebar_label: Picker Utils
sidebar_class_name: type native-class
description: Shared trace and navmesh query defaults consumed by every picker's projection path.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Picker Utils

<TypeDetails icon="native-class" base="class" type="FNPickerUtils" typeExtra="" headerFile="NexusPicker/Public/NPickerUtils.h" />

Shared configuration defaults used by every picker when resolving a generated point onto geometry or navmesh via [ENPickerProjectionMode](picker-params.md#projection-mode). The header also defines the macro family the picker implementations expand into so projection behaviour stays consistent across shapes — those macros are intentionally undocumented (header-only convenience, not part of the public type surface).

## Static Fields

| Field | Type | Description |
| :-- | :-- | :-- |
| `CollisionQueryParams` | `FCollisionQueryParams` | Collision query parameters used by the trace-based projection path. |
| `NavQueryExtent` | `FVector` | Half-extent of the AABB used when projecting onto the navmesh; widen this if your navmesh tolerance needs to be larger. |
| `NavAgentProperties` | `FNavAgentProperties` | Nav agent properties used when resolving a navmesh location for a generated point. |

These are static and mutable — projects that need different defaults can assign new values once at startup rather than threading parameters through every picker call site.

## See Also

- [PickerParams](picker-params.md) — references these fields from its `Trace` / `NearestNavMeshV1` projection branches.
