---
sidebar_position: 14
sidebar_label: Method Scope Timer
sidebar_class_name: type native-class
description: A scoped wall-clock timer that logs its elapsed duration when it falls out of scope.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Method Scope Timer

<TypeDetails icon="native-class" base="class" type="FNMethodScopeTimer" typeExtra="" headerFile="NexusCore/Public/Developer/NMethodScopeTimer.h" />

A scoped wall-clock timer that logs its elapsed duration when it falls out of scope. Place one of these on the stack at the top of a region you wish to time; its destructor will emit a single `LogNexusCore` line in milliseconds.

## Usage

```cpp
void FMyClass::DoWork()
{
    FNMethodScopeTimer Timer(TEXT("DoWork"));
    // ... work to measure ...
    // Logs "FNMethodScopeTimer(DoWork) took X ms." when Timer goes out of scope
}
```

## Constructor

```cpp
/**
 * Records the start time and caches a label used in the final log line.
 * @param InName Human-readable label included in the destructor log line.
 */
explicit FNMethodScopeTimer(const FString& InName);
```

## Methods

### Manual Stop

Freezes the captured end time immediately. Subsequent calls (including destruction) are no-ops. Useful when the region ends in a non-scope-aligned control flow.

```cpp
void ManualStop();
```

## See Also

- [Method Scope Object Diff](method-scope-object-diff.md) — UObject churn variant.
- [Test Scope Timer](test-scope-timer.md) — Low-Level Test integrated variant with a fail threshold.
