---
description: TBD
title: Tags
---

# Tags

## Actor Tags

| Tag | Description |
| --- | --- |
| `NCell_Ignore` | |
| `NCell_BoundsIgnore` | |
| `NCell_HullIgnore` | |
| `NCell_VoxelIgnore` | |
| `NWorldCollision_Ignore` | |

## Gameplay Tags

| Tag | Description |
| --- | --- |
| `NEXUS.WorldAssembly.BuiltIn.Starter` | Tagged items can be used at the start of an Organ Assembly as the first placed node in the AssemblyGraph, attached to the Bone. If no Tissue entries are tagged with this (or StarterOnly), any can be used instead in their place. |
| `NEXUS.WorldAssembly.BuiltIn.StarterOnly` | Tagged items can ONLY be used at the start of an Organ Assembly as the first placed node in the AssemblyGraph, attached to the Bone. If no Tissue entries are tagged with this (or Starter), any can be used instead in their place. |
| `NEXUS.WorldAssembly.BuiltIn.NotStarter` | Tagged items cannot be used at the start of an Organ Assembly node branch. |
| `NEXUS.WorldAssembly.BuiltIn.Finisher` | Tagged items can be used at the end of an Organ Assembly node branch. If no Tissue entries are tagged with this (or FinisherOnly), any can be used instead in their place. |
| `NEXUS.WorldAssembly.BuiltIn.FinisherOnly` | Tagged items can ONLY be used at the end of an Organ Assembly node branch. If no Tissue entries are tagged with this (or Finisher), any can be used instead in their place. |
| `NEXUS.WorldAssembly.BuiltIn.NotFinisher` | Tagged items cannot be used at the end of an Organ Assembly node branch. |
| `NEXUS.WorldAssembly.BuiltIn.Unique` | Only one of tagged items could be placed in an Organ Assembly. This is just a built-in default unique group, you can make your own to create discrete groups. |
