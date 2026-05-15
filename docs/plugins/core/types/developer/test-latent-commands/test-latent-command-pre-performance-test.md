---
sidebar_position: 9
sidebar_label: Test Latent Command (Pre Performance Test)
sidebar_class_name: type native-class
description: Prepares global state for low-noise performance measurement — stack walking, GC, log flush, streaming.
tags: [0.1.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command (Pre Performance Test)

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand_PrePerformanceTest" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand_PrePerformanceTest.h" />

Sets up the process so the next performance measurement reads cleanly:

1. Calls `FNTestEnvironment::InitializeStackWalking()` so the first symbolicated stack walk does not pay library-load cost mid-measurement.
2. Forces a `CollectGarbage(GARBAGE_COLLECTION_KEEPFLAGS)` so unrelated retention does not skew the heap.
3. Flushes `GLog` and `FVisualLogger` so log writes do not block during the run.
4. Calls `IStreamingManager::Get().StreamAllResources()` so streaming I/O does not interleave with the test body.

Pair with [FNTestLatentCommand_PostPerformanceTest](test-latent-command-post-performance-test.md) on teardown.

The constructor takes no parameters.

## See Also

- [FNTestLatentCommand_PostPerformanceTest](test-latent-command-post-performance-test.md) — matching teardown.
- [Test Utils](../test-utils.md) — `PrePerformanceTest()` / `PostPerformanceTest()` convenience wrappers.
