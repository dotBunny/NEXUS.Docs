---
sidebar_label: SpinBox
sidebar_class_name: type ue-widget
description: An extension on the UMG USpinBox which adds functionality to set its value without broadcasting / triggering events.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# SpinBox

<TypeDetails icon="ue-widget" base="USpinBox" type="UNSpinBox" typeExtra="" headerFile="NexusUI/Public/Components/NSpinBox.h" />

![UNSpinBox](spin-box.webp)

An extension on the UMG `USpinBox` which adds functionality to set its value without broadcasting / triggering events.

## UFunctions

### Set Value (No Broadcast)

```cpp
/**
  * Set the value of the USpinBox without triggering exposed event bindings.
  * @param NewValue The new value.
  */
void SetValue_NoBroadcast(const float NewValue);
```