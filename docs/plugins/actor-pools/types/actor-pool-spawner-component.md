---
sidebar_class_name: type ue-scene-component
description: A fundamental spawning component which will interact with the NActorPoolSubsystem to periodically spawn defined AActors in predefined distributions (shapes).
---

import TypeDetails from '@site/src/components/TypeDetails';

# Actor Pool Spawner Component

<TypeDetails icon="/assets/svg/actor-pools/actor-pool-spawner-component.svg" iconType="img" base="USceneComponent" type="UNActorPoolSpawnerComponent" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolSpawnerComponent.h" />

A fundamental spawning component which will interact with the [UNActorPoolSubsystem](actor-pool-subsystem.md) to periodically spawn defined `AActors` in predefined distributions (shapes).

![UNActorPoolSpawnerComponent](/assets/images/docs/plugins/actor-pools/types/actor-pool-spawner-component.webp)

:::warning

This is a rudimentary example of how to spawn things; it has some use cases in a shipping game, but should not be the primary spawning source.

:::

## Component Settings

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Spawning Enabled | `bool` | Is the component going to Spawn enemies when ticked? | `true` |
| Server Authoritative | `bool` | Should the spawner only spawn on servers, ignoring itself on client-only. | `true` |
| Spawn Rate | `float` | The rate at which things should be spawned. | `0.5f` |
| Offset | `FVector` | Offset from the component location to treat as the origin when calculating a position to spawn an `AActor`. | `(0,0,0)` |
| Distribution | `ENActorPoolSpawnerDistribution`  | The specific distribution-shape to use when selecting a point/location to spawn an `AActor` at. | `Point` |
| Distribution Range | `FVector` | The axis-based ranges to use when outlining the shape's size, and/or any sort of exclusionary range. | `(1.f,20.f,20.f)`|
| Spline Level Reference | `FComponentReference` | When `Spline` is selected as `Distribution`, this option will be visible to select a SplineComponent in the current level. | `nullptr` |
| Spline Component Name | `FName` | Name of a `USplineComponent` to bind to when the spawner lives inside a Blueprint, resolved during `BeginPlay()`. Use this instead of `Spline Level Reference` in that case — see below. | `None` |
| Count | `int32` | The number of items to spawn at any given spawn event. | `1` |
| Randomize Seed | `bool` | Should a random seed be selected on `BeginPlay()` for this component?| `false` |
| Seed | `int32` | The seed used for all random selection related to this component. | `0` |
| Templates | `TArray<FNActorPoolSpawnerTemplate>` | A weighted collection of `AActors` and their default [FNActorPoolSettings](actor-pool-settings.md) for usage with the component. | `Empty` |

### Choosing A Spline

The two spline properties are not interchangeable, and only one applies at a time:

- **`Spline Level Reference`** uses a component picker and is only shown while `Distribution` is `Spline`. It can point at a spline on any actor already placed in the level.
- **`Spline Component Name`** is `EditDefaultsOnly` and takes a plain name. Use it when the spawner and its spline live together inside a Blueprint, where there is no level instance to pick from at author time — the component resolves the name to a `USplineComponent` during `BeginPlay()`.

### Templates

Each entry in `Templates` is an `FNActorPoolSpawnerTemplate`:

| Field | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Template | `TSubclassOf<AActor>` | The actor class to spawn. | `(None)` |
| Settings | `FNActorPoolSettings` | The [pool settings](actor-pool-settings.md) associated with this actor class. | `(defaults)` |
| Weight | `int32` | Relative weight of this entry when the spawner selects a template. | `1` |

## Distribution Types

| Native | Display | Description |
| :-- | :-- | :-- |
| `Point` | Point | Always spawn at the given component's location + `Offset`. | 
| `Radius` | Radius | Selects a point at the given component's location + `Offset`, with a minimum radius of `DistributionRange.X` and a maximum radius of `DistributionRange.Y` on the horizontal axis. |
| `Sphere` | Sphere | Selects a point at the given component's location + `Offset`, in a sphere, with a minimum radius of `DistributionRange.X` and a maximum radius of `DistributionRange.Y`. | 
| `Box` | Box | Selects a point at the given component's location + `Offset`, in an axis-aligned box, using the `DistributionRange` for size. |
| `Spline` | Spline | Selects a point along the target spline — `SplineLevelReference` for a spline placed in the level, or `SplineComponentName` for one inside the same Blueprint.  | 

## UFunctions

The methods exposed to Blueprint.

### Spawn

```cpp
/**
  * Initiate a spawn call for the component, ignoring any timers.
  * @param bIgnoreSpawningFlag Should the internal spawning flag state be ignored?
  */
void Spawn(bool bIgnoreSpawningFlag = false);
```

### Disable Spawning

```cpp
/**
  * Disables the component's internal flag to stop any spawning from occurring.
  */
void DisableSpawning()
```

### Enable Spawning

```cpp
/**
  * Enables the component's internal flag to allow spawning to occur (on by default).
  */
void EnableSpawning()
```