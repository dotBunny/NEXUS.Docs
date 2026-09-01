---
sidebar_class_name: type native-class
description: Mersenne Twister based FRandomStream-like API with some extras.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Mersenne Twister

<TypeDetails icon="native-class" base="class" type="FNMersenneTwister" typeExtra="" headerFile="NexusCore/Public/Math/NMersenneTwister.h" />

Mersenne Twister based `FRandomStream`-like API with some extras. Implements the `std::mt19937_64` engine to produce high-quality `uint64` random numbers. This is the deterministic random source you seed and own — directly in native code, or from Blueprint via the [Mersenne Twister Object](mersenne-twister-object.md) wrapper.

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
float FloatRange(const float MinimumValue = -MIN_flt, const float MaximumValue = MAX_flt);
void FloatRange(TArray<float>& OutArray, const int32 Count, const float MinimumValue = -MIN_flt, const float MaximumValue = MAX_flt, const int32 StartIndex = 0);

/** Returns a pseudo random double between 0 and 1. */
double Double();
void Double(TArray<double>& OutArray, const int32 Count, const int32 StartIndex = 0);

/** Generate a random double between minimum and maximum. */
double DoubleRange(const double MinimumValue = -MIN_dbl, const double MaximumValue = MAX_dbl);
void DoubleRange(TArray<double>& OutArray, const int32 Count, const double MinimumValue = -MIN_dbl, const double MaximumValue = MAX_dbl, const int32 StartIndex = 0);
```

### Integer

```cpp
/** Generate a pseudo random integer between minimum and maximum. */
int IntegerRange(const int MinimumValue = -MIN_int32, const int MaximumValue = MAX_int32);
void IntegerRange(TArray<int32>& OutArray, const int32 Count, const int32 MinimumValue = -MIN_int32, const int32 MaximumValue = MAX_int32, const int32 StartIndex = 0);

/** Generate a pseudo random unsigned integer between minimum and maximum. */
uint32 UnsignedIntegerRange(const uint32 MinimumValue = MIN_uint32, const uint32 MaximumValue = MAX_uint32);
void UnsignedIntegerRange(TArray<uint32>& OutArray, const int32 Count, const uint32 MinimumValue = MIN_uint32, const uint32 MaximumValue = MAX_uint32, const int32 StartIndex = 0);

/** Generates a pseudo random unsigned 64-bit integer spanning the full range of uint64. */
uint64 UnsignedInteger64();
```

`RandRange` overloads exist for each type as `FORCEINLINE` aliases to the corresponding `*Range` method.

### Vector

```cpp
/** Generates a pseudo random FVector using the provided per-component range. */
FVector Vector(const float MinimumRange = -MIN_flt, const float MaximumRange = MAX_flt);

/**
 * Generate a pseudo random unit-length FVector by rejection-sampling inside the unit sphere,
 * so each component lands in [-1, 1] with a statistically uniform distribution on the sphere.
 */
FORCEINLINE FVector VRand();
```

## Saving & Restoring State

A seed alone reproduces a sequence from its beginning. To resume a stream mid-way — a savegame, a deterministic replay, a repeatable test that starts partway through — capture the engine's *position* as well:

```cpp
/**
 * Captures the engine's current position so it can be restored to this exact point later.
 * @return a snapshot { InitialSeed, draw count } sufficient to reproduce the exact sequence from here.
 */
FNMersenneTwisterState SaveState() const;

/**
 * Restores the engine to a previously captured state by re-seeding and replaying.
 * @param State The snapshot produced by SaveState.
 * @return true if restored; false if State.DrawCount exceeds MaxRestoreDrawCount, leaving the engine unchanged.
 */
bool RestoreState(const FNMersenneTwisterState& State);
```

A snapshot is just the initial seed plus the number of draws taken since — it does not store the engine's internal 312-word state. `RestoreState` therefore re-seeds and **replays forward** with `discard()`, making it **O(DrawCount)**: cheap for a few thousand draws, expensive for hundreds of millions. Restore from a checkpoint rather than from a long-running stream where you can.

The replay is bit-identical across platforms and compilers, because both `std::mt19937_64` and `discard()` are fully specified by the standard. That is what makes a snapshot safe to persist in a savegame or ship in a bug report.

:::warning

`RestoreState` returns `false` and leaves the engine untouched when `State.DrawCount` exceeds `MaxRestoreDrawCount` (10<sup>18</sup>). That ceiling is not about overflow — a genuine workload would need centuries to reach it — but about a corrupt or hand-edited snapshot whose huge draw count would make the linear replay appear to hang. **Check the return value** rather than assuming a restore succeeded.

:::

### FNMersenneTwisterState

The snapshot struct, with a compact string form for logging and storage:

| Member | Type | Purpose |
| :-- | :-- | :-- |
| `InitialSeed` | `uint64` | The seed the engine was initialized with. |
| `DrawCount` | `uint64` | Exact number of engine draws taken since the seed was set. |

| Method | Returns |
| :-- | :-- |
| `IsValid()` | Whether this snapshot's draw count is within the bounds `RestoreState` will replay. Check it before trusting a snapshot you loaded from disk. |
| `ToString()` | A hexadecimal token of the form `"<SeedHex>-<DrawCountHex>"`. |
| `FromString(const FString&)` | Static. Parses a token produced by `ToString`, returning a **zeroed** snapshot when the token is malformed — so validate with `IsValid()` rather than assuming a parse succeeded. |

`FNMersenneTwisterState` is a plain native struct, so it cannot ride UE serialization or be shown in the editor. For that there is `FNMersenneTwisterFriendlyState` — a `BlueprintType` struct holding the same two values as an editable hex seed string and a plain draw count, suitable for a SaveGame, asset, or JSON payload. Convert at the native boundary with its `ToNative()` / `FromNative()` helpers.

## See Also

- [Mersenne Twister Object](mersenne-twister-object.md) — a `BlueprintType` `UObject` wrapper that owns one of these and exposes it to Blueprint.
- [Random](../random.md) — global access to the shared non-deterministic stream.
- [Seed Generator](seed-generator.md) — produce, parse, and convert seeds across numeric / hex / friendly forms.
