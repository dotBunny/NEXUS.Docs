---
sidebar_position: 12
sidebar_label: Details Refresh Delayed Editor Task
sidebar_class_name: type ue-object
description: Delayed editor task that forces the Details panel to reload its property customizations.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Details Refresh Delayed Editor Task

<TypeDetails icon="ue-object" base="UNDelayedEditorTask" type="UNDetailsRefreshDelayedEditorTask" typeExtra="" headerFile="NexusCoreEditor/Public/DelayedEditorTasks/NDetailsRefreshDelayedEditorTask.h" />

Delayed editor task that forces the Details panel to reload its property customizations. Useful after registering or unregistering a detail customization at runtime — the panel needs a refresh tick to pick up the change. Subclass of [`Delayed Editor Task`](../delayed-editor-task.md).

## Creation

Schedules the refresh to run after a short delay (`0.5s`, `5` ticks).

```cpp
/** Schedules the refresh to run after a short delay (0.5s, 5 ticks). */
UFUNCTION(BlueprintCallable)
static void Create();
```
