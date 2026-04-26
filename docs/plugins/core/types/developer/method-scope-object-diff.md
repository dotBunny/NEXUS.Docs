---
sidebar_position: 13
sidebar_label: Method Scope Object Diff
sidebar_class_name: type native-class
description: A scoped helper that captures a UObject snapshot at construction and logs the diff at destruction.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Method Scope Object Diff

<TypeDetails icon="native-class" base="class" type="FNMethodScopeObjectDiff" typeExtra="" headerFile="NexusCore/Public/Developer/NMethodScopeObjectDiff.h" />

A scoped helper that captures a [`UObject Snapshot`](object-snapshot.md) at construction and logs the diff at destruction. Drop one of these onto the stack at the top of a function or code region to get a one-line summary of the objects created and removed during that scope.

:::warning

Taking two full UObject snapshots is expensive — use only in targeted debug sessions and do not leave enabled in shipped code.

:::

## Usage

```cpp
void FMyClass::DoExpensiveWork()
{
    FNMethodScopeObjectDiff Diff(TEXT("DoExpensiveWork"));
    // ... work that may allocate UObjects ...
    // Diff destructor logs Added/Maintained/Removed when scope exits
}
```

## Constructor

```cpp
/**
 * Captures a baseline UObject snapshot labelled with InName.
 * @param InName Human-readable label included in the destructor log line.
 */
explicit FNMethodScopeObjectDiff(const FString& InName);
```

## See Also

- [Method Scope Timer](method-scope-timer.md) — wall-clock timing variant.
- [Object Snapshot Utils](object-snapshot-utils.md) — the underlying snapshot/diff API.
