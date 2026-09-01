---
sidebar_class_name: type ue-object
description: An abstract class designed to encompass work to be completed at some level of delay from the time of its creation.
---

import TypeDetails from '@site/src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Delayed Editor Task

<TypeDetails icon="ue-object" base="UObject" type="UNDelayedEditorTask" typeExtra="" headerFile="NexusCoreEditor/Public/NDelayedEditorTask.h" />

An **abstract**  class designed to encompass work to be completed at some level of delay from the time of its creation.

## Creating The Delay

```cpp
/**
 * Factory for the UAsyncEditorDelay that drives the delay timer.
 * @return A new delay mechanism the derived task can schedule work on.
 */
static UAsyncEditorDelay* CreateDelayMechanism();
```

A derived task calls this to obtain the `UAsyncEditorDelay` it schedules against, then hands it to the protected setup path which registers the task with the `EditorUtilitySubsystem` so it survives garbage collection while pending.

The delay mechanism itself needs no separate registration — it stays reachable transitively, being both the task's `Parent` property and its `Outer`.

## Implementations

- [Update Check](delayed-editor-tasks/update-check-delayed-editor-task.md) — polls for a newer framework version after a delay.
- `NLeakTestDelayedEditorTask` in the Tooling plugin — see [Leak Check](/docs/tooling/debuggers/leak-check.md).
