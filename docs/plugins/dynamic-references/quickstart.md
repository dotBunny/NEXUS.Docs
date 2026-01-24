---
sidebar_position: 1
sidebar_label: Quickstart
description: What you need to know to get up and running fast using NDynamicRef.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

## Add Component

Add a [UNDynamicRefComponnet](types/dynamic-ref-component.md) to an `AActor` (*most likely your doing this on a `Blueprint`*), and assign it's References from the details inspector.

![NDynamicRefComponent](types/dynamic-ref-component.webp)

## Getting Actor References

Accessing the [UNDynamicRefSubsystem](types/dynamic-ref-subsystem.md#getting-actor-references), referenced `AActors` can be queried.