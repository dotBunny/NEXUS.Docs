---
sidebar_position: 13
sidebar_label: Random
sidebar_class_name: type native-class
description: A collection of random number generators.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Random

<TypeDetails icon="native-class" base="class" type="FNRandom" typeExtra="" headerFile="NexusCore/Public/NRandom.h" />

A collection of random number generators that is shared by every NEXUS plugin. Provides a single deterministic stream and a single non-deterministic stream — most NEXUS APIs (such as [`Weighted Integer Array`](collections/weighted-integer-array.md)) draw from these so that gameplay seeding stays consistent across systems.

## Static Members

### Deterministic

A deterministic random number generator backed by [`Mersenne Twister`](math/mersenne-twister.md).

:::warning

It is **super important** that values are called from this stream in a deterministic order. Any out-of-order draw will desynchronise every later sample.

:::

```cpp
/**
 * A deterministic random number generator.
 * @note It is SUPER important that values are called from this in a deterministic order.
 */
static FNMersenneTwister Deterministic;
```

### NonDeterministic

A non-deterministic random number generator that can be used at any time.

```cpp
/** A non-deterministic random number generator that can be used at any time. */
static FRandomStream NonDeterministic;
```
