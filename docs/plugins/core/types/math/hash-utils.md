---
sidebar_position: 32
sidebar_label: Hash Utils
sidebar_class_name: type native-class
description: A collection of non-cryptographic hashing utilities.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Hash Utils

<TypeDetails icon="native-class" base="class" type="FNHashUtils" typeExtra="" headerFile="NexusCore/Public/Math/NHashUtils.h" />

A collection of non-cryptographic hashing utilities.

## Methods

### djb2

Produces a 64-bit hash of the supplied string using Dan Bernstein's djb2 algorithm.

:::warning

Not cryptographically secure; suitable for hash tables and non-security-sensitive identity checks.

:::

```cpp
/**
 * Produces a 64-bit hash of the supplied string using Dan Bernstein's djb2 algorithm.
 * @param InString The string to hash.
 * @return The 64-bit djb2 hash of InString.
 */
static uint64 dbj2(const FString& InString);
```
