---
sidebar_position: 13
sidebar_label: Update Check Delayed Editor Task
sidebar_class_name: type ue-object
description: Delayed editor task that checks the configured channel for a newer NEXUS release.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Update Check Delayed Editor Task

<TypeDetails icon="ue-object" base="UNDelayedEditorTask" type="UNUpdateCheckDelayedEditorTask" typeExtra="" headerFile="NexusCoreEditor/Public/DelayedEditorTasks/NUpdateCheckDelayedEditorTask.h" />

Delayed editor task that checks the configured channel for a newer NEXUS release. Fires an HTTP request to read the canonical `NCoreMinimal.h` from the chosen channel, compares the embedded version number to the current build, and, when newer, surfaces a notification. Subclass of [`Delayed Editor Task`](../delayed-editor-task.md).

## ENUpdatesChannel

Source channel used by the update-check task. Configured via [`Editor Settings`](../editor-settings.md).

```cpp
UENUM(BlueprintType)
enum class ENUpdatesChannel : uint8
{
    /** Latest stable release tag on GitHub. */
    GithubRelease   = 0 UMETA(DisplayName = "Release (GitHub)"),
    /** Bleeding-edge main branch on GitHub. */
    GithubMain      = 1 UMETA(DisplayName = "Main (GitHub)"),
    /** User-provided custom URIs (see UNEditorSettings::UpdatesCustom*URI). */
    Custom          = 6 UMETA(DisplayName = "Custom"),
};
```

## Creation

Schedules the update-check task according to the user's configured frequency.

```cpp
/** Schedules the update-check task according to the user's configured frequency. */
static void Create();
```

## See Also

- [Editor Settings](../editor-settings.md) — channel and frequency configuration.
- [Editor User Settings](../editor-user-settings.md) — last-checked timestamp persistence.
