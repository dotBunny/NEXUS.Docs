---
sidebar_class_name: type native-interface
description: Interface implemented by anything that owns a UNAssemblyOperation, receiving its lifecycle callbacks.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Assembly Operation Owner

<TypeDetails icon="native-interface" base="class" type="INAssemblyOperationOwner" typeExtra="" headerFile="NexusWorldAssembly/Public/Assembly/INAssemblyOperationOwner.h" />

The contract an owner of an [Assembly Operation](assembly-operation.md) fulfils. An operation routes its lifecycle back through this interface, which is what lets a runtime flow and an editor flow drive the same operation while specialising what happens around it.

Three things implement it today: the runtime [World Assembly Subsystem](world-assembly-subsystem.md), the editor subsystem, and the [editor mode](../editor-mode/index.mdx).

:::note

This is a **plain C++ interface**, not a `UINTERFACE` — there is no `UN*` companion class and it is not exposed to Blueprint. Implement it on a native type only.

:::

## The Contract

All four methods are pure virtual; an implementor must provide every one.

```cpp
/**
 * Called when the operation is ready to begin executing its task graph.
 * @param Operation The operation that is starting.
 */
virtual void StartOperation(UNAssemblyOperation* Operation) = 0;

/**
 * Called after all tasks in the operation have completed.
 * @param Operation The operation that finished.
 * @param TaskGraphContext Context carrying the results of the completed task graph.
 */
virtual void OnOperationFinished(UNAssemblyOperation* Operation, TSharedRef<FNAssemblyTaskGraphContext> TaskGraphContext) = 0;

/**
 * Called when the operation is being destroyed so the owner can drop references and run cleanup.
 * @param Operation The operation being destroyed.
 */
virtual void OnOperationDestroyed(UNAssemblyOperation* Operation) = 0;

/** @return The world the owner considers authoritative for any operation it drives. */
virtual UWorld* GetDefaultWorld() = 0;
```

| Callback | Your responsibility |
| :-- | :-- |
| `StartOperation` | The operation is ready to run its task graph. Kick it off, or defer it if you are pacing work. |
| `OnOperationFinished` | Every task has completed. The `TaskGraphContext` carries the results — read what you need from it here, because it is released afterwards. |
| `OnOperationDestroyed` | Drop your references and clean up. Called during teardown, so do not assume the operation is still usable. |
| `GetDefaultWorld` | Answer which world you consider authoritative. The runtime and editor implementations differ here, which is the main reason the interface exists. |

## Why It Is Split This Way

`GetDefaultWorld` is the crux. A runtime subsystem has exactly one world and returns it. The editor has several — the level being edited, any PIE worlds, preview worlds — and must choose. Routing the question through the owner means an operation never has to know which context it is running in.

`OnOperationFinished` receives the task graph context by `TSharedRef` rather than the operation alone, because the results live on the context and not on the operation. See [Assembly Operation](assembly-operation.md#result) for the summarised outcome that *is* retained on the operation.
