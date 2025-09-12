---
sidebar_position: 9
description:  The sample content provided for NActorPools.
---

# Samples

![NActorPools](actor-pools-samples.webp)

The `DEMO_NActorPools` sample map is available once you have enabled the `NEXUS Samples: Actor Pools` plugin. This is found in the `NEXUS Samples` category in the `Edit > Plugins` window.

The map has a variety of demonstration content, showcasing the [UNActorPoolSpawnerComponent](types/actor-pool-spawner-component.md) and its various uses. The level blueprint also demonstrates how to apply an [UNActorPoolSet](types/actor-pool-set.md) to prewarm some [FNActorPools](types/actor-pool.md).

:::warning

`APS_DEMO_NActorPools_Sphere` purposely has a circular reference in its definition of **Nested Sets**. Do **NOT** do this! Our automated testing uses this to ensure that we protect against that infinite loop.

:::