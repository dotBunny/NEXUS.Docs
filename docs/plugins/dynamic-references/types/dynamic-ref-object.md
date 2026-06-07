---
sidebar_class_name: type ue-object
description: A Blueprint-friendly UObject wrapper around a single ENDynamicRef slot or FName bucket, used by the developer overlay.
tags: [0.2.7, 0.3.1]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# DynamicRef Object

<TypeDetails icon="ue-object" base="UObject" type="UNDynamicRefObject" typeExtra="" headerFile="NexusDynamicRefs/Public/NDynamicRefObject.h" />

A `UObject` wrapper around a single [ENDynamicRef](dynamic-ref.md) slot or `FName` bucket, giving Blueprints and UMG widgets a referenceable handle that can be bound into a list view. It is the shape the [Developer Overlay](../developer-overlay.md) uses to feed [UNDynamicRefListViewEntry](dynamic-ref-list-view-entry.md) rows; custom debug UIs can use it the same way.

## What It Is

- **Slot or Bucket**: Each instance targets exactly one [ENDynamicRef](dynamic-ref.md) value *or* one `FName`. The two factory overloads pick the mode at creation time; whichever is unset reads as `NDR_None` / `NAME_None`.
- **Mirrored State**: Holds its own `TArray<TWeakObjectPtr<UObject>>` that mirrors the registrations the [UNDynamicRefSubsystem](dynamic-ref-subsystem.md) currently has for that slot/bucket. The wrapper does not query the subsystem — it is fed via `AddObject` / `RemoveObject` by whatever owns it. Entries are weak, so an object that is destroyed without a matching `RemoveObject` simply goes stale rather than dangling.
- **Change Notification**: Fires its `Changed` `FSimpleDelegate` after every add/remove so bound UI can refresh without polling.

## Creation

Use one of the two static factories rather than `NewObject` directly:

```cpp title="By ENDynamicRef Slot"
UNDynamicRefObject* Obj = UNDynamicRefObject::Create(OverlayWidget, ENDynamicRef::NDR_Player);
```

```cpp title="By FName Bucket"
UNDynamicRefObject* Obj = UNDynamicRefObject::Create(OverlayWidget, FName("MyCustomBucket"));
```

The wrapper is created `RF_Transient` and remembers its `Outer` (typically the overlay widget). The `Outer` is also cast to a [UNDynamicRefsDeveloperOverlay](../developer-overlay.md) and stored — pass any other `UObject` and `GetOverlay()` will return `nullptr`.

## API

| Method | Returns / Effect |
| :-- | :-- |
| `GetDynamicRef()` | The targeted [ENDynamicRef](dynamic-ref.md) slot. Meaningful only when `GetTargetName()` is `NAME_None`. |
| `GetTargetName()` | The targeted `FName` bucket. `NAME_None` when the wrapper targets a slot. |
| `AddObject(UObject*)` | Appends the object to the mirrored list and broadcasts `Changed`. |
| `RemoveObject(UObject*)` | Removes the object from the mirrored list and broadcasts `Changed` (only when something was actually removed). |
| `GetCount()` | Number of **live** objects currently mirrored (stale weak entries are pruned first). |
| `GetReferenceText()` | Display label — the `FName` when set, otherwise the `ENDynamicRef`'s display name. |
| `GetObjects()` | Mutable view of the mirrored list, stale entries pruned first (native only). |
| `Compact()` | Prune entries whose object has been destroyed/GC'd so the wrapper only reflects live objects (native only). |

:::warning

The wrapper holds `TWeakObjectPtr` entries but is not a source of truth — it can drift from the [UNDynamicRefSubsystem](dynamic-ref-subsystem.md) if you forget to call `AddObject` / `RemoveObject` in response to the subsystem's `OnAdded` / `OnRemoved` delegates. The [Developer Overlay](../developer-overlay.md) handles this wiring; if you build a custom UI on top of these wrappers, mirror that pattern.

:::
