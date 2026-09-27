---
sidebar_class_name: type ue-actor
description: Per-player networking helper spawned by the World Assembly subsystem, carrying operation events and nearby-cell queries.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Assembly Relay

<TypeDetails icon="ue-actor" base="AActor" type="ANWorldAssemblyRelay" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldAssemblyRelay.h" />

The server's per-player handle. One relay exists invisibly for every player controller, and it is how World Assembly crosses the network: the server pushes operation lifecycle events into it, and the client asks it *"what cells are around me right now?"*.

This is why a client never generates anything. Generation runs on the authority; the relay carries the results and the notifications.

:::note

`NotPlaceable`, `Hidden`, `HideDropdown`, and **`Transient`**. Relays are spawned by the [World Assembly Subsystem](world-assembly-subsystem.md) as players log in — you never place or save one.

:::

## Operation Notifications

The server keeps every relay informed about the operations it runs, keyed by operation ticket, so a client can follow progress and outcome without generating anything itself:

```cpp
/** Notify the client that an operation has started on the server. */
UFUNCTION(Client, Reliable)
void Client_OperationStarted(int32 OperationTicket);

/** Notify the client that an operation has completed. */
UFUNCTION(Client, Reliable)
void Client_OperationFinished(int32 OperationTicket);

/** Notify the client that an operation has been destroyed. */
UFUNCTION(Client, Reliable)
void Client_OperationDestroyed(int32 OperationTicket);

UFUNCTION(Client, Unreliable)
void Client_OperationProgress(int32 OperationTicket, float Progress);

UFUNCTION(Client, Reliable)
void Client_OperationResult(int32 OperationTicket, bool bSuccess, const FText& Title, const FText& Message);
```

The client tracks which tickets it has been told about but not yet seen finish. That pending set is part of what [readiness](#readiness) means.

- **`Client_OperationProgress`** carries `0..1` progress. It is **unreliable** and throttled by the server to at most four a second, and only for a change of at least 1%. A lost update is replaced by the next, and one arriving after the operation finished is ignored.
- **`Client_OperationResult`** is sent **before** `Client_OperationFinished`. It says whether every required organ was satisfied, with the result's title and message. A cancelled operation isn't reported as a failure.

The subsystem turns these into [`Get Operation Progress`](world-assembly-subsystem.md#progress) and [`GetFailedOperationResult`](world-assembly-subsystem.md#did-it-fail) on the client. Before 0.4.0, only tickets crossed the wire, so a client could learn *that* an operation ran but never how far along it was or whether it worked.

## Nearby Cells

A request/response pair rather than replicated state, so the payload is scoped to where the player actually is:

```cpp
UFUNCTION(Server, Reliable)
void Server_RequestNearbyCells(FVector Location, int32 OperationTicket, bool bIsLevelLoaded = true);

/** Server response payload: cell-instance locators within range of the client's request. */
UFUNCTION(Client, Reliable)
void Client_ReceiveNearbyCells(const TArray<FNCellLevelInstanceLocator>& Results);
```

The response carries **locators**, not cells — lightweight identifiers the client resolves against its own registry. That keeps the message small regardless of how much content a cell holds.

```cpp
/**
 * Refresh the cached nearby-cell list by re-asking the server.
 * @param bIsLevelLoaded Whether only loaded cell levels should be considered.
 */
void UpdateNearbyCells(bool bIsLevelLoaded = true);
```

`bIsLevelLoaded` narrows the answer to cells whose levels have actually streamed in — the distinction between "a cell is placed here" and "a cell is present here right now".

## Readiness

```cpp
/** @return true when the server has answered the latest nearby-cells request, its cells are loaded, and no operations the client has been notified about are pending. */
bool IsReady();

/** @return The ANCellLevelInstances still to sync as (Remaining, Total). */
FIntVector2 GetRemainingStatus() const;
```

Readiness is three conditions together:

- the server has answered the **latest** nearby-cells request,
- the cells it named are loaded,
- nothing the client was told about is still pending.

None of them is enough alone. A client that has never heard from the server isn't ready, even with no pending operations.

"Latest" matters. Sending a request clears the cached list first, and an empty list used to pass the loaded-cells check trivially. So for one round trip after the relay registered, and after every operation finished, a client read as settled with nothing synced. Anything gating on it, such as a loading screen, could let go and then watch the cells arrive. Since 0.4.0 the relay reads as not ready until the reply arrives.

On a listen server or standalone game, the host's **own** relay answers the same question for its local player. See [World Assembly Subsystem](world-assembly-subsystem.md#readiness).

`GetRemainingStatus()` is the progress form of the same question, returning `(Remaining, Total)` so it can drive a loading bar. Both surface through the subsystem, which is where callers should normally read them — see [World Assembly Subsystem](world-assembly-subsystem.md#readiness).

:::warning

The subsystem's `GetRemainingStatus` returns zeroes when there is **no local relay**, which includes a client before its relay has replicated as well as the server. Treat a zero `Total` as "not applicable yet" rather than "complete".

:::
