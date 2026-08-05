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
| `IsTasksUnlocked()` | Whether that dispatch has happened. |
| `GetTaskStatus()` | What the operation drains progress from — a `(Completed, Total)` pair. |
| `ConsumeStatusMessage()` | Drains the latest task-authored display message. Game thread only. |
| `ConsumeChannelUpdates()` | Drains every [status channel](#status-channels) that changed. Game thread only. |
| `Cancel()` | Requests [cooperative cancellation](#cancellation). |
| `WaitForTasks()` | Blocks until every stage completes. |
| `TearDownGraph()` | Releases the contexts and drops every task reference. |

:::warning

`WaitForTasks()` blocks the calling thread. It exists for commandlets and tests that need a synchronous build; calling it from the game thread during play stalls the frame for the entire generation. Normal callers poll `GetTaskStatus()` or bind the operation's [progress delegates](../types/assembly-operation.md#progress) instead.

:::

`GetTaskStatus()` is safe from any thread **between** `UnlockTasks()` and `TearDownGraph()`, and only there: the task array is built during construction and never mutated afterwards, and each event's completion state reads atomically. Call it while the graph is still being assembled or while it is being torn down and the array is in flux. The snapshot it returns may already be stale when the caller reads it — it is for progress display, never for a correctness decision.

## Cancellation

`Cancel()` does not stop anything. It raises two flags and lets the stages find them:

- The **task-graph context's** flag, polled by worker stages at their loop boundaries via `IsCancelled()`.
- The **spawn context's** `bCancelled`, which stops proxy spawning at the next time-slice boundary.

Every task in the graph still runs and still completes; a cancelled one just returns early. That is what keeps the dependency chain intact — a task graph whose prerequisites never complete would leave `FNAssemblyFinalizeTask` waiting forever.

:::warning

The teardown order matters. `TearDownGraph()` nulls the world pointer on each context **before** releasing the shared references, so a ref-counted copy that outlives the operation cannot dangle against a destroyed `UWorld`.

:::

## The Contexts

State does not live on the tasks — it lives in contexts they share. Each has a distinct scope and threading story, which is the part worth internalising.

| Context | Type | Scope |
| :-- | :-- | :-- |
| [Assembly Operation](#assembly-operation-context) | `FNAssemblyOperationContext` | One whole generation, game thread. |
| [Pass](#pass-context) | `FNPassContext` | One pass; fan-in from parallel organ builders. |
| [Spawn](#spawn-context) | `FNSpawnContext` | Time-sliced proxy spawning. |
| [Task Graph](#task-graph-context) | `FNAssemblyTaskGraphContext` | Results and progress, for the whole graph. |

Two more carry the collision side of the run — `FNVirtualWorldContext` and the per-organ `FNVirtualOrganContext` — and are documented under [Virtual World](virtual-world.md).

### Assembly Operation Context

`FNAssemblyOperationContext` — the **game-thread** context for an entire generation. It aggregates every input organ, the per-organ and per-bone state derived from them, and the computed generation ordering.

Populated by the operation while it is being configured, then **locked** once preprocessing completes — after which it is the source of truth the task stages read. The lock is why [`AddToContext`](../types/assembly-operation.md#building) starts returning `false`: the context is closed, and reopening it mid-build would invalidate the ordering every stage depends on.

### Pass Context

`FNPassContext` is a **fan-in** point. Organ builders run in parallel, one task per organ, and each writes its completed graph here — so the collect and finalize stages have a single place to walk rather than chasing per-task results.

### Spawn Context

`FNSpawnContext` is shared by `FNCreateSpawnsTask` and `FNSpawnCellProxiesTask` to drive **time-sliced** spawning. It holds the target world, the flat list of cell nodes needing proxies, and a **cursor** marking how far the spawn pass has progressed.

The cursor is what makes time-slicing possible: the spawn task drains a batch, leaves the cursor where it stopped, and the next invocation resumes there. It also carries the level-instance flags forwarded to each spawned [proxy](../types/cell-proxy.md).

### Task Graph Context

`FNAssemblyTaskGraphContext` is what every stage shares for the whole run. It holds the results as they accumulate, and carries progress back to the game thread via **status channels**.

What it accumulates, and how each entry is made safe, is the useful thing to know before extending a stage:

| State | Written by | Guarded how |
| :-- | :-- | :-- |
| `Graphs` | Every organ builder, concurrently | A mutex on `TakeGraph`. |
| `ContextTags` / `TagCounter` | Every pass collector | A mutex per container. |
| `OrganCellCount` / `OrganRandomState` | Every organ builder | A mutex each; keyed by organ identifier and drained onto the components on the game thread. |
| `CreatedProxies` | The spawn pass only | **Nothing** — it is a game-thread stage. |

The context also carries the operation's settings and ticket — so no task has to reach back into the operation — and the path the run's report was written to.

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

A channel is opened with a label, published to with a message and a `0..1` percent, and closed when its stage finishes. **Closed channels are not removed** — the bar lingers at 100% until the operation tears down, so a finished stage stays visible in the [Developer Overlay](../developer-overlay.md) rather than vanishing from the list.

The spawn pass is the reason channels are addressed by id rather than re-opened per call: it opens one on its first dispatch and reuses it across every time slice, so the bar keeps moving while the stage re-dispatches frame to frame.

### Coalescing

Alongside the channels, a single **display message** carries the run's current headline status, written with `SetStatusMessage` and drained with `ConsumeStatusMessage`.

Both paths coalesce — latest wins — and both are gated on an atomic version counter that the game thread compares before taking the lock. A frame where nothing changed costs one atomic load and no contention, which is what makes it safe to poll every tick.
