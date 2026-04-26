---
sidebar_position: 12
sidebar_label: Level Utils
sidebar_class_name: type native-class
description: A collection of native utility methods for working with levels and level instances.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Level Utils

<TypeDetails icon="native-class" base="class" type="FNLevelUtils" typeExtra="" headerFile="NexusCore/Public/NLevelUtils.h" />

A collection of native utility methods for working with levels and level instances. These helpers are only accessible from C++ code; for Blueprint-callable equivalents see [Level Library](level-library.md).

## Methods

### Get Actor Level Instance

Walk up the attachment hierarchy of the supplied actor to find its owning level instance.

```cpp
/**
 * Walk up the attachment hierarchy of the supplied actor to find its owning level instance.
 * @param Actor The actor to trace back to a level instance.
 * @return The level instance the actor belongs to, or nullptr if the actor is not owned by one.
 */
static ILevelInstanceInterface* GetActorLevelInstance(const AActor* Actor);
```

### Get Actor Component Level Instance

Convenience accessor that resolves the owning level instance via the component's owning actor.

```cpp
/**
 * Convenience accessor that resolves the owning level instance via the component's owning actor.
 * @param ActorComponent The component whose owner's level instance should be returned.
 * @return The level instance the component's owner belongs to, or nullptr if there isn't one.
 */
FORCEINLINE static ILevelInstanceInterface* GetActorComponentLevelInstance(const UActorComponent* ActorComponent);
```

### Get All Map Names

Enumerates all known map package names reachable from the supplied search paths.

```cpp
/**
 * Enumerates all known map package names reachable from the supplied search paths.
 * @param SearchPaths A list of content-root relative paths (e.g. "/Game/Maps") to scan for maps.
 * @return An array of package names of all maps found underneath the search paths.
 */
static TArray<FString> GetAllMapNames(TArray<FString> SearchPaths);
```

### Determine Level Bounds

Calculates an axis-aligned bounding box that encompasses all relevant actors in a level.

```cpp
/**
 * Calculates an axis-aligned bounding box that encompasses all relevant actors in a level.
 * @param InLevel The level whose contents should be considered.
 * @param OutBounds The calculated bounds; reset on entry and grown by each included actor.
 * @param OutIgnoredActors Populated with the actors that were skipped during the calculation.
 * @param ActorIgnoreTags Any actor carrying one of these tags is ignored.
 * @param bIncludeEditorOnly If true, editor-only actors contribute to the bounds.
 * @param bIncludeNonColliding If true, non-colliding actors also contribute to the bounds.
 */
static void DetermineLevelBounds(ULevel* InLevel, FBox& OutBounds, TArray<const AActor*>& OutIgnoredActors,
  const TArray<FName>& ActorIgnoreTags, bool bIncludeEditorOnly = false, bool bIncludeNonColliding = false);
```
