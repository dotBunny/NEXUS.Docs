---
sidebar_class_name: type native-class
description: Static class that installs the Multiplayer Test toggle button into the Level Editor toolbar via UToolMenus.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Multiplayer Test Toolbar Section

<TypeDetails icon="native-class" base="class" type="FNMultiplayerTestToolbarSection" typeExtra="" headerFile="NexusToolingEditor/Public/MultiplayerTest/NMultiplayerTestToolbarSection.h" />

Static class that registers and unregisters the Multiplayer Test entry on the Level Editor toolbar via `UToolMenus`. Owns the cached running state and the delegate handles bound against [UNMultiplayerTestSubsystem](multiplayer-test-subsystem.md) so the icon and tooltip reflect whether a test session is currently active.

This is editor-bootstrap glue — typical NEXUS users do not call into it directly; the tooling module installs the section on startup and removes it on shutdown.

## Public API

### Add Section

```cpp
/** Register the multiplayer test section/entries with UToolMenus. */
static void AddSection();
```

Inserts the section into the Level Editor toolbar and binds delegates against the subsystem's started/ended events so the icon and tooltip stay in sync with the cached running state.

### Remove Section

```cpp
/** Unregister entries previously installed by Register. */
static void RemoveSection();
```

Removes the toolbar entries and releases the started/ended delegate handles. Called on tooling module shutdown.

### Has Section

```cpp
/** @return true if the MultiplayerTest section is present on the LevelEditorToolBar. */
static bool HasSection();
```

## See Also

- [UNMultiplayerTestSubsystem](multiplayer-test-subsystem.md) — the subsystem the toolbar button toggles.
- [Multiplayer Test](../../enhancements/multiplayer-test.md) — feature-level overview.
