---
sidebar_class_name: type native-class
description: Editor-time utilities for telling a finished terrain build from one still landing sections, by fingerprint or by waiting.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Terrain Utils

<TypeDetails icon="native-class" base="class" type="FNTerrainUtils" typeExtra="" headerFile="NexusCoreEditor/Public/NTerrainUtils.h" />

Editor-time utilities for working with a level's terrain **while it is still being built**.

Mesh Partition lands an authored terrain's sections across many frames and exposes no barrier covering the whole pipeline. Anything that measures a level — bounds, a hull, a voxel field, a collision cache — therefore has to know whether it is looking at finished geometry or at a build in progress, and these are how it finds out.

Both work off the terrain classification in [FNActorUtils](../types/actor-utils.md), so they cover every terrain representation that recognizes.

## Settling Is Inferred, Not Queried

There is no engine-side "is the terrain finished" call to make. A direct *is anything unbuilt* test would also never clear for a section that legitimately covers nothing, which would hold the gate shut forever.

So settling is inferred from the geometry **holding still**: fingerprint the terrain, and treat the build as finished once the fingerprint has not moved for `SettleSeconds` (0.35). Inference is what makes the answer always eventually arrive.

## Methods

### Compute Fingerprint

```cpp
/**
 * Summarize a level's terrain geometry so a build still landing sections can be told from a finished one.
 * @param InLevel Level to summarize. A null level, or one with no terrain, returns 0.
 * @return A hash that changes whenever the terrain geometry does.
 * @note Quantized to whole units, so float jitter in an otherwise settled bound does not read as movement.
 */
static uint32 ComputeFingerprint(const ULevel* InLevel);
```

The hash folds in each terrain actor's built-components bounding box, quantized to whole units. A terrain actor whose components all still report **placeholder bounds** folds in a marker instead of being skipped — that is what makes the later transition to real geometry register as a change rather than passing unnoticed.

Cheap enough to poll on a tick, which is how a passive consumer uses it: the [World Assembly editor mode](../../world-assembly/editor-mode/index.mdx) fingerprints on `ModeTick` and greys its [calculate commands](../../world-assembly/editor-mode/cell.md#commands) out until the value holds still.

### Wait For Settle

```cpp
/**
 * Block until the level's terrain geometry stops changing, pumping the systems a terrain build depends on.
 *
 * @param InLevel Level whose terrain to wait on. A null level returns true immediately.
 * @param TimeoutSeconds Give up after this long and report failure rather than blocking the editor forever.
 * @return true when the terrain settled; false on timeout.
 */
static bool WaitForSettle(const ULevel* InLevel, double TimeoutSeconds = NEXUS::CoreEditor::Terrain::DefaultSettleTimeoutSeconds);
```

The active counterpart: rather than waiting for a caller's next tick, it pumps the work itself and returns once the fingerprint has settled. It opens a slow-task dialog, so the user is told why the editor stopped responding.

It advances exactly what a terrain build depends on, and no more:

| Pumped | Why |
| :-- | :-- |
| `FTickableEditorObject::TickObjects` | Carries `UMeshPartitionEditorSubsystem`, which promotes finished build tasks into section actors. |
| `FAssetCompilingManager::ProcessAsyncTasks` | Builds the section static meshes. |
| `FTSTicker` core ticker | Drives the deferred work behind both. |

Neither Slate nor a full engine tick is pumped, so the editor stays visually frozen for the duration.

On timeout it logs a warning naming the level and returns `false`; the caller is then knowingly measuring a partially built terrain rather than being told nothing happened.

:::danger[Never Call This From Inside a Save]

Pumping ticks editor objects, and a Mesh Partition tick **spawns and destroys section actors**. During `UEditorEngine::SavePackage` that mutates the world mid-write.

Call it where a save or a calculation is *initiated*, ahead of the engine's save machinery. World Assembly's [Force Save](../../world-assembly/editor-mode/cell-data.md#data) does exactly that — the wait happens in the command, not inside the save it triggers.

:::

## Tuning

Both constants live in `NEXUS::CoreEditor::Terrain`, in `NCoreEditorMinimal.h`.

| Constant | Value | Description |
| :-- | :-- | :-- |
| `SettleSeconds` | `0.35` | How long the fingerprint must hold still before the build is treated as finished. |
| `DefaultSettleTimeoutSeconds` | `30.0` | How long `WaitForSettle` blocks before giving up. |

`SettleSeconds` is public rather than private to `WaitForSettle` because settling is inferred **two ways** — passively by a caller polling `ComputeFingerprint` on its own tick, and actively by `WaitForSettle`. The two disagreeing would mean a button re-enabling at a different moment than a wait returns, so both read the same value.

Its size is a trade: too short and a gap between two sections landing reads as the end of the build; too long and every calculation pays the difference.
