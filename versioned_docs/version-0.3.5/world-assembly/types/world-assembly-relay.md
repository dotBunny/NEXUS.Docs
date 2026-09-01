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

Three client RPCs, all `Reliable`, keyed by operation ticket:

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
```

The client tracks which tickets it has been told about but not yet seen finish — that pending set is half of what [readiness](#readiness) means. Because only the ticket crosses the wire, a client learns *that* an operation is running without receiving its contents.

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
/** @return true when the server has answered the nearby-cells RPC at least once and no operations the client has been notified about are pending. */
bool IsReady();

/** @return The ANCellLevelInstances still to sync as (Remaining, Total). */
FIntVector2 GetRemainingStatus() const;
```

Readiness on a client is two conditions together: the nearby-cells exchange has completed **at least once**, and nothing the client was told about is still pending. Either alone is insufficient — a client that has never heard from the server is not ready even with no pending operations.

`GetRemainingStatus()` is the progress form of the same question, returning `(Remaining, Total)` so it can drive a loading bar. Both surface through the subsystem, which is where callers should normally read them — see [World Assembly Subsystem](world-assembly-subsystem.md#readiness).

:::warning

The subsystem's `GetRemainingStatus` returns zeroes when there is **no local relay**, which includes a client before its relay has replicated as well as the server. Treat a zero `Total` as "not applicable yet" rather than "complete".

:::
