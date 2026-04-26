---
sidebar_position: 21
sidebar_label: Test UObject
sidebar_class_name: type ue-object
description: A minimal, hidden UObject used by tests that need a real UObject to exercise GC or reflection paths.
tags: [0.2.7]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Test UObject

<TypeDetails icon="ue-object" base="UObject" type="UNTestUObject" typeExtra="" headerFile="NexusCore/Public/Developer/NTestUObject.h" />

A minimal, hidden `UObject` used by tests that need a real `UObject` to exercise GC or reflection paths. Kept deliberately tiny and unreferenced so it can be created, collected, and inspected without dragging in gameplay dependencies. Not intended for gameplay use.

## Properties

| Property | Type |
| :-- | :-- |
| `Counter` | `int` |
| `Message` | `FString` |
| `State` | `uint8` |

## See Also

- [Test Object](test-object.md) — non-`UObject` variant for tests that don't need GC/reflection.
- [Test Utils](test-utils.md) — world fixture and leak-check helpers.
