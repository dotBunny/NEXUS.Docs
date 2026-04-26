---
sidebar_position: 14
sidebar_label: Settings Utils
sidebar_class_name: type native-class
description: Provides the canonical container/category names every NEXUS plugin registers its settings under.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Settings Utils

<TypeDetails icon="native-class" base="class" type="FNSettingsUtils" typeExtra="" headerFile="NexusCore/Public/NSettingsUtils.h" />

Provides the canonical container/category names every NEXUS plugin registers its developer and project settings under. Use these accessors rather than duplicating the string literals so that all NEXUS settings appear under a single, consistent section in the Project Settings UI.

## Methods

### Get Container Name

The settings container name (`"Project"`) NEXUS settings are registered in.

```cpp
/**
 * The settings container name (e.g. "Project") NEXUS settings are registered in.
 * @return The container name used by ISettingsModule::RegisterSettings.
 */
static FName GetContainerName();
```

### Get Category Name

The category name all NEXUS settings groups appear under in the Project Settings UI — always `"NEXUS"`.

```cpp
/**
 * The category name all NEXUS settings groups appear under in the Project Settings UI.
 * @return The canonical "NEXUS" category name.
 */
static FName GetCategoryName();
```
