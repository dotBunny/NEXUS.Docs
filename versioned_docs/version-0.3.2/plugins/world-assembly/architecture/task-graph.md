---
sidebar_class_name: type native-class
description: The task graph that drives an operation, and the four contexts that carry state between its stages.
---

# Task Graph

The machinery that runs an [Assembly Operation](../types/assembly-operation.md)'s [tasks](tasks.md) and the state they pass between each other. All internal; none of it is Blueprint-exposed.

## FNAssemblyTaskGraph

The wrapper that drives one operation through its builder, collection, and finalize stages.

The lifecycle is deliberately **two-phase**: construction *builds* the graph but does not dispatch it. `UnlockTasks()` kicks the dispatch. That separation is what lets an operation finish configuring itself — and lock its context — before any work begins, rather than racing its own setup.

| Member | Purpose |
| :-- | :-- |
| `UnlockTasks()` | Dispatches the built graph. |
| `GetTaskStatus()` | What the operation drains progress from. |
| `WaitForTasks()` | Blocks until every stage completes. |

:::warning

`WaitForTasks()` blocks the calling thread. It exists for commandlets and tests that need a synchronous build; calling it from the game thread during play stalls the frame for the entire generation. Normal callers poll `GetTaskStatus()` or bind the operation's [progress delegates](../types/assembly-operation.md#progress) instead.

:::

## The Four Contexts

State does not live on the tasks — it lives in contexts they share. Each has a distinct scope and threading story, which is the part worth internalising.

| Context | Type | Scope |
| :-- | :-- | :-- |
| [Assembly Operation](#assembly-operation-context) | `FNAssemblyOperationContext` | One whole generation, game thread. |
| [Pass](#pass-context) | `FNPassContext` | One pass; fan-in from parallel organ builders. |
| [Spawn](#spawn-context) | `FNSpawnContext` | Time-sliced proxy spawning. |
| [Task Graph](#task-graph-context) | `FNAssemblyTaskGraphContext` | Progress reporting back to the game thread. |

### Assembly Operation Context

`FNAssemblyOperationContext` — the **game-thread** context for an entire generation. It aggregates every input organ, the per-organ and per-bone state derived from them, and the computed generation ordering.

Populated by the operation while it is being configured, then **locked** once preprocessing completes — after which it is the source of truth the task stages read. The lock is why [`AddToContext`](../types/assembly-operation.md#building) starts returning `false`: the context is closed, and reopening it mid-build would invalidate the ordering every stage depends on.

### Pass Context

`FNPassContext` is a **fan-in** point. Organ builders run in parallel, one task per organ, and each writes its completed graph here — so the collect and finalize stages have a single place to walk rather than chasing per-task results.

### Spawn Context

`FNSpawnContext` is shared by `FNCreateSpawnsTask` and `FNSpawnCellProxiesTask` to drive **time-sliced** spawning. It holds the target world, the flat list of cell nodes needing proxies, and a **cursor** marking how far the spawn pass has progressed.

The cursor is what makes time-slicing possible: the spawn task drains a batch, leaves the cursor where it stopped, and the next invocation resumes there. It also carries the level-instance flags forwarded to each spawned [proxy](../types/cell-proxy.md).

### Task Graph Context

`FNAssemblyTaskGraphContext` carries progress out of the graph and back to the game thread, via **status channels**.

## Status Channels

```cpp
/** A drained snapshot of a single status channel, handed to the game thread by ConsumeChannelUpdates. */
struct FNStatusChannelUpdate;
```

Off-thread stages report progress into named channels; the game thread drains them with `ConsumeChannelUpdates`. Each update is the **full current state** of a channel that changed since the last drain.

:::note[The consumer decides what is new]

An update does not say whether it represents a new channel or a change to an existing one — the consumer infers that from whether it has seen the channel's id before. A listener must therefore keep its own map keyed by id and merge, not replace.

This is the same contract as the [Registry](../types/world-assembly-registry.md#events)'s `OnOperationChannelsChanged`, which carries only changed channels rather than a full snapshot.

:::

Because only *changed* channels are drained, the cost of reporting progress stays proportional to how much actually moved rather than to how many channels exist — which is what lets the pipeline report finely without flooding the game thread.
