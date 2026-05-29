---
sidebar_class_name: type native-class
description: Native helpers for authority checks, player-identifier lookups, server travel, and ping — the C++-only counterpart to UNMultiplayerLibrary.
tags: [0.1.0, 0.2.4, 0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import VersionBadge from '../../../../src/components/VersionBadge';

# Multiplayer Utils

<TypeDetails icon="native-class" base="class" type="FNMultiplayerUtils" typeExtra="" headerFile="NexusCore/Public/NMultiplayerUtils.h" />

The native side of the multiplayer helper surface — authority checks, player-identifier lookups, a `ServerTravel` wrapper, and the local-player ping accessor that backs [Multiplayer Library](multiplayer-library.md). Every method is a `FORCEINLINE static`, so prefer this over the Blueprint library when you already have a `UWorld*` in hand: each library entry forwards to one of these statics through a `WorldContextObject` resolve, and that indirection is the only cost you save.

`ServerTravel` is intentionally **not** surfaced through `UNMultiplayerLibrary` — it lives here only.

## Methods

### Server Travel

Safe wrapper around `UWorld::ServerTravel` that resolves the world from any context object. Skips the call if the resolved world is not valid, so callers do not have to null-check before invoking.

```cpp
/**
 * Safe wrapper around UWorld::ServerTravel that resolves the world from any context object.
 * @param WorldContextObject An object used to resolve the UWorld.
 * @param InURL The URL to travel to.
 * @param bAbsolute true for an absolute travel; false for a relative travel.
 * @param bShouldSkipGameNotify true to skip notifying the current game mode.
 */
FORCEINLINE static void ServerTravel(const UObject* WorldContextObject, const FString& InURL,
    const bool bAbsolute = true, const bool bShouldSkipGameNotify = false);
```

### Has World Authority

Authority check that asks `World->GetAuthGameMode() != nullptr` — the auth game mode only exists on the host (listen server or dedicated server). The recommended default authority check; see [Multiplayer Library — Choosing an Authority Check](multiplayer-library.md#choosing-an-authority-check) for the comparison against the GameState-based variant.

```cpp
/**
 * Does the current callstack have World authority?
 * @remark Developer preference, use this to determine if logic is operating on the host.
 * @param World The world to check.
 * @return true/false if authority is found.
 */
FORCEINLINE static bool HasWorldAuthority(const UWorld* World);
FORCEINLINE static bool HasWorldAuthority(const UWorld& World);
```

### Has GameState Authority

Role-based authority check that returns `true` only after the game state has replicated and reports `ROLE_Authority`. Returns `false` before the game state replicates — call sites that run very early in init should prefer [Has World Authority](#has-world-authority).

```cpp
/**
 * Does the current callstack have GameState authority?
 * @remark One of many ways to check if the logic is being operated on the host/server.
 * @param World The world to check.
 * @return true/false if authority is found.
 */
FORCEINLINE static bool HasGameStateAuthority(const UWorld* World);
FORCEINLINE static bool HasGameStateAuthority(const UWorld& World);
```

### Get PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

Extract `APlayerState::GetPlayerId()` from a controller. Logs a warning and returns `0` if the controller has no player state attached.

```cpp
/**
 * Get a player's unique identifier from the APlayerController.
 * @param PlayerController The target APlayerController to use when querying for the player identification number.
 * @return The player's identifier.
 */
FORCEINLINE static int32 GetPlayerIdentifier(const APlayerController* PlayerController);
```

### Get First PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

Read the first entry of `GameStateBase::PlayerArray` and return its identifier. Returns `0` when the array is empty.

```cpp
/**
 * Get the first player's unique identifier.
 * @param World The world to check.
 * @return The player's identifier.
 */
FORCEINLINE static int32 GetFirstPlayerIdentifier(const UWorld* World);
```

### Get Pawn From PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

Walk `GameStateBase::PlayerArray` looking for a matching identifier and return that player's `APawn`. Intended to run with authority — clients only see whatever the replicated array currently holds.

```cpp
/**
 * Get the APawn for the given player's unique identifier.
 * @param World The world to check.
 * @param PlayerIdentifier The target identifier to query for.
 * @return If found, APawn, or nullptr.
 */
FORCEINLINE static APawn* GetPawnFromPlayerIdentifier(const UWorld* World, const int32 PlayerIdentifier);
```

### Get PlayerController From PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

Same lookup as above, returning the controller (typed as `AActor*` to match the Blueprint surface).

```cpp
/**
 * Get the AActor for the given player's unique identifier.
 * @param World The world to check.
 * @param PlayerIdentifier The target identifier to query for.
 * @return If found, AActor, or nullptr.
 */
FORCEINLINE static AActor* GetPlayerControllerFromPlayerIdentifier(const UWorld* World, const int32 PlayerIdentifier);
```

### Get PlayerState From PlayerIdentifier<VersionBadge version="0.2.4" type="header" />

Same lookup, returning the `APlayerState` directly without going through the controller.

```cpp
/**
 * Get the APlayerState for the given player's unique identifier.
 * @param World The world to check.
 * @param PlayerIdentifier The target identifier to query for.
 * @return If found, APlayerState, or nullptr.
 */
FORCEINLINE static APlayerState* GetPlayerStateFromPlayerIdentifier(const UWorld* World, const int32 PlayerIdentifier);
```

### Get Ping

Read `APlayerState::ExactPing` for the local player. Returns the `NEXUS::Multiplayer::InvalidPing` sentinel when the world, local player, controller, or player state is missing — check the returned value before treating it as a real latency reading. Meaningful only on a client connected to a remote host.

```cpp
/**
 * Get the ping for the local player.
 * @param World The world to check.
 * @return If found, ping, or InvalidPing.
 */
FORCEINLINE static float GetPing(const UWorld* World);
```
