---
sidebar_position: 2
sidebar_label: Multiplayer Editor Settings
sidebar_class_name: type ue-settings
description: Project-wide editor settings for the Multiplayer Test workflow.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Multiplayer Editor Settings

<TypeDetails icon="ue-settings" base="UDeveloperSettings" type="UNMultiplayerEditorSettings" typeExtra="" headerFile="NexusMultiplayerEditor/Public/NMultiplayerEditorSettings.h" />

The project-wide configuration for the [Multiplayer Test](../multiplayer-test.md) workflow. Lives under `Edit > Editor Preferences > Multiplayer` and is persisted to `NexusEditor.ini` so the values travel with the project — every developer working on the project sees the same defaults. Per-developer overrides for the test session itself live on [UNMultiplayerEditorUserSettings](multiplayer-editor-user-settings.md).

## Configuration Options

| Setting | Description | Default |
| :-- | :-- | :-- |
| `Enabled` (`bMultiplayerTestEnabled`) | When `true`, the Multiplayer Test entry is added to the editor's play menu and toolbar. Toggling this off removes the test button on the next change without uninstalling the plugin. The class's `PostEditChangeProperty` override watches this flag and adds/removes the menu section live as you toggle it. | `true` |
| `Use Online Subsystem` (`bMultiplayerTestUseOnlineSubsystem`) | When `true`, the spawned play session has `bAllowOnlineSubsystem = true` so authentication can flow through the configured Online Subsystem (Steam, EOS, etc.). Most local-only iteration does not need this. | `false` |

## Apply Settings

```cpp
/**
 * Forwards the project-level multiplayer-test toggles onto the supplied play-session request.
 * @param Params The play-session request whose Online Subsystem behavior should be set.
 */
void ApplySettings(FRequestPlaySessionParams& Params) const;
```

The [UNMultiplayerEditorSubsystem](multiplayer-editor-subsystem.md) calls `ApplySettings` on the project settings before forwarding the same play-session request to [UNMultiplayerEditorUserSettings](multiplayer-editor-user-settings.md), so project-level values are layered first and user values override afterward.

:::info

The `Enabled` toggle is the only knob that takes effect outside the test session itself — it controls whether the test surface is even visible. All other tunables live on [UNMultiplayerEditorUserSettings](multiplayer-editor-user-settings.md).

:::
