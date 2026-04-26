---
sidebar_position: 34
sidebar_label: Seed Generator
sidebar_class_name: type native-class
description: Helpers for producing and converting seeds used by FNMersenneTwister.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Seed Generator

<TypeDetails icon="native-class" base="class" type="FNSeedGenerator" typeExtra="" headerFile="NexusCore/Public/Math/NSeedGenerator.h" />

Helpers for producing and converting seeds used by [`Mersenne Twister`](mersenne-twister.md). Supports three seed representations: raw 64-bit numeric, hexadecimal text, and human-friendly word-style strings. The `From`/`To` helpers convert between forms while sanitizing user input.

## Methods

### Validation

```cpp
/**
 * Determine if the provided seed is valid.
 * @param InHexSeed The FString to check if it is valid.
 * @return an indicator of the seeds' validity.
 */
static bool IsValidHexSeed(const FString& InHexSeed);
```

### Random Seeds

```cpp
/**
 * Returns a valid pseudo random seed to be used with FNMersenneTwister.
 * @return a numeric seed.
 */
static uint64 RandomSeed();

/**
 * Returns a valid pseudo random friendly seed.
 * @return A friendly seed string.
 */
static FString RandomFriendlySeed();
```

### Conversions

```cpp
/** Returns a valid numeric seed parsed from an arbitrary FString. */
static uint64 SeedFromString(const FString& InSeed);

/** Converts a friendly-format seed string back into a numeric seed. */
static uint64 SeedFromFriendlySeed(const FString& InSeed);

/** Returns a valid numeric seed parsed from a hexadecimal FString. */
static uint64 SeedFromHex(const FString& InHexSeed);

/** Returns the hexadecimal FString of the provided value. */
static FString HexFromSeed(const uint64 Seed);
```
