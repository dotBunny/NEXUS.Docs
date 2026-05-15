---
sidebar_position: 10
sidebar_label: Test Latent Command (Post Performance Test)
sidebar_class_name: type native-class
description: Forces garbage collection after a performance measurement so the next test starts clean.
tags: [0.1.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command (Post Performance Test)

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand_PostPerformanceTest" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand_PostPerformanceTest.h" />

The teardown half of a performance bracket. Calls `CollectGarbage(GARBAGE_COLLECTION_KEEPFLAGS)` so the subsequent test starts from a known-clean heap. Pair with [FNTestLatentCommand_PrePerformanceTest](test-latent-command-pre-performance-test.md).

The constructor takes no parameters.

## See Also

- [FNTestLatentCommand_PrePerformanceTest](test-latent-command-pre-performance-test.md) — matching setup.
- [Test Utils](../test-utils.md) — `PostPerformanceTest()` convenience wrapper.
