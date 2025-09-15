---
sidebar_label: Slider
sidebar_class_name: type ue-widget
description: An extension on the UMG USlider which adds functionality to set its value without broadcasting / triggering events.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Slider

<TypeDetails icon="ue-widget" base="USlider" type="UNSlider" typeExtra="" headerFile="NexusUI/Public/Components/NSlider.h" />

![UNSlider](slider.webp)

An extension on the UMG `USlider` which adds functionality to set its value without broadcasting / triggering events.

## UFunctions

### Set Value (No Broadcast)

```cpp
/**
  * Set the value of the USlider without triggering exposed event bindings.
  * @param NewValue  The new value.
  */
void SetValue_NoBroadcast(const float NewValue);
```