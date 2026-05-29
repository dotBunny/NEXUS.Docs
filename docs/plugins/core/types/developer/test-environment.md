---
sidebar_class_name: type native-struct
description: Shared world / game-instance fixture passed between NEXUS test latent commands.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Test Environment

<TypeDetails icon="native-struct" base="struct" type="FNTestEnvironment" typeExtra="" headerFile="NexusCore/Public/Developer/NTestEnvironment.h" />

The per-fixture state shared between NEXUS test latent commands. A single static instance lives on `FNTestUtils::Environment` and is populated by [FNTestLatentCommand_CreateWorld](test-latent-commands/test-latent-command-create-world.md) before the test body runs, then cleared by [FNTestLatentCommand_CleanupWorld](test-latent-commands/test-latent-command-cleanup-world.md) on teardown.

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `World` | `UWorld*` | The throwaway world the test is operating against. |
| `WorldContext` | `FWorldContext*` | The matching world context registered with `GEngine`. |
| `GameInstance` | `UGameInstance*` | The transient game instance owning `World`. |
| `bHasInitializedStackWalking` | `bool` | Set to `true` after `InitializeStackWalking()` runs once; guards repeat initialization across tests. |

## Methods

### Initialize Stack Walking

Calls `FPlatformStackWalk::InitStackWalking()` exactly once per process. Performance-test latent commands invoke this so the first symbolicated stack walk doesn't pay library-load cost mid-measurement.

```cpp
void InitializeStackWalking();
```

## See Also

- [Test Utils](test-utils.md) — owns the static `Environment` instance and the high-level world helpers.
