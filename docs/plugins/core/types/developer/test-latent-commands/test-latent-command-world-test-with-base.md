---
sidebar_position: 5
sidebar_label: Test Latent Command (World Test With Base)
sidebar_class_name: type native-class
description: Latent command whose callable receives both the active world and the owning FAutomationTestBase.
tags: [0.1.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command (World Test With Base)

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand_WorldTestWithBase" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand_WorldTestWithBase.h" />

Latent command that runs a `TFunction<void(UWorld*, FAutomationTestBase*)>` against the active world and the owning test instance, optionally inside an `FGCScopeGuard`. Combines [FNTestLatentCommand_WorldTest](test-latent-command-world-test.md) and [FNTestLatentCommand_WithBase](test-latent-command-with-base.md) for tests that need both fixtures.

## Constructor

```cpp
FNTestLatentCommand_WorldTestWithBase(
    TFunction<void(UWorld*, FAutomationTestBase*)> StaticMethod,
    const bool bDisableGC,
    FAutomationTestBase* TestPtr);
```

| Parameter | Description |
| :-- | :-- |
| `StaticMethod` | The callable to execute; receives the world and the test pointer. |
| `bDisableGC` | When `true`, the callable runs inside an `FGCScopeGuard`. |
| `TestPtr` | The owning automation test instance; forwarded into the callable. |

## See Also

- [FNTestLatentCommand_WorldTest](test-latent-command-world-test.md) — same world fixture without the test pointer.
- [FNTestLatentCommand_WithBase](test-latent-command-with-base.md) — same test pointer without a world.
