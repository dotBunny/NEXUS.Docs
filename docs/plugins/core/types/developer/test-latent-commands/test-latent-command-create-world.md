---
sidebar_position: 6
sidebar_label: Test Latent Command (Create World)
sidebar_class_name: type native-class
description: Creates a fresh UWorld, registers a transient UGameInstance, and starts play on the shared FNTestEnvironment.
tags: [0.1.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command (Create World)

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand_CreateWorld" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand_CreateWorld.h" />

The fixture-setup half of NEXUS world-based tests. Creates a fresh `UWorld` named `NTestWorld` of type `EWorldType::Game`, drops any existing streaming levels, registers a transient `UGameInstance` against it, and runs `InitializeActorsForPlay` / `BeginPlay`. The resulting world, world-context, and game-instance are published on [FNTestEnvironment](../test-environment.md) (held statically on `FNTestUtils::Environment`) so subsequent latent commands can pick them up.

If the world cannot be created the constructor's `FAutomationTestBase*` records the failure via `AddErrorIfFalse`.

## Constructor

```cpp
FNTestLatentCommand_CreateWorld(FAutomationTestBase* TestPtr);
```

| Parameter | Description |
| :-- | :-- |
| `TestPtr` | The owning automation test; receives the failure message if world creation fails. |

## See Also

- [FNTestLatentCommand_CleanupWorld](test-latent-command-cleanup-world.md) — the matching teardown command.
- [FNTestLatentCommand_WorldTest](test-latent-command-world-test.md) — typical consumer of the world this command produces.
