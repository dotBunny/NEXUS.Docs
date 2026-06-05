---
description: The runtime World Assembly subsystem that drives in-game generation passes.
sidebar_class_name: type ue-world-subsystem
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# World Assembly Subsystem

<TypeDetails icon="ue-world-subsystem" base="UTickableWorldSubsystem" type="UNWorldAssemblySubsystem" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldAssemblySubsystem.h" />

`UNWorldAssemblySubsystem` is the game-only `UTickableWorldSubsystem` that hosts every World Assembly operation kicked off during play. It owns the per-player `ANWorldAssemblyRelay` actors, keeps a strong reference to every in-flight `UNAssemblyOperation` so build tasks don't get collected mid-pass, and acts as the `INAssemblyOperationOwner` for operations created via `Generate()`.

## Kicking Off Generation

```cpp
/**
 * Kick off a new generation pass with the supplied per-operation settings.
 * @param Settings Operation-level settings (seed, level-instance behavior); taken by reference so the caller can reuse the struct.
 */
UFUNCTION(BlueprintCallable, DisplayName="Generate", Category = "NEXUS|WorldAssembly")
void Generate(UPARAM(ref) FNAssemblyOperationSettings& Settings);
```

`Generate` is safe to call at any time — it does not gate on `IsReady()` or on any outstanding operation, so callers can queue work freely.

## Clearing

`Clear` is the counterpart to `Generate` — it tears down everything the subsystem assembled and returns it to an empty state.

```cpp
/**
 * Tear down every assembled object owned by the subsystem and return it to an empty state.
 * Cancels any in-flight operations, destroys every ANCellProxy in the world along with its streamed
 * level instance, destroys any actors previously enrolled via RegisterActorForCleanup, then empties
 * the tracked-actor list and broadcasts OnCleared.
 */
UFUNCTION(BlueprintCallable, DisplayName="Clear", Category = "NEXUS|WorldAssembly")
void Clear();
```

`Clear` does **not** destroy the per-player relays — those are tied to player-controller lifetime, not generation lifetime. In editor builds the global selection is cleared first so the typed-element registry does not assert on a stale handle after sub-level actors are torn down.

To have `Clear` also dispose of actors it didn't spawn, enroll them with `RegisterActorForCleanup`:

```cpp
/**
 * Track an externally-owned actor so it will be destroyed by the next Clear() pass.
 * Stored as a weak reference, so the actor is free to be destroyed by other systems first without
 * leaving a dangling entry. Safe to call repeatedly with the same actor — duplicates are ignored.
 */
UFUNCTION(BlueprintCallable, DisplayName="Register Actor For Cleanup", Category = "NEXUS|WorldAssembly")
void RegisterActorForCleanup(AActor* Actor);

/**
 * Stop tracking an actor for Clear()-driven destruction.
 * Call when the actor's lifetime is taken over elsewhere, or when it has already been destroyed and
 * the slot should be reclaimed early. A no-op if the actor was never registered.
 */
UFUNCTION(BlueprintCallable, DisplayName="Unregister Actor For Cleanup", Category = "NEXUS|WorldAssembly")
void UnregisterActorForCleanup(AActor* Actor);
```

Enrolled actors are held weakly, so an entry becomes inert rather than dangling if the actor is destroyed by another system first. Both calls tolerate a null actor.

## Per-Player Relays

The subsystem spawns one `ANWorldAssemblyRelay` per logged-in player controller. Relays carry per-player generation state (nearby cells, completion notifications) over the wire so a multiplayer session can coordinate generation results without every client redoing the work.

```cpp
/** @return Relay associated with the local player, or nullptr if it has not yet been spawned. */
UFUNCTION(BlueprintCallable, DisplayName="Get Local Relay", Category = "NEXUS|WorldAssembly")
ANWorldAssemblyRelay* GetLocalRelay() const;
```

## Readiness

```cpp
/**
 * @return true when the local procgen view is settled relative to the server.
 * @remark Server path: no operations are currently in flight.
 *         Client path: LocalRelay has replicated, the nearby-cell payload has been received,
 *         and no operations the client has been notified of are pending.
 * @note Does not gate Generate() — that can be called at any time regardless of this value.
 */
UFUNCTION(BlueprintCallable, DisplayName="Is Ready?", Category = "NEXUS|WorldAssembly")
bool IsReady();
```

Use `IsReady` for UI gating ("ready to start"), not as a precondition for issuing more work. It surfaces in Blueprint graphs as **Is Ready?**.

## Events

Three `BlueprintAssignable` dynamic multicast delegates broadcast the generation lifecycle transitions:

| Delegate | Fires When |
| :-- | :-- |
| `OnOperationStarted` | A new operation begins being tracked by the subsystem, immediately before its build is kicked off. |
| `OnOperationsCompleted` | The last tracked operation finishes (or is destroyed) — i.e. the tracked-operation set transitions from non-empty to empty. |
| `OnCleared` | A `Clear()` pass finishes, once tracked operations have been cancelled and all cell proxies in the world have been destroyed. |

Bind these to drive demo / sample logic that needs to react to "world is generated, you can start playing now" without polling.

## Useful Examples

### Hookup Actor Pool Subsystem
```cpp
UNWorldAssemblySubsystem* WorldAssemblySubsystem = UNWorldAssemblySubsystem::Get(InWorld);
UNActorPoolSubsystem* ActorPoolSubsystem = UNActorPoolSubsystem::Get(InWorld);
WorldAssemblySubsystem->OnCleared.AddDynamic(ActorPoolSubsystem, &UNActorPoolSubsystem::ReturnAllActors);
```