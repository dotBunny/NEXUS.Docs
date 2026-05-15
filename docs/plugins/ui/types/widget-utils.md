---
sidebar_position: 12
sidebar_label: Widget Utils
sidebar_class_name: type native-class
description: Thin adapter helpers that bridge between UMG wrapper types and raw Slate equivalents.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Widget Utils

<TypeDetails icon="native-class" base="class" type="FNWidgetUtils" typeExtra="" headerFile="NexusUI/Public/NWidgetUtils.h" />

Thin adapter helpers that bridge between UMG wrapper types and raw Slate equivalents.

## Methods

### To EVisibility

Convert a UMG `ESlateVisibility` value into the equivalent Slate `EVisibility` value. UMG retains the enum split for editor purposes, but Slate-side code that has to pass through the value to a native widget needs the underlying type.

```cpp
FORCEINLINE static EVisibility ToEVisibility(const ESlateVisibility Visibility);
```

Maps as follows:

| `ESlateVisibility` | `EVisibility` |
| :-- | :-- |
| `Visible` | `Visible` |
| `Collapsed` | `Collapsed` |
| `Hidden` | `Hidden` |
| `HitTestInvisible` | `HitTestInvisible` |
| `SelfHitTestInvisible` | `SelfHitTestInvisible` |
| _(any other)_ | `Visible` |
