---
sidebar_label: Details View
sidebar_class_name: type ue-widget
description: A wrapper around the UDetailsView class that exposes the otherwise-protected OnPropertyValueChanged delegate to native callers.
tags: [0.1.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Details View

<TypeDetails icon="ue-widget" base="UDetailsView" type="UNDetailsView" typeExtra="" headerFile="NexusUIEditor/Public/Components/NDetailsView.h" />

A wrapper around the `UDetailsView` widget whose only job is to surface the `OnPropertyValueChanged` delegate. The delegate is `protected` on the base class — subclassing is the only way to expose it to native callers that need to react to property edits inside an embedded details panel (for example, to refresh a sibling preview when the user changes a value).

`UNDetailsView` is `final` and adds no other state.

## API

### Get On Property Value Changed Ref

```cpp
/**
 * Get a reference to the internal OnPropertyValueChanged on the UDetailsView.
 * @return Delegate holder for the OnPropertyValueChanged event.
 */
FOnPropertyValueChanged* GetOnPropertyValueChangedRef();
```

Subscribe via the returned pointer, e.g.:

```cpp
DetailsView->GetOnPropertyValueChangedRef()->AddRaw(this, &FMyTool::HandlePropertyChanged);
```
