---
sidebar_position: 3
sidebar_label: Dynamic References Subsystem
sidebar_class_name: type ue-world-subsystem
description: A locator system that maintains a map that organizes actors into predefined categories.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Actor Pool Subsystem

<TypeDetails icon="ue-world-subsystem" base="UTickableWorldSubsystem" type="UNDynamicReferencesSubsystem" typeExtra="" headerFile="NexusDynamicReferences/Public/NDynamicReferencesSubsystem.h" />

A locator system that maintains a map (`ReferenceMap`) that organizes actors into predefined categories defined by the [ENDynamicReference](dynamic-reference.md) enumeration.

## Getting Actor References

Accessing referenced `AActor` can be done with minimal overhead.

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/mtm1wms1/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '400px' }}></iframe>

:::note

In the above blueprint example, the [UNDynamicReferenceComponnet](dynamic-reference-component.md) would need to have its `Link Phase` set to `ACLS_InitializeComponent` in order to ensure it is registered prior to a hypothetical `BeginPlay()` event.

:::  
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Getting Dynamic References"
for (TArray<AActor*>& ReferencedActors = UNDynamicReferenceSubsystem::Get(GetWorld())->GetReferences(ENDynamicReference::NDR_Item_L);
  AActor*& Actor : ReferencedActors)
{
  // Do something with Actor
}
```    
  </TabItem>
</Tabs>

## UFunctions

### Add Reference

```cpp
/**
  * Add a reference by ENDynamicReference to a specified AActor.
  * @remark Be careful with the manual add method. If you add it, you must remove it!
  * @param InType The desired dynamic reference type to add too.
  * @param InActor The AActor to be referenced by the InType.
  */
void AddReference(ENDynamicReference InType, AActor* InActor);
```

:::tip

The [UNDynamicReferenceComponent](dynamic-reference-component.md) automatically manages the registration lifecycle.

:::

### Remove Reference
```cpp
/**
  * Remove a reference by ENDynamicReference to a specified AActor.
  * @param InType The desired dynamic reference type to remove from.
  * @param InActor The AActor to be have its reference removed by the InType.
  */
void RemoveReference(ENDynamicReference InType, AActor* InActor);
```

### Get References

```cpp
/**
  * Gets the array of AActors dynamically associated with the provided type.
  * @param InType The desired dynamic reference type to access.
  * @return An array of AActors. 
  */
TArray<AActor*>& GetReferences(const ENDynamicReference InType) { return ReferenceMap[InType]; }
```

