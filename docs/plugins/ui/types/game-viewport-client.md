---
sidebar_position: 4
sidebar_label: Game Viewport Client
sidebar_class_name: type ue-object
description: A viewport with some base functionality added.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Game Viewport Client

<TypeDetails icon="ue-object" base="UCommonGameViewportClient" type="UNGameViewportClient" typeExtra="" headerFile="NexusUI/Public/NGameViewportClient.h" />

A viewport with some base functionality added.

## UFunctions

### Toggle World Rendering

```cpp	
/**
  * Toggles if the world should render.
  * @remark This can be useful when you pause a game and want to show a fullscreen UI.
  * @param bNewValue Should the world render? 
  */
void ToggleWorldRendering(const bool bNewValue)
```