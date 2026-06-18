---
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint exposure layer for NEXUS collection types.
tags: [0.3.0, 0.3.2]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Collections Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNCollectionsLibrary" typeExtra="" headerFile="NexusCore/Public/NCollectionsLibrary.h" />

Blueprint exposure layer for NEXUS collection types. Wraps the inline native API of types declared under `Collections/` so they can be created, mutated, and queried from Blueprint graphs. Each entry here is a thin pass-through that exists only because the underlying method is defined on a struct (where `UFUNCTION` is not available) and therefore cannot be called from Blueprint directly. See the wrapped type's header for the full semantics.

## Weighted Integer Array

These functions wrap the [Weighted Integer Array](collections/weighted-integer-array.md) struct.

### Apply Preset

Replace the contents of `WeightedIntegerArray` with the (value, weight) pairs from `PresetValues`. The target array is emptied first, then each entry is inserted with its declared weight. Use this to populate a runtime weighted array from a `UDataAsset` / settings field authored as a compact map rather than a fully-expanded weighted array.

```cpp
UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Apply Preset")
static void WeightedIntegerArrayApplyPreset(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray, TArray<FIntVector2> PresetValues);
```

### Add Value

Insert `Weight` copies of `Value` into the weighted array.

```cpp
UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Add Value")
static void WeightedIntegerArrayAddValue(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray, const int32 Value, const int32 Weight);
```

### Empty

Clear every entry from the weighted array.

```cpp
UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Empty")
static void WeightedIntegerArrayEmpty(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray);
```

### Remove

Remove every copy of `Value` from the weighted array.

```cpp
UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Remove")
static void WeightedIntegerArrayRemove(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray, const int32 Value);
```

### Remove Some

Remove up to `Limit` copies of `Value` from the weighted array.

```cpp
UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Remove Some")
static void WeightedIntegerArrayRemoveSome(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray, const int32 Value, const int32 Limit = 1);
```

### Pickers

| Display Name | Stream | Removes Picked? |
| :-- | :-- | :-: |
| `Next Value` | Deterministic — supplied [`Mersenne Twister Object`](math/mersenne-twister-object.md) | No |
| `Next Value And Remove` | Deterministic — supplied Mersenne Twister Object | Yes |
| `Random Value` | Non-deterministic ([`FNRandom::GetNonDeterministic()`](random.md)) | No |
| `Random Value And Remove` | Non-deterministic | Yes |
| `Random One Shot Value` | One-shot `FRandomStream(Seed)` | No |
| `Random One Shot Value And Remove` | One-shot `FRandomStream(Seed)` | Yes |
| `Random Tracked Value` | `FRandomStream(Seed)` with `Seed` updated on return | No |
| `Random Tracked Value And Remove` | Tracked stream | Yes |

`Next Value` / `Next Value And Remove` take a [Mersenne Twister Object](math/mersenne-twister-object.md) and draw from its deterministic stream, so the caller owns the seed and call order. The `Random*` nodes use the shared non-deterministic stream and need no extra input.

```cpp
UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Next Value")
static int32 WeightedIntegerArrayNextValue(const FNWeightedIntegerArray& WeightedIntegerArray, UNMersenneTwisterObject* TwisterObject);

UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Random Value")
static int32 WeightedIntegerArrayRandomValue(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray);

UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Random One Shot Value")
static int32 WeightedIntegerArrayRandomOneShotValue(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray, const int32 Seed);

UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Random Tracked Value")
static int32 WeightedIntegerArrayRandomTrackedValue(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray, UPARAM(ref) int32& Seed);
```

### Queries

```cpp
UFUNCTION(BlueprintPure, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Has Data")
static bool WeightedIntegerArrayHasData(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray);

UFUNCTION(BlueprintPure, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Has Value")
static bool WeightedIntegerArrayHasValue(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray, const int32 Value);

UFUNCTION(BlueprintCallable, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Get Unique Values")
static TArray<int32> WeightedIntegerArrayGetUniqueValues(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray);

UFUNCTION(BlueprintPure, Category = "NEXUS|Collections|Weighted Integer Array", DisplayName = "Weighted Count")
static int32 WeightedIntegerArrayWeightedCount(UPARAM(ref) FNWeightedIntegerArray& WeightedIntegerArray);
```
