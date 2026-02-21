---
sidebar_label: Collision Visualizer
description: A tool used to quickly test world traces and their responses.
tags: [0.2.7]
---

# Collision Visualizer

Opened by going to `Tools > Debug > Collision Visualizer`, this window can be used to quickly test world traces and their responses. Functioning in and out of PIE, as well as in SIE to draw the outcome of the defined trace.

![Collision Visualizer](collision-visualizer-demo.webp)

:::info

After watching George Prosser's UnrealFest 2023 talk [Collision Data in UE5](https://www.youtube.com/watch?v=xIQI6nXFygA) we set about creating our interpretation of the tool with a different method of integration. We later found out about the publicly available [UECollisionQueryTools](https://github.com/StudioGobo/UECollisionQueryTools) repository. Credits to George and the team at Studio Gobo for the great inspiration for this tool.

:::

## Configuration

![Collision Viz Window](collision-visualizer-window.webp)

The configuration is persistant and copy-pastable for sharing (right-click on Settings).

:::tip

You can move both points and rotate the start point in the inspector or in the viewport, they will be syncronized.

:::
