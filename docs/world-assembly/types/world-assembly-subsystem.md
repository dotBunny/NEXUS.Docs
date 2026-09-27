---
description: The runtime World Assembly subsystem that drives in-game generation passes.
sidebar_class_name: type ue-world-subsystem
---

import TypeDetails from '@site/src/components/TypeDetails';
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
 * level instance, destroys any actors previously enrolled via RegisterOperationActor, then empties
 * the tracked-actor list and broadcasts OnCleared.
 */
UFUNCTION(BlueprintCallable, DisplayName="Clear", Category = "NEXUS|WorldAssembly")
void Clear();
```

`Clear` does **not** destroy the per-player relays — those are tied to player-controller lifetime, not generation lifetime. In editor builds the global selection is cleared first so the typed-element registry does not assert on a stale handle after sub-level actors are torn down.

To have `Clear` also dispose of actors it didn't spawn, enroll them with `RegisterOperationActor`. Each actor is tracked under an **Operation Ticket** — the ticket of the operation that spawned it (`0`, the default, is the unassociated bucket) — so a single operation's actors can be torn down on their own without waiting for a full `Clear`:

```cpp
/**
 * Track an externally-owned actor under an Operation Ticket so it will be destroyed by the next Clear() pass, or
 * by a DestroyOperationActors call for that ticket.
 * Stored as a weak reference, so the actor is free to be destroyed by other systems first without leaving a
 * dangling entry. Safe to call repeatedly with the same actor — duplicates within a ticket are ignored.
 * @param OperationTicket Ticket of the operation that spawned the actor; 0 (the default) is the unassociated bucket.
 */
UFUNCTION(BlueprintCallable, DisplayName="Register Operation Actor", Category = "NEXUS|WorldAssembly")
void RegisterOperationActor(AActor* Actor, int32 OperationTicket = 0);

/**
 * Stop tracking an actor for Clear()-driven destruction, regardless of which ticket it was registered under.
 * Call when the actor's lifetime is taken over elsewhere, or when it has already been destroyed and
 * the slot should be reclaimed early. A no-op if the actor was never registered.
 */
UFUNCTION(BlueprintCallable, DisplayName="Unregister Operation Actor", Category = "NEXUS|WorldAssembly")
void UnregisterOperationActor(AActor* Actor);

/**
 * Stop tracking an actor for cleanup under a specific Operation Ticket — a direct-lookup alternative to
 * UnregisterOperationActor that avoids scanning every ticket bucket.
 * @param OperationTicket Ticket the actor was registered under; 0 (the default) is the unassociated bucket.
 */
UFUNCTION(BlueprintCallable, DisplayName="Unregister Operation Actor (By Ticket)", Category = "NEXUS|WorldAssembly")
void UnregisterOperationActorByTicket(AActor* Actor, int32 OperationTicket = 0);

/**
 * Destroy and stop tracking every actor enrolled under a single Operation Ticket, leaving other operations' actors untouched.
 * @param OperationTicket Ticket whose tracked actors should be torn down. A no-op if nothing was registered for it.
 */
UFUNCTION(BlueprintCallable, DisplayName="Destroy Operation Actors", Category = "NEXUS|WorldAssembly")
void DestroyOperationActors(int32 OperationTicket);
```

Enrolled actors are held weakly, so an entry becomes inert rather than dangling if the actor is destroyed by another system first. All calls tolerate a null actor.

## Per-Player Relays

The subsystem spawns one `ANWorldAssemblyRelay` per logged-in player controller. Relays carry per-player generation state (nearby cells, completion notifications) over the wire so a multiplayer session can coordinate generation results without every client redoing the work.

```cpp
/** @return Relay associated with the local player, or nullptr if it has not yet been spawned. */
UFUNCTION(BlueprintCallable, DisplayName="Get Local Relay", Category = "NEXUS|WorldAssembly")
ANWorldAssemblyRelay* GetLocalRelay() const;

