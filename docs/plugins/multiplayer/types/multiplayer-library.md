---
sidebar_position: 1
sidebar_label: Multiplayer Library
sidebar_class_name: type ue-blueprint-function-library
description: A handful of methods meant to support the building logic that works in multiplayer scenarios.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Multiplayer Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNMultiplayerLibrary" typeExtra="/ FNMultiplayerUtils" headerFile="NexusMultiplayer/Public/NMultiplayerLibrary.h" />

A handful of methods meant to support the building logic that works in multiplayer scenarios.

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

### Utility Functions

#### Is Multiplayer Test

```cpp
/**
  * Is the current session created from the MultiplayerTest editor command?
  * @return true/false if it is.
  */
static bool IsMultiplayerTest();
```

#### Ping

```cpp
/**
  * Get the current ping to the host/server.
  * @param WorldContextObject Object that provides the context of which world to operate in.
  * @return The numerical ping (ms) to the session host.
  */
static float Ping(const UObject* WorldContextObject);
```