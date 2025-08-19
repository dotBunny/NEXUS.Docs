---
sidebar_position: 8
sidebar_label: Actor Pool Subsystem
sidebar_class_name: type ue-world-subsystem
description: A centralized management system that provides UWorld-specific access to AActor pooling functionality, acting as the primary interface for creating, managing, and accessing multiple FNActorPools.
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Subsystem

<TypeDetails icon="ue-world-subsystem" base="UTickableWorldSubsystem" type="UNActorPoolSubsystem" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolSubsystem.h" />

A centralized management system that provides `UWorld`-specific access to `AActor` pooling functionality, acting as the primary interface for creating, managing, and accessing multiple [FNActorPools](actor-pool.md).

## What It Does

- **Unified Experience:** Provides simple methods to get, spawn, and return `AActor` without directly managing [FNActorPools](actor-pool.md).
- **Centralized Pool Management:** Automatically creates and maintains pool lifecycles for different `AActor` sub-classes as requested.
- **Blueprint Accessible:** Offers preferred Blueprint support for designers and non-programmers.

## Usage

### Creating An Actor Pool

#### By Request

#### Actor Pool Sets

### Spawning An Actor

### Returning An Actor