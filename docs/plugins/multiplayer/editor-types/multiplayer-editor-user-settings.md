---
sidebar_position: 3
sidebar_label: Multiplayer Editor User Settings
sidebar_class_name: type ue-settings
description: Per-user editor settings for the Multiplayer Test workflow.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Multiplayer Editor User Settings

<TypeDetails icon="ue-settings" base="UDeveloperSettings" type="UNMultiplayerEditorUserSettings" typeExtra="" headerFile="NexusMultiplayerEditor/Public/NMultiplayerEditorUserSettings.h" />

The per-user side of the [Multiplayer Test](../multiplayer-test.md) configuration. Lives under `Edit > Editor Preferences > Multiplayer (User)` and is persisted to `NexusUserSettings.ini`, which means client/server counts, window sizes, and network-simulation knobs stay on the developer's machine rather than getting committed to source control. Project-level toggles (Enabled, Use Online Subsystem) live on [UNMultiplayerEditorSettings](multiplayer-editor-settings.md) instead.

For a setting-by-setting walkthrough including screenshots and tooltips, see the [Multiplayer Test](../multiplayer-test.md#user-settings) page — that's the canonical reference for what each knob does. This page documents the type itself and the two methods on it that are interesting to native callers.

## What It Does

- **Captures Test-Session Layout**: Holds the client count, window size, dedicated/listen-server choice, and additional command-line parameters fed to each spawned process.
- **Encodes Network Simulation**: The `Clients: Network Simulation` group maps directly onto the engine's `-PktLagMin` / `-PktLagMax` / `-PktLoss` / `-PktDup` / `-PktOrder` command-line flags, plus `-nosound` and `networkprofiler=true` when their toggles are on.
- **Per-User Persistence**: Stored in the `NexusUserSettings` config so two developers on the same project can run wildly different test sessions without stepping on each other's settings.

## Apply Settings

```cpp
/**
 * Copies the user-facing values from this settings object into the supplied FRequestPlaySessionParams
 * so the editor launches the test session with the configured client/server layout.
 * @param Params The play-session request to populate; Params.EditorPlaySettings must be valid.
 */
void ApplySettings(FRequestPlaySessionParams& Params) const;
```

`ApplySettings` is called by [UNMultiplayerEditorSubsystem](multiplayer-editor-subsystem.md) when starting a session. It:

1. Sets the client window size on `Params.EditorPlaySettings`.
2. Builds the server's additional launch parameters via the private `GetServerArguments` helper (currently just `networkprofiler=true` when the server profile toggle is on).
3. Builds the clients' additional launch parameters via the private `GetClientArguments` helper, which encodes the network-simulation toggles and appends `ClientParameters`.
4. Sets the play number of clients.
5. Picks `PIE_Client` net mode (with `bLaunchSeparateServer = bSpawnSeparateServer`) when a dedicated server or explicit server parameters are configured; otherwise falls back to `PIE_ListenServer`.

## Generated Client Arguments

The first argument every spawned client receives is `-NMultiplayerTest`, which is the marker the runtime [UNMultiplayerLibrary](../types/multiplayer-library.md#is-multiplayer-test) `IsMultiplayerTest()` looks for. Subsequent flags are appended as configured:

| Toggle | Resulting Flag |
| :-- | :-- |
| `bClientGenerateNetworkProfile` | `networkprofiler=true` |
| `bClientDisableSound` | `-nosound` |
| `ClientSimulateLagMinimum > 0` | `-PktLagMin=<half of value>` |
| `ClientSimulateLagMaximum > 0` | `-PktLagMax=<half of value>` |
| `ClientSimulatePacketLoss > 0` | `-PktLoss=<value>` |
| `ClientSimulatePacketDuplication > 0` | `-PktDup=<value>` |
| `bClientSimulateReceiveOutOfOrderPackets` | `-PktOrder=1` |
| `ClientParameters` (non-empty) | trimmed and appended verbatim |

:::warning

The lag values are passed to the engine as **half** the configured ms — the simulation already pays the round trip between client and server, so dividing by two keeps the user-facing number close to the perceived total latency. Configure your numbers as the round-trip time you want the test to feel like, not the per-leg delay.

:::
