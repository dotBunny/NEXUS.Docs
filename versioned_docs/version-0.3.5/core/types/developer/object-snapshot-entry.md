---
sidebar_class_name: type native-struct
description: A single row within an FNObjectSnapshot, summarising one UObject at the moment of capture.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Object Snapshot Entry

<TypeDetails icon="native-struct" base="struct" type="FNObjectSnapshotEntry" typeExtra="" headerFile="NexusCore/Public/Developer/NObjectSnapshotEntry.h" />

A single row within a [`Object Snapshot`](object-snapshot.md), summarising one `UObject` at the moment of capture. Stores the minimum identifying information needed to recognise the same object in a later snapshot (pointer, serial number, names) alongside a few flags useful for leak diagnosis (root-set membership, garbage flag, ref count).

## Properties

| Property | Type | Description |
| :-- | :-- | :-- |
| `bIsRoot` | `bool` | True when the object was on the engine root set at snapshot time. |
| `bIsGarbage` | `bool` | True when the object was flagged for garbage collection at snapshot time. |
| `ObjectPtr` | `TWeakObjectPtr<UObject>` | Weak pointer to the captured object; may become invalid after garbage collection. |
| `SerialNumber` | `int32` | Serial number of the object's slot, used as an identity fallback when `ObjectPtr` is stale. |
| `RefCount` | `int32` | Reference count reported by the global object array at snapshot time. |
| `Name` | `FString` | Short name (`FName` as string) of the captured object. |
| `FullName` | `FString` | Full path name of the captured object, including outer chain. |

## Identity

The struct deliberately exposes **no equality operator**. [Object Snapshot Utils](object-snapshot-utils.md) keys entries by `ObjectPtr` when diffing, and because a `TWeakObjectPtr`'s identity is already the object's index *and* serial number, that key distinguishes objects — and survives garbage collection — without any separate serial-number comparison.

## Methods

### To String

Returns a single-line textual summary suitable for logs and diff output.

```cpp
/**
 * Returns a single-line textual summary suitable for logs and diff output.
 * @return A string encoding RefCount, Root/Garbage flags, and FullName.
 */
FString ToString() const;
```

```txt title="Snapshot Entry Line"
(0) [R] [G] Package /Script/DeveloperSettings
```

| Reference Count | Is Root Set? | Is Flagged For GC? | FullName |
|:--|:-:|:-:|:--|
|`(0)` | `[R]` | `[G]` | `Package /Script/DeveloperSettings` |

:::info

The *Reference Count* does not always seem to be accurate as polled from the `UObject`, and the *FullName* is replaced with the `FName` if the `UObject` is no longer valid.

:::
