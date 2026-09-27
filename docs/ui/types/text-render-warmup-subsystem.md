---
sidebar_class_name: type ue-world-subsystem
description: Creates every text render's font materials on the game thread before the level holding it registers, so streaming a level in never makes UObjects on a worker thread.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Text Render Warmup Subsystem

<TypeDetails icon="ue-world-subsystem" base="UWorldSubsystem" type="UNTextRenderWarmupSubsystem" typeExtra="" headerFile="NexusUI/Public/NTextRenderWarmupSubsystem.h" />

This subsystem fixes an engine threading problem with 3D text. You don't need to call it or configure it; it is on by default.

## The Problem

A `UTextRenderComponent` draws through material instances that the engine creates on demand, one per page of the font, the first time a given **(material, font)** pair is used. It normally doesn't matter where that happens.

When a level is **loaded or streamed in** (World Partition cells and level instances included), its components are registered from a parallel loop. The first text render of a new pair in that level therefore creates its material instances on a **worker thread**:

- **Debug builds** assert inside the material's game-thread checks when Substrate is on.
- **Every other build** creates `UObject`s off the game thread without any warning, which is the kind of thing that stays quiet until it doesn't.

## The Fix

Before a level's components register, the subsystem finds every (material, font) pair used by a loaded text render. For each pair it registers one empty, ownerless text render **on the game thread**. That text render's scene proxy creates the pair's material instances there, and because the component stays registered for the life of the world, the engine's cache keeps them. When the level's own text renders register a moment later, the materials already exist.

- **When it looks.** Once at world initialization (`PostInitialize`, before the persistent level registers), and again whenever a streamed level or World Partition cell **begins becoming visible**. The level has loaded by then but not yet registered.
- **What it looks at.** The engine's list of live text-render objects, not a walk of each level's actors. A check costs as much as the number of text renders loaded.
- **Which fonts.** Only **offline** (distance-field) fonts draw through that cache; a runtime font never asks it, so it is skipped.
- **What it costs.** One invisible component per distinct pair. The warm-up text is empty, so it builds no geometry and draws nothing.
- **Cleanup.** Everything is destroyed when the world is cleaned up. It has to happen then, or the engine reports the ownerless components as leaked.

A text render **spawned at runtime** already registers on the game thread and needs none of this.

## When It Exists

Created only for **Game and PIE** worlds, on a machine that can render. There is nothing to warm on a dedicated server or in a `-nullrhi` run, where no scene proxies are made. Turning off [`Warm Text Render Materials`](../project-settings.md) stops it being created at all. The setting is read when a world is created.

## Public API

```cpp
void WarmLoadedTextRenders();
bool IsWarm(const UMaterialInterface* Material, const UFont* Font) const;
int32 GetWarmPairCount() const;
```

- **`WarmLoadedTextRenders()`** warms every pair a loaded text render uses. The subsystem calls it itself at the two moments above. Call it yourself only if you load text renders **some other way** that the subsystem doesn't hear about, before a parallel registration reaches them.
- **`IsWarm()`** reports whether a pair has been warmed in this world. A null material means the engine's default text material, exactly as the text render itself treats it.
- **`GetWarmPairCount()`** is the number of pairs warmed so far, which is handy in a test.

Each warmed pair is logged to `LogNexusUI` at `Verbose`.

```cpp title="Warming after loading text renders yourself"
if (UNTextRenderWarmupSubsystem* Warmup = GetWorld()->GetSubsystem<UNTextRenderWarmupSubsystem>())
{
	Warmup->WarmLoadedTextRenders();
}
```
