---
sidebar_class_name: type ue-object
description: A single World Assembly generation run — the object that owns a set of organs, drives their build, and reports progress and outcome.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Assembly Operation

<TypeDetails icon="ue-object" base="UObject" type="UNAssemblyOperation" typeExtra="" headerFile="NexusWorldAssembly/Public/Assembly/NAssemblyOperation.h" />

One generation run. An operation gathers the [Organs](organ-component.md) that will participate, resolves the order they must build in, drives the task graph that does the work, and reports progress and a result while it does so. Everything the [World Assembly Subsystem](world-assembly-subsystem.md) tracks is an operation.

## Lifecycle

An operation is not started directly — it is **created, filled, locked, then built**, and that ordering is enforced rather than conventional.

```cpp
UENUM(BlueprintType)
enum class ENWorldAssemblyOperationState : uint8
{
    None = 0,
    Registered = 1,
    Started = 2,
    Updated = 3,
    Finished = 4,
    Unregistered = 5
};
```

| State | Meaning |
| :-- | :-- |
| `None` | Created but not yet handed to a subsystem. |
| `Registered` | Known to the subsystem, not yet building. |
| `Started` | A build is in flight. |
| `Updated` | Progress has changed since the last notification. |
| `Finished` | The build completed — check [the result](#result) for whether it succeeded. |
| `Unregistered` | Torn down and released by the subsystem. |

`GetStringFromState(State)` converts a state to a display string. Note `Finished` says nothing about success; a failed build still finishes.

## Creation

Three static factories, differing only in how you name the organs to include:

```cpp
/** Build an operation from an explicit set of organ components. */
static UNAssemblyOperation* CreateInstance(const TArray<UNOrganComponent*>& Components, FNAssemblyOperationSettings& OperationSettings);

/** Build an operation from a weak-pointer set of objects; unresolved or non-organ entries are skipped. */
static UNAssemblyOperation* CreateInstance(const TArray<TWeakObjectPtr<UObject>>& Objects, FNAssemblyOperationSettings& OperationSettings);

/** Build an operation seeded from a single base organ component. */
static UNAssemblyOperation* CreateInstance(UNOrganComponent* BaseComponent, FNAssemblyOperationSettings& OperationSettings);
```

The weak-pointer overload is the one an editor selection feeds — it tolerates stale entries and silently skips anything that is not an organ. The single-component overload discovers the rest of the dependency set during `LockContext`.

:::warning[Determinism depends on the caller]

For the two array overloads, the components **must already be sorted by their `Identifier`**. The operation does not sort them for you, and the order it receives them in feeds the deterministic random stream — so an unsorted set produces a different layout from the same seed.

:::

## Building

| Method | Purpose |
| :-- | :-- |
| `AddToContext(Component)` | Appends an organ. Returns `false` if the context is already locked. |
| `ContainsComponent(Component)` | Whether an organ is part of this operation. |
| `LockContext(World)` | Resolves dependencies and the topological build order. Closes the context to further additions. |
| `IsLocked()` | Whether `LockContext` has run. |
| `StartBuild(Caller, CallerObject)` | Begins the build, reporting to an [Assembly Operation Owner](assembly-operation-owner.md). |
| `IsRunning()` | Whether a build is currently in flight. |
| `Cancel()` | Requests cancellation of the in-flight build. |
| `Reset()` | Clears transient state so the operation can be reused for another build. |
| `ApplySettings(Settings)` | Merges settings in, updating seed, display name, and level-instance behaviour. |

`StartBuild` takes the owner **twice** — once as the `INAssemblyOperationOwner` interface it will call back on, and once as a `UObject` used for weak-reference lifetime validation. That second parameter is what lets the operation notice its owner has been destroyed mid-build rather than calling into freed memory.

## Progress

Three `BlueprintAssignable` delegates, all safe to bind from a HUD or editor widget:

| Delegate | Fires when |
| :-- | :-- |
| `OnDisplayMessageChanged` | The status message changes. |
| `OnTasksChanged` | The completed/total task counts change. |
| `OnCombinedProgressChanged` | Combined progress changes, in the `0..1` range. |

Combined progress blends the completed-task count with in-task channel progress, so it advances smoothly rather than stepping once per task. `GetCombinedProgress()` reads the most recent value without waiting for a broadcast, and `SetStatusMessage()` updates the message and broadcasts in one step.

Each operation also carries a unique 32-bit `Ticket` from `GetTicket()`. That ticket is the key the [context cache](world-assembly-library.md) is addressed by, so it is how you correlate an operation with the tag state it produced.

## Result

```cpp
/** The outcome of a completed UNAssemblyOperation, surfaced to owners and UI. */
USTRUCT(BlueprintType)
struct FNAssemblyOperationResult
{
    bool bSuccess = false;      // completed successfully
    bool bWarning = false;      // completed, but with one or more warnings
    FText Title;                // short result title for display
    FText Message;              // detailed result message
    float Duration = 0.0f;      // total wall-clock time, milliseconds
    int32 CreatedCells = 0;     // cells created during the operation
};
```

`GetResult()` returns a snapshot. Note `bSuccess` and `bWarning` are independent — a successful operation may still carry warnings, so treat them as two separate questions rather than a three-state enum. `OutputReportToLog()` writes the whole thing to the log in one call.
