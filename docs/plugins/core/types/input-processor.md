---
sidebar_label: Editor Input Processor
sidebar_class_name: type native-interface
description: An editor-focused IInputProcessor tracking the state of standard modifier keys and other defined keys.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Editor Input Processor

<TypeDetails icon="native-interface" base="IInputProcessor" type="FNEditorInputProcessor" typeExtra="" headerFile="NexusCoreEditor/Public/NEditorInputProcessor.h" />

An editor-focused `IInputProcessor` tracking the state of standard modifier keys and other defined keys.

:::warning

This is only accessible in the *Unreal Editor*, and is **not** available in packaged builds.

:::

## Accessing

Currently the `FNEditorInputProcessor` must be accessed via native, through:

```cpp
const FNCoreEditorModule& CoreEditorModule = FModuleManager::GetModuleChecked<FNCoreEditorModule>("NexusCoreEditor");
FNEditorInputProcessor* InputProcessor = CoreEditorModule.GetInputProcessor();
```

Once you have a reference to the instance, you can then use its methods to query the status of monitored inputs.

## Modifier Inputs

### Shift

```cpp
bool IsLeftShiftDown() const;
bool IsRightShiftDown() const;
bool IsShiftDown() const;
```

### Control
```cpp
bool IsLeftControlDown() const;
bool IsRightControlDown() const;
bool IsControlDown() const;
```

## Action Inputs

### Spacebar

```cpp
bool IsSpaceBarDown() const;
```

### Mouse Buttons

```cpp
bool IsLeftMouseButtonDown() const;
bool IsRightMouseButtonDown() const;
bool IsMiddleMouseButtonDown() const;
bool IsAnyMouseButtonDown() const;
```