/** Spawn an ANWorldAssemblyRelay bound to PlayerController and store it in RelayMap. */
UFUNCTION(BlueprintCallable, DisplayName="Spawn Relay", Category = "NEXUS|WorldAssembly")
void SpawnRelay(APlayerController* PlayerController);
```

Relays are spawned for you as players log in, so `Spawn Relay` is only needed when that automatic pass has been bypassed — most notably **after seamless travel**, where the server must re-spawn relays for controllers that carried over.

## Readiness

```cpp
/**
 * @param bWaitOnStreaming When true, also report not-ready while any level streaming is still in flight (see FNWorldUtils::IsStreaming). Pass false to ignore streaming and gate purely on operation/relay state.
 * @return true when the local WorldAssembly view is settled relative to the server.
 * @note Does not gate Generate() — that can be called at any time regardless of this value.
 */
UFUNCTION(BlueprintCallable, DisplayName="Is Ready?", Category = "NEXUS|WorldAssembly")
bool IsReady(bool bWaitOnStreaming = true);
```

Use `IsReady` for UI gating ("ready to start"), not as a precondition for issuing more work. It surfaces in Blueprint graphs as **Is Ready?**. By default (`bWaitOnStreaming = true`) it also stays not-ready until level streaming settles; pass `false` to skip that streaming check.

What "ready" means depends on the machine asking:

| Machine | Ready When |
| :-- | :-- |
| **Dedicated server** | No organs are queued for assembly, and no operations are in flight. |
| **Listen server or standalone** | As above, **and** the cells around the local player are ready, checked through its own [relay](world-assembly-relay.md) exactly as a client checks. |
| **Client** | Its relay has replicated, the server has answered its **latest** nearby-cells request, those cells' levels are loaded, and no operation it has been told about is pending. |

A host with a local player gets its relay at world begin play in every mode, whatever `Support Seamless Travel` is set to.

:::warning[Upgrading to 0.4.0: expect `Is Ready?` to return true later]

A listen server or standalone game used to count as ready once no operation was in flight. But an operation finishes when its cells have been **spawned** and their levels **requested**, so a host read as ready while every level was still loading. It also read as ready for the one tick between queueing organs and those becoming an operation. Both are fixed, and anything gating on `Is Ready?` (the `DEMO_NWorldAssembly` samples included) now waits for the cells to actually load.

:::

### Progress

```cpp
/** @return The ANCellLevelInstances around the local player still to sync, as (Remaining, Total); zero where there is no local relay (a dedicated server, or before the relay spawns). */
UFUNCTION(BlueprintCallable, DisplayName="Get Remaining Status", Category = "NEXUS|WorldAssembly")
FIntVector2 GetRemainingStatus();

