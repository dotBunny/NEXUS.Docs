---
sidebar_position: 1
sidebar_label: Multiplayer Library
sidebar_class_name: type ue-blueprint-function-library
description: A handful of methods meant to support the building logic that works in multiplayer scenarios.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Multiplayer Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNMultiplayerLibrary" typeExtra="" headerFile="NexusMultiplayer/Public/NMultiplayerLibrary.h" />

A handful of methods meant to support the building logic that works in multiplayer scenarios.

## Admin Functions

### HasRemotePlayers

Evaluates the GameState's player array for any local controllers.

```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Has Remote Players", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool HasRemotePlayers(UObject* WorldContextObject);
```

### HasLocalPlayersOnly

Evaluates the `GameState`'s player array, ensuring their are only local controllers.

```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Has Local Players", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool HasLocalPlayersOnly(UObject* WorldContextObject);
```

### HasGameStateAuthority

Checks the `GameState` role to ensure it is `ROLE_Authority`.

```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Has GameState Authority", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool HasGameStateAuthority(UObject* WorldContextObject);
```

### HasWorldAuthority

Queries the `World->GetAuthGameMode()` to see if a valid `GameMode` is present.

```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Has World Authority", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool HasWorldAuthority(UObject* WorldContextObject);
```

### IsServer

Checks what the `World` network mode is; specifically comparing aginst `NM_Client`.

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Is Host", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject", ExpandBoolAsExecs="ReturnValue"))
static bool IsServer(UObject* WorldContextObject);
```

### KickPlayer

Kicks the provided player from the session, validating that the call is being executed by an authority.

```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Kick Player", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool KickPlayer(UObject* WorldContextObject, APlayerState* PlayerState);
```

## Utility Functions

### IsMultiplayerTest

Checks the startup commandline for an appended flag that indicates that the client/server is of initiation from a **Multiplayer Test**.

```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Is Multiplayer Test", Category = "NEXUS|Multiplayer")
static bool IsMultiplayerTest();
```

### Ping

Returns the ping of the current client to the server.

```cpp
UFUNCTION(BlueprintPure, DisplayName = "Get Ping", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static float Ping(const UObject* WorldContextObject);
```