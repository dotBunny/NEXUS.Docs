---
sidebar_class_name: type native-class
description: Static class that installs the Lock Selection toggle into the actor context menu via UToolMenus.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Selection Lock Menu

<TypeDetails icon="native-class" base="class" type="FNSelectionLockMenu" typeExtra="" headerFile="NexusToolingEditor/Public/SelectionLock/NSelectionLockMenu.h" />

Static class that registers and unregisters the **Lock Selection** entry on the actor context menu via `UToolMenus`, driving [FNSelectionLock](selection-lock.md) across the current level editor selection.

It extends `LevelEditor.ActorContextMenu`. The Outliner's own context menu is registered as a menu derived from that one, so a single extension puts the entry on both an Outliner row right-click and a viewport right-click. The entry is a check item: it reads back the current lock state as well as setting it, and greys out when nothing in the selection can hold a lock.

Note that a locked actor cannot be right-clicked in a viewport — it has no hit proxy to hit — so in practice the Outliner is where a lock gets cleared.

## Public API

### Add Menu Entries

```cpp
/** Add the NEXUS section and its toggle to the actor context menu. */
static void AddMenuEntries();
```

### Remove Menu Entries

```cpp
/** Remove the NEXUS section from the actor context menu. */
static void RemoveMenuEntries();
```

This is editor-bootstrap glue — typical NEXUS users do not call into it directly; the tooling module installs the section on startup and removes it on shutdown.
