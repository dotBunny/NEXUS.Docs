---
sidebar_position: 25
sidebar_label: Box Utils
sidebar_class_name: type native-class
description: A collection of utility methods for working with FBoxes.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Box Utils

<TypeDetails icon="native-class" base="class" type="FNBoxUtils" typeExtra="" headerFile="NexusCore/Public/Math/NBoxUtils.h" />

A collection of utility methods for working with `FBoxes`.

## Methods

### Get Vertices

Returns the eight world-space corners of the supplied box.

```cpp
/**
 * Returns the eight world-space corners of the supplied box.
 * @param Box The box to enumerate.
 * @return An array containing all eight corner vertices of Box.
 */
static TArray<FVector> GetVertices(const FBox& Box);
```
