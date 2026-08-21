---
description: Reference-sphere materials for judging lighting by eye — chrome, grey and white.
---

# Lighting Guide

The three reference surfaces a lighting artist checks a scene against, as material instances (prefixed with `MI_NLightingGuide_`) driven by `M_NLightingGuide`.

Placed together in a shot, they turn "does this look right" into something you can read: each answers a different question about the light falling on that spot.

## Shades

| Instance | Reads |
| :-- | :-- |
| `MI_NLightingGuide_Chrome` | **Where the light is coming from.** A mirror surface reflects the environment, so every source in the scene shows up as a highlight you can locate. |
| `MI_NLightingGuide_Grey` | **Overall exposure.** A neutral mid-tone diffuse surface sits where you expect it on the histogram when exposure is right, and visibly drifts when it is not. |
| `MI_NLightingGuide_White` | **The top end.** A bright diffuse surface is the first thing to clip, so it shows you how much headroom is left before highlights blow out. |

## Blueprint

`BP_NBlockout_LightingGuide` carries the set as a ready-made actor — drop it into a level, put it where the subject will be, and read the three surfaces together.

It is a content-only Blueprint in the Blockout plugin's `Content` root, so it is available as soon as the plugin is enabled.

:::tip

Reference surfaces are only worth what their **placement** is worth. Put the guide where the thing you care about will actually stand, not off to one side — light falling at the edge of a room is not the light falling in the middle of it.

:::
