---
sidebar_position: 7
sidebar_label: Test Latent Command (Cleanup World)
sidebar_class_name: type native-class
description: Tears down the FNTestEnvironment world and game instance created by Create World.
tags: [0.1.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command (Cleanup World)

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand_CleanupWorld" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand_CleanupWorld.h" />

The matching teardown for [FNTestLatentCommand_CreateWorld](test-latent-command-create-world.md). Calls `EndPlay(Quit)`, removes the world context from `GEngine`, destroys the world, and marks the transient `UGameInstance` as garbage. The `World`, `WorldContext`, and `GameInstance` slots on [FNTestEnvironment](../test-environment.md) are then nulled so a subsequent test starts from a clean slate.

The constructor takes no parameters — it operates entirely on the shared static `FNTestUtils::Environment`.

## See Also

- [FNTestLatentCommand_CreateWorld](test-latent-command-create-world.md) — the fixture-setup half.
