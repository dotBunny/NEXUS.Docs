---
sidebar_class_name: type native-class
description: Scene Outliner column showing which actors are selection-locked, and toggling that lock on click.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Selection Lock Column

<TypeDetails icon="native-class" base="ISceneOutlinerColumn" type="FNSelectionLockColumn" typeExtra="" headerFile="NexusToolingEditor/Public/SelectionLock/NSelectionLockColumn.h" />

The Scene Outliner column that surfaces [FNSelectionLock](selection-lock-state.md). It draws a padlock on locked rows, a faded one on hover, and toggles the lock when clicked.

The column registers itself as an available column type and then injects itself into the level editor's Outliner through the Scene Outliner module's actor-browser column delegate. It is visible by default and can be hidden from the Outliner's header dropdown like any built-in column; that choice persists per user. Its priority index places it immediately after the visibility gutter and the unsaved marker.

## Row Coverage

Only actor rows get a widget. Folder, level and world rows render blank, and so do unloaded **World Partition** actors, which have no components in memory for a lock to act on. Actors that pass `FNSelectionLock::CanLock` — meaning they have at least one primitive component — are the only ones offered a toggle.

Clicking the toggle on a row that is part of the current Outliner selection applies to the whole selection, matching how the visibility gutter beside it behaves. Clicking a row outside the selection affects only that row.

The column supports sorting, grouping by row type first so actors do not interleave with folders, then by lock state.

## Public API

### Register

```cpp
/** Register the column type and start injecting it into the level editor's Outliner. */
static void Register();
```

### Unregister

```cpp
/** Unregister the column type and stop injecting it. */
static void Unregister();
```

`Register` is only called when the `Selection Lock > Enabled` project setting is on. That setting is marked `ConfigRestartRequired` precisely because of how columns resolve: an Outliner builds its column map when it is constructed, so unregistering the type mid-session would leave the column sitting in any Outliner already open.

This is editor-bootstrap glue — typical NEXUS users do not call into it directly; the tooling module registers the column on startup and unregisters it on shutdown.
