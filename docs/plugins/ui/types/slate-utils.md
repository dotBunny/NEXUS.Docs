---
sidebar_position: 11
sidebar_label: Slate Utils
sidebar_class_name: type native-class
description: Static helpers for walking the Slate widget tree — find widgets by type and locate the SDockTab that hosts a given widget.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Slate Utils

<TypeDetails icon="native-class" base="class" type="FNSlateUtils" typeExtra="" headerFile="NexusUI/Public/NSlateUtils.h" />

Utility methods that walk a Slate widget tree by widget type name. Used by NEXUS code that needs to reach into externally-spawned widget hierarchies (e.g. native menus, third-party plugins) without holding a typed pointer to the target widget.

## Methods

### Find First Widget By Type

Depth-first search for the first `SWidget` whose registered type FName matches `WidgetType`.

```cpp
/**
 * Attempts to find the first SWidget by type within a parent widget and its children.
 * @param ParentWidget The parent widget to search within.
 * @param WidgetType The type of widget to find.
 * @return The found widget or nullptr if not found.
 */
static TSharedPtr<SWidget> FindFirstWidgetByType(TSharedPtr<SWidget> ParentWidget, const FName& WidgetType);
```

### Find Widgets By Type

Collects every matching descendant into `OutWidgets`. Recursion stops at any widget whose type matches `WidgetTypeStop`, so callers can scope the search (e.g. stop at the next `SDockTab` boundary).

```cpp
/**
 * Attempts to find any SWidgets by type within a parent widget and its children.
 * @param OutWidgets The found widgets array.
 * @param ParentWidget The parent widget to search within.
 * @param WidgetType The type of widget to find.
 * @param WidgetTypeStop The type of widget to stop recursively searching at.
 */
static void FindWidgetsByType(TArray<TSharedPtr<SWidget>>& OutWidgets, TSharedPtr<SWidget> ParentWidget, const FName& WidgetType, const FName& WidgetTypeStop = NAME_None);
```

### Find Dock Tab With Label

Walks upward from `BaseWidget` looking for the `SDockTab` whose label matches `TargetLabel`. Useful when only a child widget reference is available and the owning tab needs to be queried or activated.

```cpp
/**
 * Attempt to find the SDockTab for a given SWidget.
 * @param BaseWidget The SWidget to search upward from.
 * @param TargetLabel The label is used to ensure we are finding the correct tab.
 * @return The desired SDockTab or nullptr if not found.
 */
static TSharedPtr<SDockTab> FindDockTabWithLabel(const TSharedPtr<SWidget>& BaseWidget, const FText& TargetLabel);
```
