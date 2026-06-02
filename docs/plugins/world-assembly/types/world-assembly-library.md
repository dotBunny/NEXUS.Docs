---
description: A utility class providing functionality to support World Assembly operations.
sidebar_class_name: type ue-blueprint-function-library
tags: [0.3.0, 0.3.1, 0.3.5]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# World Assembly Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNWorldAssemblyLibrary" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldAssemblyLibrary.h" />

A utility class providing functionality to support World Assembly operations. Static helpers callable from both C++ and Blueprint contexts for seeding generation passes and reading the gameplay tags a placed cell contributes.

## UFunctions

### Get New Friendly Seed

Produces a human-friendly non-deterministic seed string that can be fed straight into a generation pass via the [World Assembly Subsystem](world-assembly-subsystem.md)'s `Generate()` call.

```cpp
/**
 * @return A freshly generated human-friendly seed string suitable for use as FNAssemblyOperationSettings::Seed.
 */
UFUNCTION(BlueprintPure, Category = "NEXUS|WorldAssembly", DisplayName="Get New Friendly Seed")
static FString GetNewFriendlySeed();
```

Internally this delegates to `FNSeedGenerator::RandomFriendlySeed()`, so the result is a readable token rather than an opaque number — handy for surfacing in UI or logs where a player or designer might want to share or re-enter the seed.

### Get Context Tags (ANCellLevelInstance)

Returns the context `FGameplayTagContainer` carried by the supplied `ANCellLevelInstance`.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return The context tags associated with the world assembly.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Context Tags (ANCellLevelInstance)")
static FGameplayTagContainer& GetContextTagsFromCellLevelInstance(ANCellLevelInstance* LevelInstance);
```

The container is returned by reference, so reads reflect the live state of the level instance.

### Get Assembly Tags (ANCellLevelInstance)

Returns the assembly `FGameplayTagContainer` that describes the cell itself, as opposed to the surrounding context tags above.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return The assembly tags describing the cell itself.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Assembly Tags (ANCellLevelInstance)")
static FGameplayTagContainer& GetAssemblyTagsFromCellLevelInstance(ANCellLevelInstance* LevelInstance);
```

Like the context tags, the container is returned by reference and reflects the live state of the level instance.

### Get Hex Seed (ANCellLevelInstance)

Returns the cell's seed formatted as a human-readable hexadecimal string, handy for surfacing in UI or logs alongside the friendly seed produced by [Get New Friendly Seed](#get-new-friendly-seed).

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return The cell's seed formatted as a human-readable hexadecimal string.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Hex Seed (ANCellLevelInstance)")
static FString GetHexSeedFromCellLevelInstance(ANCellLevelInstance* LevelInstance);
```

Internally this delegates to `FNSeedGenerator::HexFromSeed()` using the value returned by the level instance's `GetSeed()`.

### Get Node Identifier (ANCellLevelInstance)

Returns the identifier of the graph node this cell was assembled from, letting gameplay code trace a placed cell back to its position in the assembly graph.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return The identifier of the graph node this cell was assembled from.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Node Identifier (ANCellLevelInstance)")
static int32 GetNodeIdentifierFromCellLevelInstance(ANCellLevelInstance* LevelInstance);
```