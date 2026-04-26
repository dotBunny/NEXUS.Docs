---
sidebar_position: 6
sidebar_label: Editor User Settings
sidebar_class_name: type ue-settings
description: Per-user NEXUS editor preferences persisted outside project config.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor User Settings

<TypeDetails icon="ue-settings" base="UDeveloperSettings" type="UNEditorUserSettings" typeExtra="" headerFile="NexusCoreEditor/Public/NEditorUserSettings.h" />

Per-user NEXUS editor preferences persisted outside project config. Stores machine-local state (such as the last time the update-check ran) so it does not leak into source control via the shared `NexusEditor` ini.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `UpdatesLastChecked` | `FDateTime` | Timestamp of the most recent successful update check; compared against [`UNEditorSettings::UpdatesFrequency`](editor-settings.md). |
