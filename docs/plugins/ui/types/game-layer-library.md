---
sidebar_position: 3
sidebar_label: Game Layer Library
sidebar_class_name: type ue-blueprint-function-library
description: A small collection of functionality to help with the Game Layer UI system.
tags: [0.2.6]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Game User Settings Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNGameLayerLibrary" typeExtra="" headerFile="NexusUI/Public/NGameLayerLibrary.h" />

A small collection of functionality to help with the Game Layer UI system.


## UFunctions

### Layers

#### Set Layer Visibility

```cpp
	/**
	 * Changes a layer's visibility from the GameLayerManager.
	 * @param LocalPlayer The local player whose UI you want to affect.
	 * @param Name The name of the layer you want to affect.
	 * @param Visibility The visibility you want to set the layer to.
	 * @return True if the layer was successfully set, false otherwise.
	 */
	static bool SetLayerVisibility(ULocalPlayer* LocalPlayer, const FName Name, ESlateVisibility Visibility);
```  