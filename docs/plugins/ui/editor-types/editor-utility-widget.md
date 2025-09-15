---
sidebar_label: Editor Utility Widget
sidebar_class_name: type ue-widget
description: An extension on the UEditorUtilityWidget providing additional functionality around customization and appearance.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor Utility Widget

<TypeDetails icon="ue-widget" base="UEditorUtilityWidget" type="UNEditorUtilityWidget" typeExtra="" headerFile="NexusUIEditor/Public/NEditorUtilityWidget.h" />

An extension on the `UEditorUtilityWidget` providing additional functionality around customization and appearance.

## **Tab Customization**
- **Icon Display**: Provides a virtual method `GetTabDisplayIcon()` to customize the tab icon.
- **Tab Text**: Allows customization of the tab display text via `GetTabDisplayText()`.
- **Unit Scale**: Local `UnitScale` property (Vector2D) for widget scaling, accessible from Blueprint.

## **Lifecycle Management**
- **Pin/Unpin System**: Includes functionality to pin and unpin `UEditorUtilityWidgetBlueprint` templates
    - `PinTemplate()`: Adds a template to the root set, preventing garbage collection.
    - `UnpinTemplate()`: Removes the template from root set, allowing garbage collection.
- **Delayed Construction**: Implements a delayed construction task system via `DelayedConstructTask()`.
- **Native Lifecycle**: Overrides `NativeConstruct()` and `NativeDestruct()` for custom initialization and cleanup.

:::warning

The `UnitScale` is only valid after the construction frame.

:::