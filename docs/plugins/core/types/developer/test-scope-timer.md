---
sidebar_position: 22
sidebar_label: Test Scope Timer
sidebar_class_name: type native-class
description: A scoped test-aware timer that integrates with the Low-Level Test framework.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Test Scope Timer

<TypeDetails icon="native-class" base="class" type="FNTestScopeTimer" typeExtra="" headerFile="NexusCore/Public/Developer/NTestScopeTimer.h" />

A scoped test-aware timer that integrates with the Low-Level Test framework. Like [`Method Scope Timer`](method-scope-timer.md) but with extra test-harness hooks: the measured duration is reported via `INFO()` and, if `MaxDurationMs` is exceeded, the enclosing test is failed with `ADD_ERROR()`. When enabled, an `FPlatformMisc` named event is emitted so the region is visible in profilers such as Unreal Insights.

## Constructor

```cpp
/**
 * Starts the timer, optionally emitting a named-event marker.
 * @param InName Human-readable label included in logs, the INFO line and the failure message.
 * @param MaxDurationMs Fail threshold in milliseconds. The test errors if the scope exceeds this.
 * @param bUseNamedEvent When true, wraps the scope in a FPlatformMisc named event for profilers.
 */
explicit FNTestScopeTimer(const FString& InName, const float MaxDurationMs = MAX_FLT, const bool bUseNamedEvent = true);
```

## Methods

### Manual Stop

Freezes the captured end time and closes the named event if one was opened. Subsequent calls (including destruction) are no-ops.

```cpp
void ManualStop();
```
