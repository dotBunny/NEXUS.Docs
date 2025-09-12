---
sidebar_position: 5
sidebar_label: Actor Pool Library
sidebar_class_name: type ue-blueprint-function-library
description: A small collection of functionality to help with connecting Blueprints to the native INActorPoolItem interface.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNActorPoolLibrary" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolLibrary.h" />

A small collection of functionality to help with connecting Blueprints to the native [INActorPoolItem](actor-pool-item.md) interface.

## Operational State

### Bind OnActorOperationalStateChanged

```cpp
/**
  * An inconvenient way to bind to the OnActorOperationalStateChanged delegate on an INActorPoolItem.
  * @note The function definition should be Function(const ENActorOperationalState OldState, const ENActorOperationalState NewState).
  * @param Actor The target Actor which implements the INActorPoolItem interface.
  * @param Object The UObject to bind to.
  * @param FunctionName The function name to bind to.
  */
static void BindOnActorOperationalStateChanged(const TScriptInterface<INActorPoolItem> Actor, UObject* Object, const FName FunctionName)
```


### Unbind OnActorOperationalStateChanged

```cpp
/**
  * Removes all bindings for the given Object to the OnActorOperationalStateChanged delegate.	 
  * @param Actor The target Actor which implements the INActorPoolItem interface.
  * @param Object The UObject to have its matched bindings removed.
  */
static void UnbindOnActorOperationalStateChanged(const TScriptInterface<INActorPoolItem> Actor, UObject* Object)
```