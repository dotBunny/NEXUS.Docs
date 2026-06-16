---
description: A utility class providing functionality to support World Assembly operations.
sidebar_class_name: type ue-blueprint-function-library
tags: [0.3.0, 0.3.1, 0.3.2, 0.3.5]
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

### Is HotPath

Returns whether the supplied cell lies on the assembly's hot path — that is, on *either* the shortest or sequential variant routed through the `NEXUS.WorldAssembly.Flag.Hotpath`-flagged cells. See [Tagging](../tagging.md#nexusworldassemblyflaghotpath) for how the hot path is resolved.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return true if this cell lies on the assembly's hot path.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Is HotPath")
static bool IsHotPath(ANCellLevelInstance* LevelInstance);
```

A companion `Is HotPath ?` node (`IsHotPathExec`) carries `meta = (ExpandBoolAsExecs="ReturnValue")`, so in Blueprint the result drives **True**/**False** execution pins directly instead of returning a bool to branch on.

### Is HotPath (Shortest)

Returns whether the cell lies specifically on the **shortest** hot-path variant — the spokes formed by the shortest path from the start cell to each goal.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return true if this cell lies on the shortest-path hot path (spokes from the start cell).
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Is HotPath (Shortest)")
static bool IsHotPathShortest(ANCellLevelInstance* LevelInstance);
```

As above, an `Is HotPath (Shortest) ?` exec-pin variant (`IsHotPathShortestExec`) is provided for branching directly in Blueprint.

### Is HotPath (Sequential)

Returns whether the cell lies specifically on the **sequential** hot-path variant — the nearest-first visiting chain that threads the goals in turn.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return true if this cell lies on the sequential hot path (nearest-first visiting chain).
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Is HotPath (Sequential)")
static bool IsHotPathSequential(ANCellLevelInstance* LevelInstance);
```

Likewise, an `Is HotPath (Sequential) ?` exec-pin variant (`IsHotPathSequentialExec`) is provided for branching directly in Blueprint.

### Get Junction World Size

Converts a [junction](junction-component.md)'s grid socket size into world units using the project's `Socket Size` / `Socket Depth` settings (see [Project Settings](../project-settings.md)).

```cpp
/**
 * @param JunctionComponent The junction whose socket size to convert.
 * @param bWithDepth When true, fills Z with the configured SocketDepth; otherwise Z stays 1.
 * @return The junction's world-space size (X,Y scaled from the socket grid; Z = depth when requested).
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Junction World Size")
static FVector GetJunctionWorldSize(UNCellJunctionComponent* JunctionComponent, bool bWithDepth = false);
```

### Get Junction World Size (Shifted)

A variant of [Get Junction World Size](#get-junction-world-size) that packs the result as `(Depth, X, Y)` — useful when the depth axis must lead — and applies a uniform `Scale` to all three components.

```cpp
/**
 * @param JunctionComponent The junction whose socket size to convert.
 * @param Scale Uniform multiplier applied to all three components.
 * @return A vector packed as (SocketDepth, world X, world Y), each scaled by Scale.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Junction World Size (Shifted)", meta=(ToolTip="Depth, X, Y"))
static FVector GetJunctionWorldSizeShifted(UNCellJunctionComponent* JunctionComponent, float Scale = 1.f);
```

### Get Junction World Corner Points

Returns the junction's four corner points in world space for a given socket size — handy for projecting PCG volumes, debug draws, or gameplay markers onto the opening.

```cpp
/**
 * @param JunctionComponent The junction to query.
 * @param SocketSize Socket size (in grid units) to project the corners for.
 * @return The junction's four corner points in world space for the given socket size.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Junction World Corner Points")
static TArray<FVector> GetJunctionWorldCornerPoints(UNCellJunctionComponent* JunctionComponent, const FVector2D& SocketSize);
```