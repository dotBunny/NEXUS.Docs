---
sidebar_class_name: type native-class
description: Process-wide registry of the components, operations and level instances that participate in World Assembly.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Assembly Registry

<TypeDetails icon="native-class" base="class" type="FNWorldAssemblyRegistry" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldAssemblyRegistry.h" />

A process-wide index of everything participating in World Assembly. Components register themselves during their own lifecycle, which means subsystems and tooling can enumerate the active graph without walking every actor and component in the world.

Everything on it is **static** — there is no instance to hold.

:::warning[Game thread only]

Every accessor expects to be called from the game thread. The registry is not synchronised, so reaching into it from a task-graph job is unsafe — which is exactly why the assembly pipeline snapshots what it needs into a [context](../architecture/index.mdx) before going wide.

:::

## Events

```cpp
/** Broadcast whenever a World Assembly operation's lifecycle state changes. */
static FOnAssemblyOperationStateChanged OnOperationStateChanged;

/** Broadcast whenever an operation's per-stage progress channels change; carries only the changed channels. */
static FOnAssemblyOperationChannelsChanged OnOperationChannelsChanged;
```

`OnOperationStateChanged` carries the [operation](assembly-operation.md) and its new [state](assembly-operation.md#lifecycle). `OnOperationChannelsChanged` carries **only the channels that changed**, not a full snapshot — so a listener rebuilding a progress UI must merge rather than replace.

Both are native multicast delegates, so bind with `AddUObject`/`AddRaw` and remove your handle on teardown.

## Enumerating A Level

```cpp
static TArray<UNCellJunctionComponent*> GetCellJunctionsComponentsFromLevel(const ULevel* Level, bool bSorted = true);
static TArray<UNOrganComponent*>        GetOrganComponentsFromLevel(const ULevel* Level, bool bSorted = true);
static TArray<UNBoneComponent*>         GetBoneComponentsFromLevel(const ULevel* Level, bool bSorted = true);
static UNCellRootComponent*             GetCellRootComponentFromLevel(const ULevel* Level);
```

Note `bSorted` defaults to **`true`**, and that default matters: [Assembly Operation](assembly-operation.md#creation) requires its organ components pre-sorted by `Identifier` for deterministic results. Passing `false` for speed hands you an order that is not reproducible.

There is one cell root component per level, so that accessor returns a single pointer rather than an array.

## Presence Checks

Cheap "is there any" tests, for gating work before doing it:

| Method | Asks |
| :-- | :-- |
| `HasBoneComponents()` | Any bones registered at all. |
| `HasRootComponents()` | Any cell roots. |
| `HasJunctionComponents()` | Any junctions. |
| `HasOrganComponents()` | Any organs. |
| `HasOrganComponentsInWorld(World)` | Any organs in a specific world. |
| `HasOperations()` | Any operations tracked. |

`HasOrganComponentsInWorld` is the one to use in a multi-world editor session — the unqualified version answers process-wide and will report organs from a level you are not looking at.

## Cell Level Instances

```cpp
static TArray<ANCellLevelInstance*> GetCellLevelInstancesInRange(const FVector& Location, double Range,
    bool bIsLevelLoaded = true, int32 OperationTicket = 0);

static bool HasCellLevelInstances(int32 OperationTicket = 0, bool bIsLevelLoaded = true);
static bool HasCellLevelInstances(const TArray<FNCellLevelInstanceLocator>& LevelInstances, bool bIsLevelLoaded = true);
static bool HasCellLevelInstance(int32 OperationTicket, FGuid LevelInstanceSpawnGuid, bool bIsLevelLoaded = true);

static TArray<FNCellLevelInstanceLocator> GetRemainingCellLevelInstancesToSync(
    const TArray<FNCellLevelInstanceLocator>& LevelInstances, bool bIsLevelLoaded = true);
```

Two parameters recur across all of these and are worth understanding together:

- **`bIsLevelLoaded`** (default `true`) narrows the answer to instances whose levels have actually streamed in — "present right now" rather than "placed here".
- **`OperationTicket`** (default `0`) scopes to one [operation](assembly-operation.md); `0` means any.

`GetCellLevelInstancesInRange` is what the [Relay](world-assembly-relay.md#nearby-cells) answers a client's nearby-cells request with, and `GetRemainingCellLevelInstancesToSync` is what backs its `GetRemainingStatus` progress readout — the difference between what a client was told about and what has actually arrived.
