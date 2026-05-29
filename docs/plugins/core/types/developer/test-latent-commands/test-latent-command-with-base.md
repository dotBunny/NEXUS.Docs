---
sidebar_class_name: type native-class
description: Latent command whose callable receives the owning FAutomationTestBase so it can ADD_ERROR.
tags: [0.3.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command (With Base)

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand_WithBase" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand_WithBase.h" />

Variant of [FNTestLatentCommand](test-latent-command.md) where the deferred callable receives the owning `FAutomationTestBase*`, so it can reach the standard automation assertion macros (`TestTrue`, `TestEqual`, `AddError`, ...) without capturing the test pointer in a lambda by side effect.

## Constructor

```cpp
FNTestLatentCommand_WithBase(
    TFunction<void(FAutomationTestBase*)> StaticMethod,
    FAutomationTestBase* TestPtr);
```

| Parameter | Description |
| :-- | :-- |
| `StaticMethod` | The callable to execute on the next automation tick; receives the test pointer. |
| `TestPtr` | The owning automation test instance; forwarded into the callable. |

## See Also

- [FNTestLatentCommand](test-latent-command.md) — no-arg variant for tests that don't need to assert from the deferred callback.
- [FNTestLatentCommand_WorldTestWithBase](test-latent-command-world-test-with-base.md) — same idea but also injects the active world.
