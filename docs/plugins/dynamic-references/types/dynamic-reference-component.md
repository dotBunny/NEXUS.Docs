---
sidebar_position: 1
sidebar_label: Dynamic Reference Component
sidebar_class_name: type ue-actor-component
description: TBD
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Dynamic Reference Component

<TypeDetails icon="/assets/svg/dynamic-references/dynamic-references-component.svg" iconType="img" base="UActorComponent" type="UNDynamicReferencesComponent" typeExtra="" headerFile="NexusDynamicReferences/Public/NDynamicReferencesComponent.h" />

- An Actor Component that can be added to any actor
- Allows actors to register themselves with specific **reference types** (defined by an enum `ENDynamicReference`)
- Has configurable lifecycle phases:
    - **LinkPhase**: When references should be linked (e.g., during `BeginPlay`)
    - **BreakPhase**: When references should be broken (e.g., during `EndPlay`)

- Contains an array of `References` that define what types of dynamic references this actor provides
