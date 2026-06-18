---
sidebar_class_name: type native-class
description: A collection of random number generators.
tags: [0.1.0, 0.3.2]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Random

<TypeDetails icon="native-class" base="class" type="FNRandom" typeExtra="" headerFile="NexusCore/Public/NRandom.h" />

A collection of random number generators shared by every NEXUS plugin. It exposes a single process-wide **non-deterministic** stream through a static accessor, so any system can draw "just give me a random value" results from a common source. For **deterministic**, reproducible sequences you seed and own a [Mersenne Twister](math/mersenne-twister.md) instead.

## Access

### GetNonDeterministic

Returns a reference to the framework-wide `FRandomStream`, seeded once from the wall-clock the first time it is accessed. Use it for non-reproducible randomness that does not need to stay in sync across runs — for example the default source behind [`Weighted Integer Array`](collections/weighted-integer-array.md)'s `RandomValue()`.

```cpp
/** Access the shared non-deterministic random number generator. */
static FRandomStream& GetNonDeterministic();
```

:::warning Not thread-safe
`GetNonDeterministic()` returns a reference to a single shared `FRandomStream`, which is not internally synchronized — concurrent callers race on its seed. Only call it from the game thread, or guard access externally.
:::

## Deterministic Randomness

`FNRandom` no longer owns a shared deterministic stream. When you need reproducible results, construct and own a [Mersenne Twister](math/mersenne-twister.md) seeded from a known value, or use the Blueprint-friendly [Mersenne Twister Object](math/mersenne-twister-object.md) wrapper. Owning the stream keeps its call order — and therefore its sequence — explicit and local to your system, rather than depending on a global stream whose order every other system also perturbs.

```cpp
// Deterministic: you own the stream and its seed.
FNMersenneTwister Twister(FNSeedGenerator::SeedFromFriendlySeed(TEXT("MyFeature")));
const int32 Roll = Twister.IntegerRange(1, 6);
```

## See Also

- [Mersenne Twister](math/mersenne-twister.md) — the deterministic engine to seed and own per system.
- [Mersenne Twister Object](math/mersenne-twister-object.md) — a `BlueprintType` wrapper for holding a deterministic stream in Blueprint.
- [Seed Generator](math/seed-generator.md) — produce, parse, and convert seeds across numeric / hex / friendly forms.
