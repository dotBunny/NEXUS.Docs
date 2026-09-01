---
sidebar_class_name: type native-class
description: The timing and counter records each task-graph stage captures, and how they aggregate into an operation report.
---

# Analytics

Every [task](tasks.md) stage records what it cost. Those records aggregate into one report per [Assembly Operation](../types/assembly-operation.md), which is what makes a slow generation diagnosable rather than merely slow.

All of this is internal and **debug-only** — none of it is Blueprint-exposed, and none is intended to drive gameplay decisions.

:::warning[It does not exist in shipping]

The whole system is wrapped in `#if !UE_BUILD_SHIPPING`. Every call site goes through an `N_ASSEMBLY_ANALYTICS*` macro, and in a shipping build those macros expand to **nothing** — no timers, no counters, and no analytics member on the tasks or the graph at all.

The practical consequence for anyone extending a stage: reach the analytics object only through the macros. A direct `AnalyticsPtr->…` call compiles fine in the editor and breaks the shipping build, because in that configuration the pointer is not declared.

:::

## The Aggregate

`FNAssemblyTaskAnalytics` collects timing and counters for one operation's entire task-graph build. Stages call `Start`/`Finish` helpers as they run, and the report is produced once everything has drained.

The per-organ, per-pass and per-spawn stages work differently from the rest, because there can be many of each: they **allocate a record up front** via a `*Create()` call and then address it by the returned **index** for the remainder of the build. That indirection is what lets several organ builds record into the same aggregate concurrently without contending over a shared cursor.

## Stage Timers

Four stages run exactly once and need no record of their own, so they are timed directly on the aggregate:

| Timer | Covers |
| :-- | :-- |
| Task-graph creation | Building the graph — everything before `UnlockTasks()` dispatches it. |
| Create virtual world | The game-thread world capture. |
| Process virtual world | Baking that capture and building its broadphase. |
| Create spawn cells context | Flattening the graphs into the spawn list. |

Task-graph creation is the one that surprises people. It is measured because it is not free — it walks the generation order, builds a per-organ context for every activated component, and pins every referenced cell against garbage collection, all on the game thread before any work has been dispatched.

## Per-Stage Records

| Record | Captures |
| :-- | :-- |
| `FNOrganGraphBuilderAnalytics` | One organ build: its cost, its **retry iterations**, and per-iteration counters for candidate nodes added or rejected. See [Organ Builds](#organ-builds). |
| `FNProcessPassAnalytics` | Which generation **phase** the task belonged to, plus how long the pass-collection step took to drain its inputs. |
| `FNSpawnCellProxiesAnalytics` | Every cell template spawned during the pass, plus the wall-clock cost of the spawn step. |

The organ record is the one worth reading first when a build is slow. Retry iterations are the signal that generation is *failing and re-rolling* rather than simply doing a lot of work — a graph that cannot satisfy its constraints regenerates, and the per-iteration add/reject counters show where candidates are dying.

## Organ Builds

`FNOrganGraphBuilderAnalytics` carries the configuration the build ran under alongside what it did, because the two are only diagnosable together — a failure at 40 cells means nothing until you know the minimum was 50.

| Captured | Why it matters |
| :-- | :-- |
| `Minimum` / `Maximum Cell Count`, `Maximum Retry Count` | The constraints the attempt was judged against, snapshotted from the organ context. |
| Final cell count and pass/fail verdict | What the last attempt produced. |
| `Draw Count` | Total random-stream draws across **every** iteration. Two runs of the same seed that diverge here diverged in their decisions, not just their outcome. |
| Per-iteration messages | The build log for each attempt, which is where a `CheckGraph` failure explains itself. |

Rejections are counted per iteration and per reason: out-of-bounds and world-colliding (tracked separately for the start cell and for subsequent cells), intersecting an existing node in the same graph, colliding with a cell another organ placed, and rejected by the finisher constraint. Branches capped with a finisher are counted too.

Two helpers on the record do the reading for you. `GetFailureReason` recovers the most specific explanation available — an explicit bailout reason first, then the last attempt's `CheckGraph` diagnosis, then its final log line. `GetDominantRejection` sums every reason across every iteration and names the one that discarded the most candidates, folding the start-cell and cell-node variants of the same physical reason together.

:::note[A failure that never reaches validation]

Some builds bail out before a graph exists at all — no placeable starting cell, a starter with no open junctions, an invalid context. These record an **explicit failure reason** rather than leaving the report to infer one from the message log, and that reason wins over anything the log would have produced.

The distinction is worth knowing when reading a report: "FAILED (got 0)" with a reason attached is a setup problem, while the same line without one is a constraint the generator genuinely could not satisfy.

:::

## The Timer

```cpp
/** Lightweight scoped timer used by World Assembly analytics structs to measure individual stages. */
struct FNWorldAssemblyTaskTimer;
```

`Start()` captures the current platform time; `Stop()` records the end and stores the elapsed duration in **milliseconds**.

:::warning

The timer offers **no thread-safety guarantees** and is intended for logging and debug only. Each analytics record owns its own timer, which is why concurrent stages do not collide — but do not share one across threads, and do not build gameplay logic on these numbers.

:::

## Reading The Report

The aggregate appends itself to the operation's report once the graph has drained — the same data the operation writes when asked to log its outcome. Because the report is only complete after [`FNAssemblyFinalizeTask`](tasks.md) has run, it is a post-mortem rather than a live progress feed.

It arrives in two parts, and they answer different questions:

**Timespans** is the cost breakdown — an overview row per stage, then a table per stage type: one row per organ (with its iteration count, draw count, and status), one per pass phase, and one per spawn slice. Read it to find *where* the time went.

**Insights** is the diagnosis, and it only appears when there is something to say:

| Block | Appears when | Carries |
| :-- | :-- | :-- |
| `Failures` | Any organ failed | Its cell count against its minimum, the **likely cause**, and the specific failure reason. |
| `Strained Successes` | An organ succeeded but consumed retries | Retries used against the budget, plus the same likely-cause column. |

`Strained Successes` is the one to look at on a build that is *working*. An organ that needed four attempts to pass is one authoring change away from failing outright, and the likely-cause column names the rejection that nearly stopped it — the same diagnosis the failure block gives, surfaced before it becomes a failure.

The likely cause is rendered as the dominant rejection with its share of all placement attempts, so `World Colliding (412, 78%)` reads as "four in five candidate placements were rejected by world geometry".

For live progress, use the operation's own [progress delegates](../types/assembly-operation.md#progress) instead: `OnCombinedProgressChanged` blends completed-task counts with in-task channel progress, which is what the [Developer Overlay](../developer-overlay.md) displays.