UFUNCTION(BlueprintCallable, DisplayName="Get Operation Progress", Category = "NEXUS|WorldAssembly")
float GetOperationProgress() const;
```

There are two progress readouts, answering different questions:

- **`Get Remaining Status`** counts cells still to sync around the local player as `(Remaining, Total)`, which is usable directly as a loading-bar fraction. It works on a client, and on a host with a local player, through the local relay. Both values are zero wherever there is no local relay: on a dedicated server, and on a client before its relay has replicated. A zero `Total` therefore means "not applicable yet", not "complete", so pair it with [`IsReady`](#readiness).
- **`Get Operation Progress`** is the combined progress, `0..1`, of the assembly operations **in flight**, or `-1` when none is running. On a client it reflects what the server last reported through the relay, which is at most four updates a second and only for a change of at least 1%. Use it for the "generating" half of a loading screen, and `Get Remaining Status` for the "streaming in" half.

### Did It Fail?

```cpp
bool GetFailedOperationResult(FNAssemblyOperationResult& OutResult) const;
```

Returns `true` when an operation has **finished without success** (a required organ left unsatisfied) since the world began play or was last [cleared](#clearing), and fills `OutResult` with the most recent one. It also works on a **client**: the server sends each operation's result to every relay just before announcing it finished, and on a client only the result's title and message come across.

A cancelled operation is **not** a failure. Cancelling is deliberate, whether through `Clear()` or the world ending.

Before 0.4.0 an operation's result was lost as soon as it finished, since the operation is torn down straight after, so nothing outside the subsystem could tell a failed generation from a successful one. A loading screen can now show *"generation failed"* instead of waiting forever.

:::note

`GetFailedOperationResult` is **C++ only**. It is not a `UFUNCTION`. A Blueprint loading screen needs a small C++ wrapper to read it.

:::

## Junction Connectors

A [connector](cell-junction-connector.md) spans **two** cells, and cells stream in asynchronously. That makes it impossible to spawn one when its pairing is produced: at that point neither junction component exists, so there is nothing to connect and no way to resolve the junction-level overrides that live on those components.

The subsystem is what bridges that gap. [`FNSpawnJunctionConnectorsTask`](../architecture/tasks.md#junction-connecting) hands it every accepted pairing, and it builds each one once **both** ends have reported in.

```cpp
/** Record a junction pairing the connector pass accepted, to be built once both of its cells are live. */
void RegisterPendingJunctionConnector(const FNCellJunctionConnection& Connection);

/** Report a junction that the connector pass paired as live and ready to be connected. */
void RegisterJunctionConnectorEndpoint(UNCellJunctionComponent* CellJunction);

/** Withdraw a junction from its connector pairing, destroying the connecting actor if one was built. */
void UnregisterJunctionConnectorEndpoint(const UNCellJunctionComponent* CellJunction);

/** @return true if at least one connector pairing is waiting on its endpoints or on a spawn slice. */
bool HasPendingJunctionConnectors() const;
```

Native-only — none of these are `UFUNCTION`s, and you should not need to call them yourself. Junctions register and unregister themselves.

### Build Sequence

1. `RegisterPendingJunctionConnector` records the [pairing](cell-junction-connection.md), including the route proved clear for it, keyed by its `ConnectorIdentifier`.
2. Each paired junction calls `RegisterJunctionConnectorEndpoint` on its own `BeginPlay`. A junction whose link details name no connector pairing is ignored.
3. The **second** endpoint to arrive moves the pairing onto the spawn queue; the first simply waits.
4. The queue drains **time-sliced** against `Junction Time Slice` (see [Project Settings](../project-settings.md)), the same budget filler spawning uses.
5. `UnregisterJunctionConnectorEndpoint` — most often triggered by a cell streaming out — destroys the connector actor but **keeps the pairing**, so it is rebuilt if that cell streams back in.

:::note[Keyed by Connector Identifier, Not by Junction]

The pending-pairing map is keyed on `ConnectorIdentifier` because that is the only key both ends agree on. Node identifiers restart per assembly graph, and a pairing can span graphs. See [Cell Junction Connection](cell-junction-connection.md#ordering).

:::

### Resolving Which Connector to Spawn

When a pairing is built, the subsystem walks a priority chain and takes the first level that yields an eligible entry:

1. The **start** junction's [`Connectors`](junction-component.md#connectors).
2. The **end** junction's `Connectors`.
3. The organ that placed the **start** cell ([`UNOrganComponent::Connectors`](organ-component.md#connectors)).
4. The organ that placed the **end** cell.
5. The project-wide `Junction Default Connector`.

Within a list, entries are gated by their context-tag and tag-counter constraints against the owning cell's assembly state, then one is picked weighted-at-random — the same selection [fillers](junction-component.md#fillers) use. The winning entry's `Offset` is applied relative to the start junction's frame.

If nothing is authored and the default is unset or unloaded, no connector is spawned. See [Cell Junction Connector Entry](cell-junction-connector-entry.md) for the authoring surface.

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
