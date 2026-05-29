---
description: TBD
sidebar_class_name: type ue-volume

---

import TypeDetails from '../../../../src/components/TypeDetails';

# Organ Volume

<TypeDetails icon="/assets/svg/world-assembly/world-assembly-organ-volume.svg" iconType="img" base="AVolume" type="ANOrganVolume" typeExtra="" headerFile="NexusWorldAssembly/Public/Organ/NOrganVolume.h" />

:::info[Wikipedia Definition]

A bone is a rigid organ that constitutes part of the skeleton in most vertebrate animals. Bones provide structural support, protect internal organs, enable mobility, and serve as vital sites for producing blood cells and storing minerals.

:::

An Organ represents a spatial unit where World Assembly of Cells (via Tissues) should be generated. 
Organs can have sub-organs, and generation will account and determine the most parallizable order possible.

![Unbounded Organ](organ-component-unbounded.webp)