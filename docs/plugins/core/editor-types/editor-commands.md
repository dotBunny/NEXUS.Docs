---
sidebar_position: 8
sidebar_label: Editor Commands
sidebar_class_name: type native-class
description: Editor command bindings used by the NexusCoreEditor to inject help, bug-report, and documentation menu items.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor Commands

<TypeDetails icon="native-class" base="TCommands<FNEditorCommands>" type="FNEditorCommands" typeExtra="" headerFile="NexusCoreEditor/Public/NEditorCommands.h" />

Editor command bindings used by the `NexusCoreEditor` to inject help, bug-report, and documentation menu items into the main editor menu bar.

## Methods

### Register Commands

```cpp
virtual void RegisterCommands() override;
```

### Menu Lifecycle

```cpp
/** Inserts NEXUS help entries into the main editor menu. */
static void AddMenuEntries();

/** Removes NEXUS help entries from the main editor menu. */
static void RemoveMenuEntries();

/** Builds the NEXUS help submenu shown inside the editor's Help menu. */
static void GenerateHelpSubMenu(UToolMenu* Menu);
```

### Help Handlers

| Handler | Action |
| :-- | :-- |
| `OnHelpOverwatch` | Opens the Overwatch development dashboard. |
| `OnHelpIssues` | Opens the public NEXUS Issues list. |
| `OnHelpBugReport` | Opens the NEXUS bug-report form. |
| `OnHelpDiscord` | Opens the NEXUS Discord. |
| `OnHelpRoadmap` | Opens the NEXUS public roadmap. |
| `OnHelpDocumentation` | Opens the NEXUS documentation site. |
