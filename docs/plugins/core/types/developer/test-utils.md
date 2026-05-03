---
sidebar_position: 28
sidebar_label: Test Utils
sidebar_class_name: type native-class
description: Helpers that standardise how NEXUS tests set up and tear down worlds and measure performance.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Test Utils

<TypeDetails icon="native-class" base="class" type="FNTestUtils" typeExtra="" headerFile="NexusCore/Public/Developer/NTestUtils.h" />

Helpers that standardise how NEXUS tests set up and tear down worlds and measure performance. These utilities are only meaningful inside the Low-Level Test framework and depend on its macros (`REQUIRE_MESSAGE`, `ADD_ERROR`). All methods are designed to be safely re-entrant — every world is disposed before the call returns.

## Methods

### Pre/Post Performance Test

Prepares global state so a performance test can produce comparable, low-noise measurements. Initializes stack walking, forces a GC, and flushes the log/visual-log streams. The matching `Post` helper forces a GC so the next test starts clean.

```cpp
FORCEINLINE static void PrePerformanceTest();
FORCEINLINE static void PostPerformanceTest();
```

### World Test

Creates a throwaway `UWorld`, runs a test body against it, and tears everything down afterward. The world is fully booted through `InitializeActorsForPlay`/`BeginPlay` so it can host actor behavior, and is destroyed (along with its temporary `UGameInstance`) when the test body returns.

```cpp
/**
 * Creates a throwaway UWorld, runs a test body against it, and tears everything down afterward.
 * @param WorldType The EWorldType to create (typically Game or PIE).
 * @param TestFunctionality Callable that receives the created world and performs the test.
 * @param bDisableGarbageCollection Suppress GC for the duration of the test body when true.
 */
FORCEINLINE static void WorldTest(const EWorldType::Type WorldType,
  const TFunctionRef<void(UWorld* World)>& TestFunctionality,
  const bool bDisableGarbageCollection = false);
```

### World Test Checked

Runs a world test and asserts that no `UObjects` leaked across the scope. Captures a baseline snapshot, delegates to `WorldTest`, and then compares a post-test snapshot against the baseline. Any newly added objects are reported via `ADD_ERROR` and fail the test.

```cpp
/**
 * Runs a world test and asserts that no UObjects leaked across the scope.
 * @param WorldType The EWorldType to create for the world fixture.
 * @param TestFunctionality Callable that receives the created world and performs the test.
 * @param bShouldGarbageCollect Run GC between the test body and the leak check when true.
 */
FORCEINLINE static void WorldTestChecked(const EWorldType::Type WorldType,
  const TFunctionRef<void(UWorld* World)>& TestFunctionality,
  const bool bShouldGarbageCollect = true);
```

## See Also

- [Object Snapshot Utils](object-snapshot-utils.md) — underlying snapshot/diff API.
- [Test Scope Timer](test-scope-timer.md) — durations with a fail threshold.
