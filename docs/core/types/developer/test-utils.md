---
sidebar_class_name: type native-class
description: Helpers that standardise how NEXUS tests set up and tear down worlds and measure performance.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Test Utils

<TypeDetails icon="native-class" base="class" type="FNTestUtils" typeExtra="" headerFile="NexusCore/Public/Developer/NTestUtils.h" />

Helpers that standardise how NEXUS tests set up and tear down worlds and measure performance. These utilities are only meaningful inside the Low-Level Test framework and depend on its macros (`REQUIRE_MESSAGE`, `ADD_ERROR`). All methods are designed to be safely re-entrant — every world is disposed before the call returns.

## Performance Test Setup

`FNTestUtils` itself has no performance-test entry points. Stabilising the engine around a timed region is handled by a pair of latent automation commands, which the `N_TEST_PERF_*` macros add for you:

- [Test Latent Command: Pre Performance Test](test-latent-commands/test-latent-command-pre-performance-test.md) — warms up stack walking (via `FNTestUtils::Environment.InitializeStackWalking()`), forces a garbage-collection pass, flushes the log and visual-log streams, and streams in all resources, so one-time costs don't contaminate the measured region.
- [Test Latent Command: Post Performance Test](test-latent-commands/test-latent-command-post-performance-test.md) — forces a garbage-collection pass once the timed region finishes, so allocations made during the test don't leak into the next one.

## Methods

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
