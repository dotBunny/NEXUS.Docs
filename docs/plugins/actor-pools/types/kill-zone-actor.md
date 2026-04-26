---
sidebar_position: 9
sidebar_label: Kill Zone Actor
sidebar_class_name: type ue-actor
description: A kill plane implementation built to automatically pool properly configured AActor upon overlap.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Kill Zone Actor

<TypeDetails icon="/assets/svg/actor-pools/kill-zone-component.svg" iconType="img" base="AActor" type="ANKillZoneActor" typeExtra="" headerFile="NexusActorPools/Public/NKillZoneActor.h" />

An easily placeable `AActor` whose root component is a [UNKillZoneComponent](kill-zone-component.md) configured with `Static` mobility. Drop one into a level via the placement browser when you want a kill volume without authoring a Blueprint — the configurable behaviour (ignore-static, ignore-non-interfaced) all lives on the component, which can be edited inline on the placed Actor.

For dynamic or Blueprint-composed setups, add a [UNKillZoneComponent](kill-zone-component.md) to your own `AActor` directly rather than subclassing this Actor.