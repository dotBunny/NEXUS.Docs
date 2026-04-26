---
sidebar_position: 3
sidebar_label: Editor Library
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint-exposed editor helpers backed by FNEditorUtils.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNEditorLibrary" typeExtra="" headerFile="NexusCoreEditor/Public/NEditorLibrary.h" />

Blueprint-exposed editor helpers backed by [`Editor Utils`](editor-utils.md). Intended for editor-only utility blueprints and tooling; these calls are no-ops at runtime.

## UFunctions

### Select Actor

Selects `Actor` in the active editor viewport, replacing the current selection.

```cpp
/**
 * Selects Actor in the active editor viewport, replacing the current selection.
 * @param Actor The actor to select.
 */
UFUNCTION(BlueprintCallable, DisplayName = "Select Actor", Category = "NEXUS|Editor")
static void SelectActor(AActor* Actor);
```
