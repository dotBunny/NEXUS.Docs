---
sidebar_position: 1
sidebar_label: Multiplayer Library
sidebar_class_name: type ue-blueprint-function-library
description: A handful of methods meant to support the building logic that works in multiplayer scenarios.
tags: [0.1.0, 0.2.4]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import VersionBadge from '../../../../src/components/VersionBadge';

# Multiplayer Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNMultiplayerLibrary" typeExtra="/ FNMultiplayerUtils" headerFile="NexusMultiplayer/Public/NMultiplayerLibrary.h" />

The Blueprint-facing surface for building logic that has to behave correctly across authority and connectivity boundaries — server vs. client, local vs. remote, listen-server vs. dedicated, plus the lookup helpers needed to resolve a player by stable identifier across machines. Most calls are thin wrappers around `FNMultiplayerUtils`, the native sibling utility that backs the same operations without the `WorldContextObject` indirection.

Every method that touches the world takes a `UObject* WorldContextObject` so the library can resolve a `UWorld` from any caller. In Blueprint this pin is filled in automatically by the editor and is hidden by default; in C++, pass any `UObject` whose `GetWorld()` returns the world you want to query (e.g. `this` from an Actor, or a Pawn / Controller reference).

:::tip[Native Code Paths]

If you already have a `UWorld*` pointer, prefer calling [`FNMultiplayerUtils`](https://github.com/dotBunny/NEXUS/blob/main/Plugins/Multiplayer/Source/NexusMultiplayer/Public/NMultiplayerUtils.h) directly — every method here forwards to one of its `FORCEINLINE` statics. The native utility also exposes a `ServerTravel` wrapper that is not surfaced through Blueprint.

:::

## Choosing an Authority Check

There are three "is this the host?" checks. They look interchangeable but answer subtly different questions, and choosing the wrong one can leave logic running on a client (or failing to run on a host) under specific net modes.

| Check | What It Actually Asks | Use When |
| :-- | :-- | :-- |
| [Has World Authority](#has-world-authority) | `World->GetAuthGameMode() != nullptr` | Default choice. The auth game mode only exists on the host (listen server or dedicated server), so this is the cleanest "is this the host machine?" check. |
| [Has GameState Authority](#has-gamestate-authority) | `World->GetGameState()->GetLocalRole() == ROLE_Authority` | When the game state has been replicated and you want a role-based gate that mirrors the per-Actor role checks you'd write on a replicated Actor. Returns `false` before the game state replicates. |
| [Is Server](#is-server) | `World->GetNetMode() != NM_Client` | When you specifically need to include the standalone net mode in the "yes, this is the server" answer, or when authority checks haven't yet stabilised (very early in init, before game mode is constructed). |

For "are there any networked clients connected?" use [Has Remote Players](#has-remote-players) (and its inverse [Has Local Players Only](#has-local-players-only)) — those answer a connectivity question, not an authority one.

## UFunctions

### Admin Functions

#### Has Remote Players

```cpp
/**
  * Does the current world have remotely connected clients to it?
  * @remark Clients won't have remote connections, only the server will.
  * @param WorldContextObject Object that provides the context of which world to operate in.
  * @return true/false if remote clients are found.
  */
static bool HasRemotePlayers(UObject* WorldContextObject);
```

#### Has Local Players Only

```cpp
/**
  * Does the current world have locally connected clients only?
  * @remark Couch Co-op.
  * @param WorldContextObject Object that provides the context of which world to operate in.
  * @return true/false if only local clients are found.
  */	
static bool HasLocalPlayersOnly(UObject* WorldContextObject);
```

#### Has GameState Authority

```cpp
/**
  * Does the current callstack have GameState authority?
  * @remark One of many ways to check if the logic is being operated on the host/server.
  * @param WorldContextObject Object that provides the context of which world to operate in.
  * @return true/false if authority is found.
  */
static bool HasGameStateAuthority(UObject* WorldContextObject);
```

#### Has World Authority

```cpp
/**
  * Does the current callstack have World authority?
  * @remark Developer preference, use this to determine if logic is operating on the host.
  * @param WorldContextObject Object that provides the context of which world to operate in.
  * @return true/false if authority is found.
  */	
static bool HasWorldAuthority(UObject* WorldContextObject);
```

#### Is Server

```cpp
/**
  * An explicit check that the network mode of the world is not NM_Client, thus either a listen server (w/ client) or a dedicated server.	 
  * @param WorldContextObject Object that provides the context of which world to operate in.
  * @return true/false if the world is not operating in NM_Client mode.
  */	
static bool IsServer(UObject* WorldContextObject);
```

#### Kick Player

```cpp
/**
  * Kicks a player from a session.
  * @remark This should be only called on the server or world owner.
  * @param WorldContextObject Object that provides the context of which world to operate in.
  * @param PlayerState The target player to kick.
  * @return Was the player able to be kicked? true/false.
  */
static bool KickPlayer(UObject* WorldContextObject, APlayerState* PlayerState);
```

:::warning

Will fail if not done by server/host.

:::

### Branch-Style Variants

Each of the boolean Admin functions ships with an `Exec` companion that uses `meta=(ExpandBoolAsExecs="ReturnValue")`. In Blueprint these appear as branch-shaped nodes with **True** / **False** execution pins instead of a `bool` return — drop one in to gate execution flow without having to wire a `Branch` node afterwards.

| Branching Node (Blueprint) | Wraps |
| :-- | :-- |
| `Has Remote Players ?` | [Has Remote Players](#has-remote-players) |
| `Has Local Players ?` | [Has Local Players Only](#has-local-players-only) |
| `Has GameState Authority ?` | [Has GameState Authority](#has-gamestate-authority) |
| `Has World Authority ?` | [Has World Authority](#has-world-authority) |
| `Is Server ?` | [Is Server](#is-server) |
| `Is Multiplayer Test ?` | [Is Multiplayer Test](#is-multiplayer-test) |

These are Blueprint-only conveniences — from C++ call the boolean version directly.

### Player Functions

Every `PlayerIdentifier` returned or accepted below is `APlayerState::GetPlayerId()`, the stable per-player identifier replicated to every machine. The lookup helpers walk `GameStateBase::PlayerArray` server-side, so they are intended to run with authority — calling them on a client returns whatever the client's replicated player array currently holds.

#### Get PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

```cpp
/**
  * Get a player's unique identifier from the APlayerController.
  * @param PlayerController The target APlayerController to use when querying for the player identification number.
  * @return The player's identifier.
  */
static int32 GetPlayerIdentifier(const APlayerController* PlayerController)
```

#### Get First PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

```cpp
/**
  * Get the first player's unique identifier.
  * @param WorldContextObject An object to get the UWorld from.
  * @return The player's identifier.
  */
static int32 GetFirstPlayerIdentifier(UObject* WorldContextObject);
```

#### Get Pawn From PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

```cpp
/**
  * Get the APawn for the given player's unique identifier.
  * @param WorldContextObject An object to get the UWorld from.
  * @param PlayerIdentifier The target identifier to query for.
  * @return If found, APawn, or nullptr.
  */	
static APawn* GetPawnFromPlayerIdentifier(UObject* WorldContextObject, const int32 PlayerIdentifier);
```

#### Get PlayerController From PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

```cpp
/**
  * Get the AActor for the given player's unique identifier.
  * @param WorldContextObject An object to get the UWorld from.
  * @param PlayerIdentifier The target identifier to query for.
  * @return If found, AActor, or nullptr.
  */
static AActor* GetPlayerControllerFromPlayerIdentifier(UObject* WorldContextObject, const int32 PlayerIdentifier);
```

#### Get PlayerState From PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

```cpp
/**
  * Get the APlayerState for the given player's unique identifier.
  * @param WorldContextObject An object to get the UWorld from.
  * @param PlayerIdentifier The target identifier to query for.
  * @return If found, APlayerState, or nullptr.
  */
static APlayerState* GetPlayerStateFromPlayerIdentifier(UObject* WorldContextObject, const int32 PlayerIdentifier);
```

### Utility Functions

#### Is Multiplayer Test

```cpp
/**
  * Is the current session created from the MultiplayerTest editor command?
  * @return true/false if it is.
  */
static bool IsMultiplayerTest();
```

Detects sessions launched by the [Multiplayer Test](../multiplayer-test.md) toolbar button, which spawn each client with the `-NMultiplayerTest` command-line flag. Useful for gating dev-only behaviour (extra logging, test-only spawn locations, lower default difficulty) so it lights up automatically when iterating but stays out of standalone or shipping play.

#### Ping

```cpp
/**
  * Get the current ping to the host/server.
  * @param WorldContextObject Object that provides the context of which world to operate in.
  * @return The numerical ping (ms) to the session host.
  */
static float Ping(const UObject* WorldContextObject);
```

Reads `APlayerState::ExactPing` for the local player, so the value is meaningful only on a client connected to a remote host. On the host itself, or when no local player exists yet, the underlying `FNMultiplayerUtils::GetPing` returns the `NEXUS::Multiplayer::InvalidPing` sentinel — check the returned value before treating it as a real latency reading.