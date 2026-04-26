---
sidebar_position: 20
sidebar_label: Test Object
sidebar_class_name: type native-class
description: A minimal, non-UObject carrier used by unit tests that need a simple, stack-allocatable payload.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Test Object

<TypeDetails icon="native-class" base="class" type="FNTestObject" typeExtra="" headerFile="NexusCore/Public/Developer/NTestObject.h" />

A minimal, non-UObject carrier used by unit tests that need a simple, stack-allocatable payload. Intentionally has no constructors, virtuals, or invariants — tests populate it directly.

## Properties

| Property | Type |
| :-- | :-- |
| `Counter` | `int` |
| `Message` | `FString` |
| `State` | `uint8` |

## See Also

- [Test UObject](test-uobject.md) — `UObject` variant for tests that need real GC / reflection paths.
- [Test Utils](test-utils.md) — world fixture and leak-check helpers.
