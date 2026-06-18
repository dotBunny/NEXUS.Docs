---
sidebar_class_name: type ue-object
description: A BlueprintType UObject wrapper that owns an FNMersenneTwister, exposing a seedable deterministic random stream to Blueprint.
tags: [0.3.2]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Mersenne Twister Object

<TypeDetails icon="ue-object" base="UObject" type="UNMersenneTwisterObject" typeExtra="" headerFile="NexusCore/Public/Math/NMersenneTwisterObject.h" />

A `BlueprintType` `UObject` wrapper that owns a [Mersenne Twister](mersenne-twister.md), letting Blueprint hold and sample a deterministic random stream over a wider scope than a single native call site. New instances seed themselves from the non-deterministic [Random](../random.md) stream, so unseeded objects still differ per run; call `Seed` with a friendly seed string to make the stream deterministic.

## What It Is

- **GC-managed twister**: owns its `FNMersenneTwister` for the lifetime of the `UObject`, releasing it when the object is destroyed.
- **Blueprint surface**: `BlueprintCallable` seeding and sampling methods on a `BlueprintType` object that graphs can store and pass around.
- **Sampling currency**: handed to the range libraries ([Integer](integer-range-library.md), [Float](float-range-library.md), [Double](double-range-library.md)) as the deterministic source for their `Next Value` style nodes.

## What It Does

- **Seeding**:
  - `Seed(FString)`: re-seeds the owned twister from a human-friendly seed string (see [Seed Generator](seed-generator.md)).
- **Sampling**:
  - `Bool()`: returns a pseudo random uniformly distributed bool value.
  - `Bools(Count)`: returns an array of `Count` pseudo random coin-flip bool values.
  - `Integer(MinimumValue, MaximumValue)`: generates a pseudo random integer between the two values (inclusive).
- **Native access**:
  - `GetTwister()` / `GetTwisterRef()`: return the owned `FNMersenneTwister` for native callers.

## Creation

```cpp title="Creating a seeded Mersenne Twister Object"
UNMersenneTwisterObject* TwisterObject = NewObject<UNMersenneTwisterObject>(this);
TwisterObject->Seed(TEXT("HelloWorld"));
```

:::warning
`GetTwister()` / `GetTwisterRef()` expose the internally owned twister; do not cache the pointer or reference beyond the lifetime of the owning object, as garbage collection releases the twister with it.
:::

## See Also

- [Mersenne Twister](mersenne-twister.md) — the underlying deterministic engine and its full sampling API.
- [Seed Generator](seed-generator.md) — produce, parse, and convert seeds across numeric / hex / friendly forms.
- [Random](../random.md) — global access to the shared non-deterministic stream.
