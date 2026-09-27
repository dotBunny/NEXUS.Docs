---
sidebar_class_name: type ue-actor
description: A game mode that does nothing but hand the player a menu player controller — for bootstrap, splash and front-end maps.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Null Game Mode

<TypeDetails icon="ue-actor" base="AGameMode" type="ANNullGameMode" typeExtra="" headerFile="NexusCore/Public/Framework/NNullGameMode.h" />

A game mode for maps with no gameplay: a boot map that loads a few things before sending you on, a splash screen, a front-end menu. It changes exactly two things from `AGameMode`:

| Setting | Value | Why |
| :-- | :-- | :-- |
| `PlayerControllerClass` | [ANMenuPlayerController](menu-player-controller.md) | Only UI receives input, and nothing ticks. |
| `bUseSeamlessTravel` | `false` | Leaving the map is a clean, hard travel. |

Everything else is the `AGameMode` default. Pick it in a map's **World Settings** under **GameMode Override** (listed as **NEXUS \| Null GameMode**), or set it as a project default for a boot map.

:::tip

Want a menu map with your own game mode? You don't need this class. Set your game mode's `PlayerControllerClass` to [ANMenuPlayerController](menu-player-controller.md) directly.

:::
