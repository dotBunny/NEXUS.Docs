---
sidebar_position: 1
sidebar_label: Multiplayer Library
sidebar_class_name: type ue-blueprint-function-library
description: A handful of methods meant to support the building logic that works in multiplayer scenarios.
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Multiplayer Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNMultiplayerLibrary" typeExtra="" headerFile="NexusMultiplayer/Public/NMultiplayerLibrary.h" />

A handful of methods meant to support the building logic that works in multiplayer scenarios.

## Admin Functions
### HasRemotePlayers
```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Has Remote Players", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool HasRemotePlayers(UObject* WorldContextObject);

UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "? Has Remote Players", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject", ExpandBoolAsExecs="ReturnValue"))
static bool HasRemotePlayersExec(UObject* WorldContextObject);
```
### HasLocalPlayersOnly
```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Has Local Players", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool HasLocalPlayersOnly(UObject* WorldContextObject);

UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "? Has Local Players", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject", ExpandBoolAsExecs="ReturnValue"))
static bool HasLocalPlayersOnlyExec(UObject* WorldContextObject);
```
### HasGameStateAuthority
```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Has GameState Authority", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool HasGameStateAuthority(UObject* WorldContextObject);

UFUNCTION(BlueprintCallable, DisplayName = "? Has GameState Authority", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject", ExpandBoolAsExecs="ReturnValue"))
static bool HasGameStateAuthorityExec(UObject* WorldContextObject);
```
### HasWorldAuthority
```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Has World Authority", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool HasWorldAuthority(UObject* WorldContextObject);

UFUNCTION(BlueprintCallable, DisplayName = "? Has World Authority", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject", ExpandBoolAsExecs="ReturnValue"))
static bool HasWorldAuthorityExec(UObject* WorldContextObject);
```
### IsServer
```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Is Host", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject", ExpandBoolAsExecs="ReturnValue"))
static bool IsServer(UObject* WorldContextObject);
	
UFUNCTION(BlueprintCallable, DisplayName = "? Is Host", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject", ExpandBoolAsExecs="ReturnValue"))
static bool IsServerExec(UObject* WorldContextObject);
```
### KickPlayer
```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Kick Player", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static bool KickPlayer(UObject* WorldContextObject, APlayerState* PlayerState);
```

## Utility Functions
### IsMultiplayerTest
```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "Is Multiplayer Test", Category = "NEXUS|Multiplayer")
static bool IsMultiplayerTest();

UFUNCTION(BlueprintCallable, BlueprintPure = false, DisplayName = "? Is Multiplayer Test", Category = "NEXUS|Multiplayer", meta = (ExpandBoolAsExecs="ReturnValue"))
static bool IsMultiplayerTestExec();
```
### Ping
```cpp
UFUNCTION(BlueprintPure, DisplayName = "Get Ping", Category = "NEXUS|Multiplayer", meta = (WorldContext = "WorldContextObject"))
static float Ping(const UObject* WorldContextObject);
```