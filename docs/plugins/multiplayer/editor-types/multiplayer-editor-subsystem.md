---
sidebar_position: 1
sidebar_label: Multiplayer Editor Subsystem
sidebar_class_name: type ue-world-subsystem
description: Editor subsystem that drives the Multiplayer Test workflow — spawns and tracks the client/server processes that make up a test session.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Multiplayer Editor Subsystem

<TypeDetails icon="ue-world-subsystem" base="UEditorSubsystem" type="UNMultiplayerEditorSubsystem" typeExtra="" headerFile="NexusMultiplayerEditor/Public/NMultiplayerEditorSubsystem.h" />

The `UEditorSubsystem` that drives the [Multiplayer Test](../multiplayer-test.md) toolbar button. When you click the test button, this subsystem reads the configured project ([UNMultiplayerEditorSettings](multiplayer-editor-settings.md)) and per-user ([UNMultiplayerEditorUserSettings](multiplayer-editor-user-settings.md)) values, asks the editor to spawn the configured client/server processes, tracks the resulting `FProcHandle`s, and tears them all down when the test ends or the editor exits.

The subsystem also implements `FTickableGameObject` so it can poll the spawned processes and shut them down cleanly when any of them dies — without that the editor would leak orphan game processes after a test session.

## What It Does

- **Spawns Test Processes**: Builds the play-session request from the two settings classes and asks the editor's play system to launch the requested clients (and a dedicated server, if configured).
- **Tracks Process Handles**: Listens for the editor's local-process registration callback and stores each spawned `FProcHandle` so it can shut them all down at the end of the test.
- **Tickable While Running**: Returns `IsTickable() == true` only while a test is active and there are tracked processes — the conditional tick prevents wasted work when no session is running and gracefully bails out during editor shutdown.

## Public API

### Start Multiplayer Test

```cpp
/** Start the multiplayer test, spawning client/server processes according to the user settings. */
void StartMultiplayerTest();
```

Resolves the play-in-editor configuration from both settings classes, kicks off the spawn, and begins tracking process handles.

### Stop Multiplayer Test

```cpp
/** Stop the multiplayer test and terminate any tracked processes. */
void StopMultiplayerTest();
```

Closes every tracked `FProcHandle` and clears the running flag. Safe to call when no session is active.

### Toggle Multiplayer Test

```cpp
/** Flip between started and stopped states. */
void ToggleMultiplayerTest();
```

The function the toolbar button is bound to — calls `StartMultiplayerTest` when no session is active, otherwise `StopMultiplayerTest`.

### Is Test Running

```cpp
/** @return true if a multiplayer test session is currently active. */
bool IsTestRunning() const;
```

### Add Local Process

```cpp
/**
 * Track a locally launched process so the subsystem can monitor and shut it down.
 * @param ProcessIdentifier OS-level process id of the launched editor/client/server instance.
 */
UFUNCTION()
void AddLocalProcess(const uint32 ProcessIdentifier);
```

`AddLocalProcess` is wired up to the editor's local-process notification delegate when a session starts, so every freshly-spawned PIE client/server reports itself back into the subsystem's tracked-handles array. The corresponding delegate handle (`LocalProcessDelegateHandle`) is removed when the session stops.

## Tick Behavior

```cpp
virtual bool IsTickable() const override
{
    if (FNEditorUtils::IsEditorShuttingDown()) return false;
    return bIsMultiplayerTestRunning && ProcessHandles.Num() > 0;
}
```

The subsystem ticks only while a test is active and there is at least one tracked process to monitor. The shutdown short-circuit avoids any chance of touching `FProcHandle`s during the editor's teardown sequence — important because Unreal's process APIs can crash if invoked after their backing systems have been torn down.

`GetTickableTickType` returns `ETickableTickType::Conditional` so the engine consults `IsTickable` before each frame; `IsTickableWhenPaused` and `IsTickableInEditor` both return `true` so the subsystem keeps polling even when PIE is paused.
