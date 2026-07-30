---
sidebar_class_name: type native-class
description: The timing and counter records each task-graph stage captures, and how they aggregate into an operation report.
---

# Analytics

Every [task](tasks.md) stage records what it cost. Those records aggregate into one report per [Assembly Operation](../types/assembly-operation.md), which is what makes a slow generation diagnosable rather than merely slow.

All of this is internal and **debug-only** — none of it is Blueprint-exposed, and none is intended to drive gameplay decisions.

## The Aggregate

`FNAssemblyTaskAnalytics` collects timing and counters for one operation's entire task-graph build. Stages call `Start`/`Finish` helpers as they run, and the report is produced once everything has drained.

The per-organ and per-pass stages work differently from the rest, because there can be many of each: they **allocate a record up front** via a `*Create()` call and then address it by the returned **index** for the remainder of the build. That indirection is what lets several organ builds record into the same aggregate concurrently without contending over a shared cursor.

## Per-Stage Records

| Record | Captures |
| :-- | :-- |
| `FNOrganGraphBuilderAnalytics` | Wall-clock cost of one organ build, the number of **retry iterations** consumed, and per-iteration counters for candidate nodes added or rejected. |
| `FNProcessPassAnalytics` | Which generation **phase** the task belonged to, plus how long the pass-collection step took to drain its inputs. |
| `FNSpawnCellProxiesAnalytics` | Every cell template spawned during the pass, plus the wall-clock cost of the spawn step. |

The organ record is the one worth reading first when a build is slow. Retry iterations are the signal that generation is *failing and re-rolling* rather than simply doing a lot of work — a graph that cannot satisfy its constraints regenerates, and the per-iteration add/reject counters show where candidates are dying.

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

The aggregate produces a timespan report once the graph has drained — the same data the operation writes when asked to log its outcome. Because the report is only complete after [`FNAssemblyFinalizeTask`](tasks.md) has run, it is a post-mortem rather than a live progress feed.

For live progress, use the operation's own [progress delegates](../types/assembly-operation.md#progress) instead: `OnCombinedProgressChanged` blends completed-task counts with in-task channel progress, which is what the [Developer Overlay](../developer-overlay.md) displays.
