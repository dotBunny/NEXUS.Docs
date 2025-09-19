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
/**
  * Is the left shift-key pressed?
  * @return true/false the key is pressed on the keyboard.
  */
bool IsLeftShiftDown() const;

/**
  * Is the right shift-key pressed?
  * @return true/false the key is pressed on the keyboard.
  */
bool IsRightShiftDown() const;

/**
  * Is either shift-key pressed?
  * @return true/false either key is pressed on the keyboard.
  */	
bool IsShiftDown() const;
```

### Control
```cpp
/**
  * Is the left control-key pressed?
  * @return true/false the key is pressed on the keyboard.
  */
bool IsLeftControlDown() const;

/**
  * Is the right control-key pressed?
  * @return true/false the key is pressed on the keyboard.
  */	
bool IsRightControlDown() const;

/**
  * Is either shift-key pressed?
  * @return true/false either key is pressed on the keyboard.
  */	
bool IsControlDown() const;
```

## Action Inputs

### Spacebar

```cpp
/**
  * Is the space bar pressed?
  * @return true/false the key is pressed on the keyboard.
  */		
bool IsSpaceBarDown() const;
```

### Mouse Buttons

```cpp
/**
  * Is the left mouse-button pressed?
  * @return true/false the mouse-button is pressed.
  */	
bool IsLeftMouseButtonDown() const;

/**
  * Is the right mouse-button pressed?
  * @return true/false the mouse-button is pressed.
  */		
bool IsRightMouseButtonDown() const;

/**
  * Is the middle mouse-button pressed?
  * @return true/false the mouse-button is pressed.
  */	
bool IsMiddleMouseButtonDown() const;

/**
  * Is any mouse-button pressed?
  * @return true/false any of the three mouse-buttons are pressed.
  */	
bool IsAnyMouseButtonDown() const;
```