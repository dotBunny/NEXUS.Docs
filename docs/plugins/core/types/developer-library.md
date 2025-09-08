---
sidebar_position: 1
sidebar_label: Developer Library
sidebar_class_name: type ue-blueprint-function-library
description: A small collection of functionality to wrap the usage of developer tools.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Developer Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNDeveloperLibrary" typeExtra="" headerFile="NexusCore/Public/Developer/NDeveloperLibrary" />

A small collection of functionality to wrap the usage of developer tools.

## Debug

### Get UObject Count

Gets the current number of known `UObjects` by looking at the global `UObject` array, and subtracting the number of available spots.

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Count", Category = "NEXUS|Developer")
static int32 GetCurrentObjectCount()
```
## Snapshots

### Create UObject Snapshot

Captures a minimal data structure (`FNObjectSnapshotEntry`) about all currently known `UObjects`, recording:

:::info

If you are just looking to capture the current state of things to a file check out the `N.Developer.Snapshot` [console command](../console-commands.md).

:::


- Serial number
- Number of references
- Is it flagged for Garbage Collection?
- Is it part of a root set?
- It's name and full name where possible.
- A `TWeakObjectPtr` to the object.
  
:::warning

This process can cause a bit of a performance hit depending on the number of objects that you have currently created.

:::

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Create UObject Snapshot", Category = "NEXUS|Developer")
static FNObjectSnapshot CreateObjectSnapshot()
```

### Create UObject Snapshot Diff

Compares two already created `FNObjectSnapshots` to formulate a difference report of what changed.
```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Create UObject Snapshot Diff", Category = "NEXUS|Developer")
static FNObjectSnapshotDiff CreateSnapshotDiff(const FNObjectSnapshot& OldSnapshot, const FNObjectSnapshot& NewSnapshot, const bool bRemoveKnownLeaks = false)
```

### Get UObject Snapshot Entry Summary

Get an output-friendly `FString` of a `FNObjectSnapshotEntry` from a `FNObjectSnapshot`.

```
(0) [R] [G] Name /Path	
```

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Entry Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotEntrySummary(const FNObjectSnapshotEntry& Entry)
```

### Get UObject Snapshot Summary

Get an output-friendly `FString` that summarizes the contents of a `FNObjectSnapshot`.

```
Captured %i Objects (%i Untracked)
```

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotSummary(const FNObjectSnapshot& Snapshot)
```

### Get UObject Snapshot Detailed Summary

Get an output-friendly `FString` that contains a list of all `FNObjectSnapshotEntry` in a formatted manner.

```
Captured %i Objects (%i Untracked)
...
```

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Detailed Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotDetailedSummary(const FNObjectSnapshot& Snapshot)
```

### Get UObject Snapshot Diff Summary

Get an output-friendly `FString` that summarizes the number of changes found in a `FNObjectSnapshotDiff`.

```
Total %i (%i Changes | %i Previously Untracked | %i Currently Untracked) - Added %i / Maintained %i / Removed %i
```

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Diff Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotDiffSummary(const FNObjectSnapshotDiff& Diff)
```

### Get UObject Snapshot Diff Detailed Summary

Get an output-friendly `FString` that contains a list of all changes found in a `FNObjectSnapshotDiff` in a formatted manner.

```
Captured %i Objects (%i Changes)
Previously %i Untracked Objects | Currently %i Untracked Objects
Added (%i):
...
Maintained (%i)
...
Removed (%i):
...
```

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Diff Detailed Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotDiffDetailedSummary(const FNObjectSnapshotDiff& Diff)
```

### Output Snapshot To Log

Simple way to output the contents of a `FNOjectSnapshotDiff` to `LogNexus`.

```
[FNObjectSnapshotDiff::DumpToLog] Captured %i Objects (%i Changes)
Previously %i Untracked Objects | Currently %i Untracked Objects
Added (%i):
...
Maintained (%i)
...
Removed (%i):
...
```

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Output Snapshot To Log", Category = "NEXUS|Developer")
static void DumpSnapshotDiffToLog(const FNObjectSnapshotDiff& Diff)
```