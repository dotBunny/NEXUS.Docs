---
description: A highlight reel for the User Interface plugin and its additions over time.
---

# User Interface

## 0.4.0

### 3D Text That Streams In Safely

Stream in a World Partition cell full of `UTextRenderComponent`s and the engine quietly creates their font material
instances on a **worker thread**. A Debug build with Substrate on asserts. Every other build just creates `UObject`s off
the game thread and says nothing.

The new [Text Render Warmup Subsystem](/docs/dev/ui/types/text-render-warmup-subsystem) notices each (material, font)
pair a loaded text render uses and creates its materials on the **game thread** first, before the level registers. It
costs one invisible component per pair. It is on by default in Game and PIE worlds, and it is switched off under
[`Project Settings > NEXUS > User Interface`](/docs/dev/ui/project-settings) if you ever need to.
