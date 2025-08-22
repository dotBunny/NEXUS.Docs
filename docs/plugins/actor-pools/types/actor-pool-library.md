---
sidebar_position: 5
sidebar_label: Actor Pool Library
sidebar_class_name: type ue-blueprint-function-library
description: A small collection of functionality to help with connecting Blueprints to the native INActorPoolItem interface.
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pool Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNActorPoolLibrary" typeExtra="" headerFile="NexusActorPools/Public/NActorPoolLibrary.h" />

A small collection of functionality to help with connecting Blueprints to the native [INActorPoolItem](actor-pool-item.md) interface.

## Functions

### Bind OnActorOperationalStateChanged

A utility method to allow for Blueprints and any `UFUNCTION` defined methods to be bound to the native interface's state change delegate. The named `FunctionName` must match the delegates expected expression of taking two `ENActorOperationalState` enums as inputs.

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Bind OnActorOperationalStateChanged", Category = "NEXUS|Actor Pool")
static void BindOnActorOperationalStateChanged(const TScriptInterface<INActorPoolItem> Actor, UObject* Object, const FName FunctionName)
```


### Unbind OnActorOperationalStateChanged

Unbinds all bound functions from a given `Object` to the `Actor`'s `OnActorOperationalStateChanged` delegate.

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Unbind OnActorOperationalStateChanged", Category = "NEXUS|Actor Pool")
static void UnbindOnActorOperationalStateChanged(const TScriptInterface<INActorPoolItem> Actor, UObject* Object)
```