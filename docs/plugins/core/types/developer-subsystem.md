---
sidebar_position: 2
sidebar_label: Developer Subsystem
sidebar_class_name: type ue-world-subsystem
description: A management subsystem to monitor object usage/counts and capture and compare when triggered.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Developer Subsystem

<TypeDetails icon="ue-world-subsystem" base="UTickableWorldSubsystem" type="UNDeveloperSubsystem" typeExtra="" headerFile="NexusCore/Public/Developer/NDeveloperSubsystem.h" />

A management subsystem to monitor object usage/counts and capture and compare when triggered.



<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/jg3v_i32/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '325px' }}></iframe>
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Set Delayed Baseline"
FTimerHandle SetBaselineTimerHandle;
GetWorld()->GetTimerManager().SetTimer(SetBaselineTimerHandle, UNDeveloperSubsystem::Get(GetWorld()), &UNDeveloperSubsystem::SetBaseline,1.0f, false);
```    
  </TabItem>
</Tabs>

automated setting to checks


setBaseline


settings
require enable

console commands
