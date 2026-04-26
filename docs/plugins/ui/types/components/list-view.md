---
sidebar_position: 8
sidebar_label: ListView
sidebar_class_name: type ue-widget
description: A UCommonListView subclass that hands each generated entry widget back its owning list, with a weak reference-object slot for stashing context.
tags: [0.2.7]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# ListView

<TypeDetails icon="ue-widget" base="UCommonListView" type="UNListView" typeExtra="" headerFile="NexusUI/Public/Components/NListView.h" />

A `UCommonListView` subclass that invokes [INListViewEntry](../list-view-entry.md)`::SetOwnerListView` on each generated entry widget. Entry widgets that implement the interface are handed back a typed pointer to their owning list, which is the missing piece needed to talk to sibling rows or query selection state from inside an entry.

Also exposes a weak `ReferenceObject` slot so an outer object can be stashed on the list and retrieved from inside entry widgets — useful when a row needs to bind to a view-model without each row having to look it up independently.

## What It Is

- **Owner-Aware Entries**: The `OnGenerateEntryWidgetInternal` override checks whether the new widget implements [INListViewEntry](../list-view-entry.md) and, if so, calls `SetOwnerListView` on it. Native implementers receive the call directly; Blueprint-only implementers receive `OnSetOwnerListView` via `Execute_*`.
- **Reference Slot**: A `TWeakObjectPtr<UObject>` field surfaced as `Get`/`SetReferenceObject`. The weak handle means a stashed reference does not keep the outer object alive — entries must check for `nullptr` before using it.

## API

### Set Reference Object

```cpp
/** Stash an arbitrary outer reference on the list so entries can retrieve it during construction. */
UFUNCTION(BlueprintCallable)
void SetReferenceObject(UObject* Object);
```

### Get Reference Object

```cpp
/** @return the previously-stashed reference object, or nullptr if it has been GC'd. */
UFUNCTION(BlueprintCallable)
UObject* GetReferenceObject() const;
```

## Usage

The shipped overlays use `UNListView` heavily — see [UNActorPoolListViewEntry](/docs/plugins/actor-pools/types/actor-pool-list-view-entry.md) and [UNDynamicRefListViewEntry](/docs/plugins/dynamic-references/types/dynamic-ref-list-view-entry.md) for entries that take advantage of `SetOwnerListView` to call back into their host. The simpler [UNButtonListViewEntry](../widgets/button-list-view-entry.md) and [UNTextListViewEntry](../widgets/text-list-view-entry.md) widgets are reusable rows you can drop into any `UNListView`.
