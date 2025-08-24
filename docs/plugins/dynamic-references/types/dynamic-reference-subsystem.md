---
sidebar_position: 3
sidebar_label: Dynamic References Subsystem
sidebar_class_name: type ue-world-subsystem
description: A locator system that maintains a map that organizes actors into predefined categories.
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

