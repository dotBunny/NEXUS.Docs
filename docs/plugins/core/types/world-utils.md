---
sidebar_class_name: type native-class
description: A collection of native utility methods for working with worlds.
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Utils

<TypeDetails icon="native-class" base="class" type="FNWorldUtils" typeExtra="" headerFile="NexusCore/Public/NWorldUtils.h" />

A small header-only collection of native helpers for questions about the *current* world that the engine makes awkward to ask. Both methods are static and inline, so there is nothing to construct and no module boundary to cross.

## Methods

### Get Game World

```cpp
/** @return The first active Game or PIE world, or nullptr if none exists. */
static UWorld* GetGameWorld();
```

Walks `GEngine->GetWorldContexts()` and returns the first context whose type is `Game` or `PIE`. This is the helper to reach for in editor-side code that needs the world a designer is actually playing in — an editor utility widget or a visualizer has no world of its own, and the editor's own preview world is not the one you want.

Returns `nullptr` outside a session, so callers must handle that rather than assuming a world exists.

:::note

When more than one `Game`/`PIE` world is active — a PIE session running a server and a client — this returns whichever the engine lists first. Code that must handle every world should iterate the contexts itself; see how [`UNDeveloperOverlay`](../../ui/types/widgets/developer-overlay.md) tracks all of them.

:::

### Is Streaming

```cpp
/** @return true while any of InWorld's streaming levels is still resolving. */
static bool IsStreaming(const UWorld* InWorld);
```

Reports whether the world still has level-streaming work in flight, by checking every `ULevelStreaming` for either of two conditions:

- The level is **loaded but not yet visible** while it wants to be visible — it has come off disk but has not finished being added to the world.
- The level **has a load request pending** — it has not come off disk yet.

A null world reports `false`. This is what [`UNWorldAssemblySubsystem::IsReady`](../../world-assembly/types/world-assembly-subsystem.md#readiness) consults when its `bWaitOnStreaming` parameter is left at its default, so a caller that wants readiness to ignore streaming can gate on operation state alone instead.
