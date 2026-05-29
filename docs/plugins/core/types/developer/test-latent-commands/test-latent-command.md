---
sidebar_class_name: type native-class
description: Runs a captured TFunction once on the automation thread, then completes.
tags: [0.3.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand.h" />

The base shape of the NEXUS test latent commands: takes a `TFunction<void()>`, runs it once when the automation framework next polls `Update()`, and returns `true` to remove itself from the queue. Used when a test needs to defer work until a later frame but does not need access to the active world or the owning `FAutomationTestBase*`.

## Constructor

```cpp
FNTestLatentCommand(TFunction<void()> StaticMethod);
```

| Parameter | Description |
| :-- | :-- |
| `StaticMethod` | The callable to execute on the next automation tick. |

## See Also

- [FNTestLatentCommand_WithBase](test-latent-command-with-base.md) — same shape, but the callable receives the owning `FAutomationTestBase*` so it can `ADD_ERROR`.
- [FNTestLatentCommand_WorldTest](test-latent-command-world-test.md) — variant that injects the active world.
