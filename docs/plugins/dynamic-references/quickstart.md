---
sidebar_position: 1
sidebar_label: Quickstart
description: What you need to know to get up and running fast using NDynamicReferences.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

## Add Component

Add a [UNDynamicReferenceComponnet](types/dynamic-reference-component.md) to an `AActor` (*most likely your doing this on a `Blueprint`*), and assign it's References from the details inspector.

![NDynamicReferencesComponent](types/dynamic-references-component.webp)

## Getting Actor References

Accessing the [UNDynamicReferencesSubsystem](types/dynamic-reference-subsystem.md#getting-actor-references), referenced `AActors` can be queried.