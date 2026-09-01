---
sidebar_class_name: type ue-object
description: A viewport with some base functionality added.
---

import TypeDetails from '@site/src/components/TypeDetails';

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

## Delegates

### On Toggle World Rendering

```cpp
/** Fires when ToggleWorldRendering is called, before bDisableWorldRendering is updated. */
UPROPERTY(BlueprintAssignable, Category = "NEXUS|User Interface")
FOnToggleWorldRenderingDelegate OnToggleWorldRendering;
```

A `BlueprintAssignable` delegate carrying the new `bool`, broadcast every time [Toggle World Rendering](#toggle-world-rendering) runs. Bind it to react to the world being hidden or shown — swapping a fullscreen menu backdrop in or out, for instance.

:::note

The broadcast happens **before** `bDisableWorldRendering` is applied, so a handler reading that flag during the callback still sees the previous value. Use the `bool` payload rather than querying the viewport.

:::
