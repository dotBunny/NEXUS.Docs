---
sidebar_class_name: type native-class
description: Yields the automation queue for a fixed number of frames before the test resumes.
tags: [0.3.0]
---

import TypeDetails from '../../../../../../src/components/TypeDetails';

# Test Latent Command (Frame Wait)

<TypeDetails icon="native-class" base="IAutomationLatentCommand" type="FNTestLatentCommand_FrameWait" typeExtra="" headerFile="NexusCore/Public/Developer/TestLatentCommands/NTestLatentCommand_FrameWait.h" />

Yields the automation queue for `FramesToWait` ticks before reporting completion. Useful when a test needs world state to settle (physics, async load, replication) before the next command runs. The internal counter resets when the command completes, so the same instance can be reused.

## Constructor

```cpp
explicit FNTestLatentCommand_FrameWait(const int32 FramesToWait);
```

| Parameter | Description |
| :-- | :-- |
| `FramesToWait` | Number of automation ticks to skip before the next command runs. |
