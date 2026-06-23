---
sidebar_position: 5
description: Console commands and editor commandlets for developers, provided by World Assembly.
tags: [0.3.0]
---

# Console Commands

Some console commands for developers to use provided by `UNWorldAssemblySubsystem`.

| Command | Description | Flag(s) | Shippable|
|:--|:--|:--|:--|
|`N.WorldAssembly.Clear`| Tears down the existing worlds `ANCellProxy`, attempts to clear all registered `AActor` with the [UNWorldAssemblySubsystem](types/world-assembly-subsystem.md) for cleanup. | `ECVF_Default` | `Yes` |
|`N.WorldAssembly.Regenerate`| First, does the same as `N.WorldAssembly.Clear`, and then starts a new `UNAssemblyOperation` for all of the [Organ](types/organ-volume.md) in the world. | `ECVF_Default` | `Yes` |

## Editor Commandlets

Editor-only automation run from the command line (not available in shipping builds), intended for batch and CI use.

### Update Cell Data

`UNUpdateCellDataCommandlet` re-saves every [Cell](types/cell.md) asset so its cached side-car data reflects the current state of the cell's source world. For each `UNCell` it loads the referenced world, regenerates the cell data, and detects whether the cell's version changed — keeping checked-in cell data current without opening each level by hand.

```bash
UnrealEditor-Cmd.exe <Project>.uproject -run=NUpdateCellData [-ErrorOnChanges] [-CommitChanges]
```

| Switch | Description |
| :-- | :-- |
| `-ErrorOnChanges` | Logs out-of-date cells as errors and returns a non-zero exit code instead of updating them silently. Use this to **gate CI** — the job fails if any cell's cached data has drifted from its world. |
| `-CommitChanges` | Submits the updated cell assets to the project's configured source-control provider. |

The commandlet returns `0` on success, or non-zero if any cell was out-of-date (with `-ErrorOnChanges`), a world failed to load, or a commit failed.

The same operation is available interactively from the editor's **Update Cell Data** menu entry (under the NEXUS tools/commandlets menu). Run from the editor it prompts you to save dirty packages first (it swaps the active map as it loads each cell's world), then restores your current map when it finishes.