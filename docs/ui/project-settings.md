---
sidebar_position: 3
description: The project settings for NexusUI.
---

# Project Settings

From the `Edit > Project Settings` window, find the **User Interface** section under **NEXUS**. The values are saved to `DefaultNexusGame.ini`, so they are shared by the whole project.

Backed by `UNUISettings`; from C++, read it with `UNUISettings::Get()`.

## Text Render

| Setting | Description | Default |
| :-- | :-- | :-- |
| `Warm Text Render Materials` | Create each text render's font materials on the game thread before a loading or streaming level registers it, rather than on the worker thread that registers the level. Controls whether the [Text Render Warmup Subsystem](types/text-render-warmup-subsystem.md) exists. Read when a world is created. | `true` |

Only turn it off if you have measured it and want to be rid of it. The cost is one invisible component per distinct (material, font) pair. The benefit is not creating `UObject`s on a worker thread, which a Debug build with Substrate will assert on.
