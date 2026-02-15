---
sidebar_label: Developer Overlay
sidebar_position: 3
description: TBD
---

import TypeDetails from '../../../src/components/TypeDetails';

# Developer Overlay

<TypeDetails icon="/assets/svg/actor-pools/actor-pool.svg" iconType="img" base="UNDeveloperOverlay" type="UNActorPoolsDeveloperOverlay" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolsDeveloperOverlay.h" />

By going to `Tools > NEXUS > Actor Pools`, you can create an [UNEditorUtilityWidget](/docs/plugins/ui/editor-types/editor-utility-widget/) wrapped version of `/NexusActorPools/WB_NActorPoolsDeveloperOverlay` which will show the real-time stats of all `FNActorPools`.

<div class="image-split">
![No Actor Pools](actor-pools-developer-overlay-none.webp)
![Actor Pools](actor-pools-developer-overlay.webp)
</div>



:::tip

This overlay (`WB_NActorPoolsDeveloperOverlay`) can be included in packaged builds and  will function just like an `UUserWidget`-based widget.

:::