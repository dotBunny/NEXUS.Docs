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
| `FNConnectJunctionsAnalytics` | What happened to every candidate pair the [junction-connector pass](tasks.md#junction-connecting) considered. See [Junction Connecting](#junction-connecting). |

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

## Junction Connecting

`FNConnectJunctionsAnalytics` breaks down what happened to every candidate pair the [connector pass](tasks.md#junction-connecting) considered.

**Which rejection dominates is the useful signal** when a layout connects up less than expected: a wall of length rejections points at the spline-length budget, a wall of collision rejections at the routing settings or at the layout simply being too dense.

### Population

| Counter | Meaning |
| :-- | :-- |
| `Open Junctions` | Junctions the graph builders left unmatched, and which this pass therefore considered. |
| `Disabled Junctions` | Unmatched junctions carrying [`Disable Connecting`](../types/junction-component.md#disable-connecting), which the routing walk skipped. |
| `Inverse Matched` | Junctions mated to a coincident, oppositely-facing partner rather than routed to one, counted **per pairing**. |
| `Candidate Pairs` | Pairs that cleared the cheap gates (different cell, matching socket size, within range) and were routed. |
| `Accepted` | Pairs that produced a clear route and were recorded. |

:::note[Two Counters That Are Not Deductions]

`Disabled Junctions` is a **subset** of `Open Junctions`, not a deduction from it — those junctions remain eligible for coincidence matching, which spawns no connector for them to have opted out of.

`Inverse Matched` pairings never reach the routing walk at all, so they are absent from `Candidate Pairs` and from every rejection counter. A layout that suddenly connects up better after enabling [`Connect Coincidences`](../project-settings.md#coincident-mating) shows it **here**, not in `Accepted`.

:::

### Rejections

| Counter | Meaning |
| :-- | :-- |
| `Rejected (Angle)` | The two junctions were not [oriented](../project-settings.md#orientation-gating) sensibly enough with respect to each other. |
| `Rejected (Existing Connection)` | The two cells were already joined and [`Allow Multiple Cell Connections`](../project-settings.md#one-connection-per-cell-pair) is off. |
| `Rejected (Length)` | No variant of the route fit inside `Maximum Spline Length`. |
| `Rejected (Collision)` | Every variant of the route hit geometry. |
| `Rejected (Turn Radius)` | No variant turned gently enough for [`Minimum Turn Radius Scale`](../project-settings.md#turn-radius). |
| `Rejected (Folded)` | The tightest variant would have folded the connector's geometry through itself. |

Two of these sit apart from the rest:

- **`Rejected (Angle)` is the only rejection counted *before* a pair becomes a candidate**, so unlike every other counter it is absent from `Candidate Pairs` rather than a breakdown of it. It is broken out because a gate that silently halves the candidate count is otherwise invisible — a large number here against few acceptances points at the angle limits, not at the routing budget.
- **`Rejected (Existing Connection)` is counted before any routing is attempted**, so these cost nothing beyond the lookup. A high number here means the layout mates densely, not that connectors are failing.

`Rejected (Folded)` is a **subset** of the turn-radius rejections, broken out because it is a validity failure rather than a tuning one — those pairs are rejected no matter how the minimum radius is configured.

### Retries

| Counter | Meaning |
| :-- | :-- |
| `Straightening Attempts` | Straighter variants attempted across every pair, including those that went on to fail anyway. |
| `Straightening Successes` | Pairs that only succeeded because a straighter variant cleared where the configured tangent scale did not. |
| `Avoidance Attempts` | Detour variants attempted across every pair, including those that went on to fail. |
| `Avoidance Successes` | Pairs that only succeeded because a detour variant cleared where the direct route did not. |
| `Connector Hulls` | Swept prisms retained as collision for subsequent pairs to route around. |

A high attempt count against a low success count is the signal to loosen the corresponding budget rather than raise the attempt ceiling.

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

**Timespans** is the cost breakdown — an overview row per stage, then a table per stage type: one row per organ (with its iteration count, draw count, and status), one per pass phase, one for the connector stage, and one per spawn slice. Read it to find *where* the time went.

**Insights** is the diagnosis, and it only appears when there is something to say:

| Block | Appears when | Carries |
| :-- | :-- | :-- |
| `Failures` | Any organ failed | Its cell count against its minimum, the **likely cause**, and the specific failure reason. |
| `Strained Successes` | An organ succeeded but consumed retries | Retries used against the budget, plus the same likely-cause column. |

`Strained Successes` is the one to look at on a build that is *working*. An organ that needed four attempts to pass is one authoring change away from failing outright, and the likely-cause column names the rejection that nearly stopped it — the same diagnosis the failure block gives, surfaced before it becomes a failure.

The likely cause is rendered as the dominant rejection with its share of all placement attempts, so `World Colliding (412, 78%)` reads as "four in five candidate placements were rejected by world geometry".

For live progress, use the operation's own [progress delegates](../types/assembly-operation.md#progress) instead: `OnCombinedProgressChanged` blends completed-task counts with in-task channel progress, which is what the [Developer Overlay](../developer-overlay.md) displays.
