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

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Count", Category = "NEXUS|Developer")
static int32 GetCurrentObjectCount()

UFUNCTION(BlueprintCallable, DisplayName = "Create UObject Snapshot", Category = "NEXUS|Developer")
static FNObjectSnapshot CreateObjectSnapshot()

UFUNCTION(BlueprintCallable, DisplayName = "Create UObject Snapshot Diff", Category = "NEXUS|Developer")
static FNObjectSnapshotDiff CreateSnapshotDiff(const FNObjectSnapshot& OldSnapshot, const FNObjectSnapshot& NewSnapshot, const bool bRemoveKnownLeaks = false)

UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Entry Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotEntrySummary(const FNObjectSnapshotEntry& Entry) 

UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotSummary(const FNObjectSnapshot& Snapshot)

UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Detailed Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotDetailedSummary(const FNObjectSnapshot& Snapshot)

UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Diff Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotDiffSummary(const FNObjectSnapshotDiff& Diff)

UFUNCTION(BlueprintCallable, DisplayName = "Get UObject Snapshot Diff Detailed Summary", Category = "NEXUS|Developer")
static FString GetObjectSnapshotDiffDetailedSummary(const FNObjectSnapshotDiff& Diff)

UFUNCTION(BlueprintCallable, DisplayName = "Output Snapshot To Log", Category = "NEXUS|Developer")
static void DumpSnapshotDiffToLog(const FNObjectSnapshotDiff& Diff)
	```