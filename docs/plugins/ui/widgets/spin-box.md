---
sidebar_position: 4
sidebar_label: SpinBox
sidebar_class_name: type ue-widget
description: An extension on the UMG USpinBox which adds functionality to set its value without broadcasting / triggering events.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# SpinBox

<TypeDetails icon="ue-widget" base="USpinBox" type="UNSpinBox" typeExtra="" headerFile="NexusUI/Public/NSpinBox.h" />

![UNSpinBox](spin-box.webp)

An extension on the UMG `USpinBox` which adds functionality to set its value without broadcasting / triggering events.

```cpp
UFUNCTION(BlueprintCallable, Category="NEXUS|User Interface", DisplayName="Set Value (No Broadcast)")
void SetValue_NoBroadcast(const float NewValue);
```