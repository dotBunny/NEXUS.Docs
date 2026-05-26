---
description: The runtime World Assembly subsystem that drives in-game generation passes.
title: Subsystem
---

# Subsystem

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

## Per-Player Relays

The subsystem spawns one `ANWorldAssemblyRelay` per logged-in player controller. Relays carry per-player generation state (nearby cells, completion notifications) over the wire so a multiplayer session can coordinate generation results without every client redoing the work.

```cpp
/** @return Relay associated with the local player, or nullptr if it has not yet been spawned. */
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
bool IsReady();
```

Use `IsReady` for UI gating ("ready to start"), not as a precondition for issuing more work.

## Events

Two `BlueprintAssignable` dynamic multicast delegates broadcast the operation-tracking transitions:

| Delegate | Fires When |
| :-- | :-- |
| `OnOperationStarted` | A new operation begins being tracked by the subsystem, immediately before its build is kicked off. |
| `OnOperationsCompleted` | The last tracked operation finishes (or is destroyed) — i.e. the tracked-operation set transitions from non-empty to empty. |

Bind these to drive demo / sample logic that needs to react to "world is generated, you can start playing now" without polling.

## Cancel & Teardown Safety

In-flight assembly tasks are forcibly cancelled and their virtual-world contexts cleared during:

- subsystem `Deinitialize` (world is being torn down),
- a PIE session ending,
- the level-editor cancellation button on a queued [list-view entry](process.md).

The cancel path stores back-pointers to the task graph and virtual world during operation startup so it can reset both during teardown, and runs a post-world cleanup on the operation registry so the registry doesn't keep referencing content that has just been torn down. Once-pending tasks that never got to run are dropped without firing their callbacks.
