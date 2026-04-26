---
sidebar_position: 9
sidebar_label: ListView Entry
sidebar_class_name: type ue-interface
description: An interface that extends UUserObjectListEntry so entries hosted in a UNListView are handed a typed pointer to their owning list at construction.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# ListView Entry

<TypeDetails icon="ue-interface" base="interface" type="INListViewEntry" typeExtra=" / UNListViewEntry" headerFile="NexusUI/Public/INListViewEntry.h" />

An interface that extends `IUserObjectListEntry` so entries hosted inside a [UNListView](list-view.md) are handed back a typed pointer to their owning list at construction. The owner pointer is what makes it practical for an entry to talk to sibling rows or ask the list for selection state without resorting to widget-tree walks.

The interface is `BlueprintType`, so Blueprint-only widgets can implement it; the native virtual `SetOwnerListView` calls through to `Execute_OnSetOwnerListView`, which is the `BlueprintImplementableEvent` Blueprint subclasses can override.

## API

### Set Owner ListView (Native)

```cpp
/** Called by UNListView when the entry widget is created; forwards to OnSetOwnerListView. */
virtual void SetOwnerListView(UObject* Widget, UNListView* Owner)
{
    Execute_OnSetOwnerListView(Widget, Owner);
};
```

Native subclasses can override `SetOwnerListView` directly to cache the owner alongside any other initial wiring. For an example of this pattern see [UNButtonListViewEntry](button-list-view-entry.md), which captures the owner in a local `OwnerListView` `UPROPERTY`.

### On Set Owner ListView (Blueprint)

```cpp
/** Blueprint hook invoked with the owning UNListView; implement to cache the reference. */
UFUNCTION(BlueprintImplementableEvent)
void OnSetOwnerListView(UNListView* Owner);
```

Blueprint-only entries override this event to store the `Owner` reference locally.

## Usage

Implement this interface on any `UUserWidget` subclass that you want to use as an entry in a [UNListView](list-view.md). The two reusable entries shipped with the plugin — [UNButtonListViewEntry](button-list-view-entry.md) and [UNTextListViewEntry](text-list-view-entry.md) — both implement this interface, as do the per-plugin entries [UNActorPoolListViewEntry](/docs/plugins/actor-pools/types/actor-pool-list-view-entry.md) and [UNDynamicRefListViewEntry](/docs/plugins/dynamic-references/types/dynamic-ref-list-view-entry.md).
