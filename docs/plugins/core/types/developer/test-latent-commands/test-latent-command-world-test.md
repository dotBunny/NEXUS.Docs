---
sidebar_class_name: type native-class
description: Latent command whose callable receives the active FNTestEnvironment::World, optionally inside an FGCScopeGuard.
tags: [0.3.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command (World Test)

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand_WorldTest" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand_WorldTest.h" />

Latent command that runs a `TFunction<void(UWorld*)>` against the world stored on [FNTestEnvironment](../test-environment.md), optionally inside an `FGCScopeGuard` so garbage collection does not fire mid-test. Used by tests that need a booted world but do not need the owning `FAutomationTestBase*`.

## Constructor

```cpp
FNTestLatentCommand_WorldTest(
    TFunction<void(UWorld*)> StaticMethod,
    const bool bDisableGC);
```

| Parameter | Description |
| :-- | :-- |
| `StaticMethod` | The callable to execute; receives `FNTestUtils::Environment.World`. |
| `bDisableGC` | When `true`, the callable runs inside an `FGCScopeGuard`. |

## See Also

- [FNTestLatentCommand_CreateWorld](test-latent-command-create-world.md) — populates the world this command then consumes.
- [FNTestLatentCommand_WorldTestWithBase](test-latent-command-world-test-with-base.md) — same shape but also forwards the test pointer.
