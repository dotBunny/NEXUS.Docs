---
sidebar_position: 7
sidebar_label: Widget Library
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint-facing accessors for FNWidgetState that bridge the C++ struct helpers into pure Kismet nodes.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Widget Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNWidgetLibrary" typeExtra="" headerFile="NexusUI/Public/NWidgetLibrary.h" />

A `UBlueprintFunctionLibrary` that exposes [FNWidgetState](widget-state.md) operations to Blueprints. The struct's helpers are inline C++ that the Blueprint VM cannot reach directly, so this library wraps each one as a `BlueprintCallable` static.

## UFunctions

All functions live in the `NEXUS|User Interface|Widget State` category.

### Get Boolean

```cpp
/** @return the boolean stored for Key in State, or false when missing. */
static bool GetWidgetStateBoolean(const FNWidgetState& State, const FString& Key);
```

### Get Float

```cpp
/** @return the float stored for Key in State, or 0 when missing. */
static float GetWidgetStateFloat(const FNWidgetState& State, const FString& Key);
```

### Get String

```cpp
/** @return the string stored for Key in State, or an empty string when missing. */
static FString GetWidgetStateString(const FNWidgetState& State, const FString& Key);
```

### Set Boolean

```cpp
/** Update or insert the boolean entry for Key on State. */
static void SetWidgetStateBoolean(UPARAM(ref) FNWidgetState& State, const FString& Key, const bool Value);
```

### Set Float

```cpp
/** Update or insert the float entry for Key on State. */
static void SetWidgetStateFloat(UPARAM(ref) FNWidgetState& State, const FString& Key, const float Value);
```

### Set String

```cpp
/** Update or insert the string entry for Key on State. */
static void SetWidgetStateString(UPARAM(ref) FNWidgetState& State, const FString& Key, const FString Value);
```

:::tip

The `Set*` helpers use update-or-insert semantics. To bulk-load a fresh state from Blueprint, prefer setting each key individually rather than calling the C++ `Add*` methods, which append without deduplicating.

:::
