---
sidebar_position: 5
description: An overlay showing all of the known Actor Pools and their status.
tags: [0.3.0]
---

import TypeDetails from '../../../src/components/TypeDetails';

# Developer Overlay

<TypeDetails icon="/assets/svg/world-assembly/world-assembly.svg" iconType="img" base="UNDeveloperOverlay" type="UNWorldAssemblyDeveloperOverlay" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldAssemblyDeveloperOverlay.h" />

By going to `Tools > NEXUS > World Assembly`, you can create a [UNEditorUtilityWidget](/docs/plugins/ui/editor-types/editor-utility-widget/) wrapped version of `/NexusWorldAssembly/WB_NWorldAssemblyDeveloperOverlay` which will show the status of AssemblyOperations in flight. 

:::tip

This overlay (`WB_NWorldAssemblyDeveloperOverlay`) can be included in packaged builds and will function just like a `UUserWidget`-based widget.

:::
