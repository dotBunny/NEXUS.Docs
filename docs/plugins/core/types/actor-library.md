---
sidebar_position: 5
sidebar_label: Actor Library
sidebar_class_name: type ue-blueprint-function-library
description: A utility class providing core functions and operations for Actors.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNActorLibrary" typeExtra="" headerFile="NexusCore/Public/NActorLibrary.h" />

A utility class providing core functions and operations for Actors. Static helpers callable from both C++ and Blueprint contexts for common Actor manipulation, comparison, and management tasks.

## UFunctions

### Is Same Actors

Compares two arrays of actors to determine if they contain the same actors regardless of order.

```cpp
/**
 * Compares two arrays of actors to determine if they contain the same actors.
 * @param A The first array of actors to compare.
 * @param B The second array of actors to compare.
 * @return True if both arrays contain the same set of actors (regardless of order), false otherwise.
 * @note This function checks if both arrays have the same length and contain the same actor references,
 *       regardless of their order in the arrays. Each actor in array A must only have exactly one matching
 *       actor in array B, and vice versa.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|Actor", DisplayName = "Is Same Actors")
static bool IsSameActors(const TArray<AActor*>& A, const TArray<AActor*>& B);
```

### To Actor Array

Converts an array of `UObject` pointers to an array of `AActor` pointers, dropping any entries that are not actors.

```cpp
/**
 * Converts an array of UObject pointers to an array of AActor pointers.
 * @param InObjects The array of UObject pointers to convert.
 * @return An array of AActor pointers containing only the actors from the input array.
 * @note This function iterates through the input array and casts each UObject pointer to AActor.
 *       Only valid AActor pointers are added to the output array.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|Actor", DisplayName = "To Actor Array")
static TArray<AActor*> ToActorArray(const TArray<UObject*> InObjects);
```

## See Also

- [Actor Utils](actor-utils.md) — native-only counterparts not exposed to Blueprint.
