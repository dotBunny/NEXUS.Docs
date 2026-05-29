---
description: A utility class providing functionality to support World Assembly operations.
sidebar_class_name: type ue-blueprint-function-library
tags: [0.3.0]
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

### Get Output Tags (ANCellLevelInstance)

Returns the output `FGameplayTagContainer` carried by the supplied `ANCellLevelInstance` — the tags that cell contributes to the surrounding generation context.

```cpp
/**
 * @param LevelInstance The cell level instance to read output tags from.
 * @return A reference to the level instance's output gameplay tags.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Output Tags (ANCellLevelInstance)")
static FGameplayTagContainer& GetOutputTagsFromCellLevelInstance(ANCellLevelInstance* LevelInstance);
```

The container is returned by reference, so reads reflect the live state of the level instance.