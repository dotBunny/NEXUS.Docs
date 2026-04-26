---
sidebar_position: 5
sidebar_label: Editor Settings
sidebar_class_name: type ue-settings
description: Project-level NEXUS editor settings (updates channel, update-check cadence).
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor Settings

<TypeDetails icon="ue-settings" base="UDeveloperSettings" type="UNEditorSettings" typeExtra="" headerFile="NexusCoreEditor/Public/NEditorSettings.h" />

Project-level NEXUS editor settings (updates channel, update-check cadence). Saved to the `NexusEditor` config hierarchy and surfaced under **Project Settings → NEXUS → Core**.

## Properties

| Property | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `bUpdatesCheck` | `bool` | `true` | Should the NEXUS Framework check for updates periodically and notify you? |
| `UpdatesFrequency` | `int32` | `7` | Update-check frequency in days. |
| `UpdatesChannel` | `ENUpdatesChannel` | `GithubRelease` | Channel to query (Release, Main, or Custom). See [Update Check Delayed Editor Task](delayed-editor-tasks/update-check-delayed-editor-task.md). |
| `UpdatesCustomQueryURI` | `FString` | `""` | Fully-qualified URI to the `NCoreMinimal.h` file in a custom fork. Only used when `UpdatesChannel == Custom`. |
| `UpdatesCustomUpdateURI` | `FString` | `""` | Fully-qualified URI to open when an update is detected. Only used when `UpdatesChannel == Custom`. |
| `UpdatesIgnoreVersion` | `int32` | `NEXUS::Version::Number` | Suppress update notifications for versions less than or equal to this number. |

## See Also

- [Editor User Settings](editor-user-settings.md) — per-user, machine-local state (e.g. last update-check timestamp).
- [Update Check Delayed Editor Task](delayed-editor-tasks/update-check-delayed-editor-task.md) — the task that consumes these settings.
