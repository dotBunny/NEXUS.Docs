---
sidebar_class_name: type ue-actor
description: A player controller for menu-only maps — UI input only, no gameplay input, no tick, and it cleans up after itself on travel.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Menu Player Controller

<TypeDetails icon="ue-actor" base="APlayerController" type="ANMenuPlayerController" typeExtra="" headerFile="NexusCore/Public/Framework/NMenuPlayerController.h" />

A player controller for maps where the only thing to interact with is UI. It is what [ANNullGameMode](null-game-mode.md) hands the player, and you can use it with any game mode by setting that mode's `PlayerControllerClass`. In the class picker it is listed as **NEXUS \| Menu PlayerController**.

| When | What It Does |
| :-- | :-- |
| Constructed | Turns off ticking (`bCanEverTick = false`). A menu controller has nothing to do per frame. |
| `BeginPlay` | Switches to `FInputModeUIOnly` and disables its own input. `SetupInputComponent` binds nothing, so only widgets receive input. |
| `EndPlay` | Clears the game viewport's ignore-input flag. |

That last row is the one that matters. `FInputModeUIOnly` sets `UGameViewportClient::bIgnoreInput`, and the viewport client belongs to the **game instance**, not the world, so it survives travel. Without the cleanup, leaving the menu map would leave the next map ignoring all input. The controller clears **only** that flag rather than imposing a new input mode, so the next map's controller decides what it wants.

:::note

Focus your menu widget yourself. `FInputModeUIOnly` is applied without a widget to focus, so give your root widget keyboard focus once it is added to the viewport, or keyboard and gamepad navigation will have nothing focused to start from.

:::
