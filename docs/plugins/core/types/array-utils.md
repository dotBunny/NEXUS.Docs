---
sidebar_position: 7
sidebar_label: Array Utils
sidebar_class_name: type native-class
description: A collection of templated utility methods for working with TArrays.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Array Utils

<TypeDetails icon="native-class" base="class" type="FNArrayUtils" typeExtra="" headerFile="NexusCore/Public/NArrayUtils.h" />

A collection of templated utility methods for working with `TArrays`. All helpers are inlined, allocation-free (or minimally allocating), and C++-only.

## Methods

### Contains Any

Tests whether two arrays share at least one element.

```cpp
/**
 * Tests whether two arrays share at least one element.
 * @param Left The first array to test.
 * @param Right The second array to test.
 * @return true if any element in Right is also present in Left, false otherwise.
 */
template<typename T>
FORCEINLINE static bool ContainsAny(const TArray<T>& Left, const TArray<T>& Right);
```

### Is Same Ordered Values

Compares two arrays for equality, element-by-element and in the same order.

```cpp
/**
 * Compares two arrays for equality, element-by-element and in the same order.
 * @param Left The first array to compare.
 * @param Right The second array to compare.
 * @return true if both arrays have the same length and identical elements at matching indices.
 */
template<typename T>
FORCEINLINE static bool IsSameOrderedValues(const TArray<T>& Left, const TArray<T>& Right);
```

### Get Pointers Hash

Computes an order-independent hash derived from an array of pointers via XOR-combining.

:::warning

Because the combination is a bitwise XOR, duplicate pointers will cancel each other out.

:::

```cpp
/**
 * Computes an order-independent hash derived from an array of pointers.
 * @param Elements The pointers whose hashes should be combined.
 * @return A 32-bit hash produced by XOR-combining each pointer's GetTypeHash value.
 */
template<typename T>
FORCEINLINE static uint32 GetPointersHash(TArray<T*> Elements);
```

### Pin All

Pins an array of weak object pointers, producing strong pointers that keep the objects alive.

```cpp
/**
 * Pins an array of weak object pointers, producing strong pointers that keep the objects alive.
 * @param Objects The weak pointers to pin.
 * @return A matching array of TStrongObjectPtr values; entries corresponding to stale weak pointers will be null.
 */
FORCEINLINE static TArray<TStrongObjectPtr<UObject>> PinAll(TArray<TWeakObjectPtr<UObject>> Objects);
```
