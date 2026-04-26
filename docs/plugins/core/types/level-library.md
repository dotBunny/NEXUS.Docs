---
sidebar_position: 11
sidebar_label: Level Library
sidebar_class_name: type ue-blueprint-function-library
description: A utility class providing Blueprint-callable level/map operations.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Level Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNLevelLibrary" typeExtra="" headerFile="NexusCore/Public/NLevelLibrary.h" />

A utility class providing Blueprint-callable level/map operations. For C++ callers, prefer the equivalents in [Level Utils](level-utils.md).

## UFunctions

### Get All Map Names

Enumerates all known map package names reachable from the supplied search paths.

```cpp
/**
 * Enumerates all known map package names reachable from the supplied search paths.
 * @param SearchPaths A list of content-root relative paths (e.g. "/Game/Maps") to scan for maps.
 * @return An array of package names of all maps found underneath the search paths.
 */
UFUNCTION(BlueprintCallable, DisplayName = "Get All Map Names", Category = "NEXUS|Level")
static TArray<FString> GetAllMapNames(TArray<FString> SearchPaths);
```
