---
sidebar_position: 33
sidebar_label: Mersenne Twister
sidebar_class_name: type native-class
description: Mersenne Twister based FRandomStream-like API with some extras.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Mersenne Twister

<TypeDetails icon="native-class" base="class" type="FNMersenneTwister" typeExtra="" headerFile="NexusCore/Public/Math/NMersenneTwister.h" />

Mersenne Twister based `FRandomStream`-like API with some extras. Implements the `std::mt19937_64` engine to produce high-quality `uint64` random numbers. Used as the deterministic random source by [`FNRandom::Deterministic`](../random.md).

## Constructor

```cpp
/** Construct a new FMersenneTwister with a specific seed. */
explicit FNMersenneTwister(const uint64 InSeed);
```

## Seeding

```cpp
/** Set seed of the FMersenneTwister. */
void Initialize(const uint64 Seed);

/** Reset the FMersenneTwister to the initial seed. */
void Reset();

/** Returns the seed that was last set. */
uint64 GetInitialSeed() const;

/** Returns the seed that was last set as a hexadecimal FString. */
FString GetSeedAsString() const;

/** Returns the number of times the FMersenneTwister has been called since the seed has been set. */
uint32 GetCallCounter() const;
```

## Sampling

### Bool

```cpp
/** Returns a pseudo random uniformly distributed bool value. */
bool Bool();

/** Returns an array of pseudo random bool values based on a coin-flip. */
void Bool(TArray<bool>& OutArray, const int32 Count, const int32 StartIndex = 0);

/** Returns a pseudo random bool value based on chance (0-1 roll). */
bool Bias(const float Chance);

/** Returns an array of pseudo random bool values based on chance (0-1 roll). */
void Bias(TArray<bool>& OutArray, const int32 Count, const float Chance, const int32 StartIndex = 0);
```

### Float / Double

```cpp
/** Returns a pseudo random float between 0 and 1. */
float Float();
void Float(TArray<float>& OutArray, const int32 Count, const int32 StartIndex = 0);

/** Generate a random float between minimum and maximum. */
float FloatRange(const float MinimumValue = MIN_flt, const float MaximumValue = MAX_flt);
void FloatRange(TArray<float>& OutArray, const int32 Count, const float MinimumValue = MIN_flt, const float MaximumValue = MAX_flt, const int32 StartIndex = 0);

/** Returns a pseudo random double between 0 and 1. */
double Double();
void Double(TArray<double>& OutArray, const int32 Count, const int32 StartIndex = 0);

/** Generate a random double between minimum and maximum. */
float DoubleRange(const double MinimumValue = MIN_dbl, const double MaximumValue = MAX_dbl);
void DoubleRange(TArray<double>& OutArray, const int32 Count, const double MinimumValue = MIN_dbl, const double MaximumValue = MAX_dbl, const int32 StartIndex = 0);
```

### Integer

```cpp
/** Generate a pseudo random integer between minimum and maximum. */
int IntegerRange(const int MinimumValue = MIN_int32, const int MaximumValue = MAX_int32);
void IntegerRange(TArray<int32>& OutArray, const int32 Count, const int32 MinimumValue = MIN_int32, const int32 MaximumValue = MAX_int32, const int32 StartIndex = 0);

/** Generate a pseudo random unsigned integer between minimum and maximum. */
uint32 UnsignedIntegerRange(const uint32 MinimumValue = MIN_uint32, const uint32 MaximumValue = MAX_uint32);
void UnsignedIntegerRange(TArray<uint32>& OutArray, const int32 Count, const uint32 MinimumValue = MIN_uint32, const uint32 MaximumValue = MAX_uint32, const int32 StartIndex = 0);

/** Generates a pseudo random unsigned 64-bit integer spanning the full range of uint64. */
uint64 UnsignedInteger64();
```

`RandRange` overloads exist for each type as `FORCEINLINE` aliases to the corresponding `*Range` method.

### Vector

```cpp
/** Generate a pseudo random normalized FVector (0-1). */
FVector VectorNormalized();

/** Generates a pseudo random FVector using the provided ranges. */
FVector Vector(const float MinimumRange = MIN_flt, const float MaximumRange = MAX_flt);

/** Generate a pseudo random normalized FVector. */
FORCEINLINE FVector VRand();
```

## See Also

- [Random](../random.md) — global access to the deterministic / non-deterministic streams.
- [Seed Generator](seed-generator.md) — produce, parse, and convert seeds across numeric / hex / friendly forms.
