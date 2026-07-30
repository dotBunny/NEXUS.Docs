---
sidebar_class_name: type ue-actor
description: A standalone bone actor — a UNBoneComponent wrapped in a static actor so it can be dropped directly into a level.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Bone Actor

<TypeDetails icon="ue-actor" base="AActor" type="ANBoneActor" typeExtra="" headerFile="NexusWorldAssembly/Public/Organ/NBoneActor.h" />

A [Bone Component](bone-component.md) wrapped in a bare actor, for when you want a bone in a level without attaching one to an existing actor or using the bone bundled into an [Organ Volume](organ-volume.md).

## What It Is

- **A thin wrapper**: the bone component is created as the root component in the constructor. There are no other components and no additional settings — everything meaningful lives on [Bone Component](bone-component.md).
- **Static**: the root component's mobility is forced to `Static`. Bones anchor generation at author time; they are not intended to move at runtime.
- **Non-ticking**: ticking is disabled outright (`bCanEverTick = false` and `bStartWithTickEnabled = false`), so a level full of bones costs nothing per frame.

The component is exposed as a `VisibleAnywhere, BlueprintReadOnly` property, so it can be read but not swapped.

## When To Use It

| Situation | Use |
| :-- | :-- |
| A region for World Assembly to populate | [Organ Volume](organ-volume.md) — it already bundles a bone. |
| A bone on an actor you already have | Add a [Bone Component](bone-component.md) to it directly. |
| A bone with nothing else attached | This actor. |

:::warning[Multi-bone support is not complete]

Only the bone built into an [Organ Volume](organ-volume.md) is currently used as a generation starting point. Placing standalone `ANBoneActor` instances does not yet extend generation to them — cell placement between bones and bone-to-bone connections across organs are targeted for `0.4.0`. See [Bone Component](bone-component.md) for the current state.

:::
