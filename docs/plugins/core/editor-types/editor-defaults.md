---
sidebar_position: 9
sidebar_label: Editor Defaults
sidebar_class_name: type native-class
description: A collection of default values to use within the Nexus Editor modules.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor Defaults

<TypeDetails icon="native-class" base="class" type="FNEditorDefaults" typeExtra="" headerFile="NexusCoreEditor/Public/NEditorDefaults.h" />

A collection of default values to use within the NEXUS editor modules. Centralises shared asset-category, settings-section, and placement-category metadata so every NEXUS editor plugin lands in the same drop-downs.

## Static Members

```cpp
/** A default category to use in the asset creation context menu for NEXUS related assets. */
static FAssetCategoryPath AssetCategory;
```

## Methods

### Get Editor Settings Container Name

The settings container name (`"Editor"`) NEXUS editor settings are registered in.

```cpp
static FName GetEditorSettingsContainerName();
```

### Get Editor Settings Category Name

The category name (`"NEXUS"`) all NEXUS editor settings appear under.

```cpp
static FName GetEditorSettingsCategoryName();
```

### Get Placement Category

Gets the placement category for NEXUS related `AActors`.

```cpp
/**
 * Gets the placement category for NEXUS related AActors.
 * @return The qualified placement category for NEXUS related AActors.
 */
static const FPlacementCategoryInfo* GetPlacementCategory();
```
