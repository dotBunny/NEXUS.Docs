---
sidebar_position: 6
sidebar_label: Actor Utils
sidebar_class_name: type native-class
description: A collection of utility methods for working with actors, accessible from C++ only.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Utils

<TypeDetails icon="native-class" base="class" type="FNActorUtils" typeExtra="" headerFile="NexusCore/Public/NActorUtils.h" />

A collection of utility methods for working with actors. These helpers are only accessible from C++ code; for Blueprint-callable equivalents see [Actor Library](actor-library.md).

## Filter Settings

`FNWorldActorFilterSettings` configures actor collection in [`GetWorldActors`](#get-world-actors).

```cpp
/**
 * Filter criteria consumed by FNActorUtils::GetWorldActors when collecting actors from a UWorld.
 */
struct NEXUSCORE_API FNWorldActorFilterSettings
{
  /** When true, actors flagged as editor-only (AActor::IsEditorOnly) are skipped during iteration. */
  bool bExcludeEditorOnly = true;

  /** When true, actors whose AActor::GetActorEnableCollision() returns false are skipped. */
  bool bExcludeNonCollisionEnabledActors = false;

  /**
   * When true, APlayerStart actors are unconditionally included — they bypass the editor-only, collision, and predicate
   * filters. Useful when callers need spawn locations even though the player-start actor would otherwise be filtered out.
   */
  bool bIncludePlayerStarts = false;

  /**
   * Optional caller-supplied predicate evaluated per actor. Return true to keep the actor, false to exclude it.
   * @note Owned by value, so safe to assign a temporary lambda. Leave default-constructed (empty) to skip the predicate check entirely.
   */
  TFunction<bool(const AActor*)> ExclusionFunction;
};
```

## Methods

### Get Root Component From Default Object

Find the `RootComponent` (`USceneComponent`) on a default object.

:::warning

This has a flaw when navigating through the CDO of a Blueprint-generated class: the first found `USceneComponent` will be treated as the root. When combined with the [Actor Pool](../../actor-pools/index.mdx) system, that found component's scale is used as the base scale for the actor — do your actor-wide scaling on the root component.

:::

```cpp
/**
 * Find the RootComponent (USceneComponent) on a Default Object.
 * @param ActorClass The target class to search for the root component.
 * @return The root USceneComponent of the specified Actor class, or nullptr if none is found.
 */
static USceneComponent* GetRootComponentFromDefaultObject(const TSubclassOf<AActor>& ActorClass);
```

### Get World Actors

Collect every actor in a world that satisfies the supplied filter settings. Null and pending-kill actors are always skipped.

```cpp
/**
 * Collect every actor in the supplied world that satisfies the provided filter settings.
 * @param World The world to iterate. A null world yields an empty array.
 * @param Settings Filter criteria applied to each candidate actor (see FNWorldActorFilterSettings).
 * @return The set of actors that survived all filtering checks, in iteration order.
 * @note Null and pending-kill actors are always skipped. APlayerStart actors are short-circuited into the result when
 *       bIncludePlayerStarts is set, bypassing every other filter. Otherwise, an actor is kept only when it passes
 *       the editor-only and collision-enabled checks and (when set) the ExclusionFunction predicate.
 */
static TArray<AActor*> GetWorldActors(const UWorld* World, const FNWorldActorFilterSettings& Settings);
```
