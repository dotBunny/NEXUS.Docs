---
sidebar_class_name: type ue-world-subsystem
description: A locator system that maintains a map that organizes actors into predefined categories.
tags: [0.1.0, 0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import VersionBadge from '../../../../src/components/VersionBadge';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# DynamicRef Subsystem

<TypeDetails icon="ue-world-subsystem" base="UWorldSubsystem" type="UNDynamicRefSubsystem" typeExtra="" headerFile="NexusDynamicRefs/Public/NDynamicRefSubsystem.h" />

A locator system that maintains a map that organizes `UObject` into predefined categories ([ENDynamicRef](dynamic-ref.md)), named buckets (`FName`), or `FGameplayTag` keys. Tag-keyed entries are stored in the same `FName`-bucket map under the tag's `TagName`, so every tag accessor is effectively a thin convenience wrapper over its `*ByName` equivalent.

## Getting Actors

Accessing the referenced `AActor`s can be done with minimal overhead.

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/jc3vnwmq/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '400px' }}></iframe>

:::note

In the above blueprint example, the [UNDynamicRefComponent](dynamic-ref-component.md) would need to have its `Lifecycle` set to `InitializeComponent` in order to ensure it is registered prior to a hypothetical `BeginPlay()` event.

:::  
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Getting Actors"
TArray<AActor*> ReferencedActors = UNDynamicRefSubsystem::Get(GetWorld())->GetActors(ENDynamicRef::NDR_Item_L);
for (AActor* Actor : ReferencedActors)
{
  // Do something with Actor
}
```    
  </TabItem>
</Tabs>

## UFunctions

:::tip

The [UNDynamicRefComponent](dynamic-ref-component.md) automatically manages the registration lifecycle.

:::


### Adding References

#### Add Object

```cpp
/**
  * Add a reference by ENDynamicRef to a specified UObject.
  * @remark Be careful with the manual add method. If you add it, you must remove it!
  * @param DynamicRef The desired ENDynamicRef to add to.
  * @param InObject The UObject to be referenced by the provided ENDynamicRef.
  */
void AddObject(ENDynamicRef DynamicRef, UObject* InObject);
```

#### Add Object (By Name)

```cpp
/**
  * Add a reference by FName to a specified UObject.
  * @remark Be careful with the manual add method. If you add it, you must remove it!
  * @param Name The desired FName to add to.
  * @param InObject The UObject to be referenced by the FName.
  */
void AddObjectByName(FName Name, UObject* InObject);
```

#### Add Objects

```cpp
/**
  * Add a reference by ENDynamicRef to a TArray of UObjects.
  * @remark Be careful with the manual add method. If you add it, you must remove it!
  * @param DynamicRef The desired ENDynamicRef to add to.
  * @param InObjects The TArray of UObjects to be referenced by the provided ENDynamicRef.
  */
void AddObjects(ENDynamicRef DynamicRef, TArray<UObject*> InObjects);
```

#### Add Objects (By Name)

```cpp
/**
  * Add a reference by FName to a TArray of UObjects.
  * @remark Be careful with the manual add method. If you add it, you must remove it!
  * @param Name The desired FName to add to.
  * @param InObjects The TArray of UObjects to be referenced by the FName.
  */	
void AddObjectsByName(FName Name, TArray<UObject*> InObjects);
```  

### Removing References

#### Remove Object	

```cpp
/**
  * Remove a reference by ENDynamicRef to a specified UObject.
  * @param DynamicRef The desired ENDynamicRef to remove from.
  * @param InObject The UObject to be having its reference removed by the provided ENDynamicRef.
  */
void RemoveObject(ENDynamicRef DynamicRef, UObject* InObject);
```  
	
#### Remove Object	(By Name)

```cpp
/**
  * Remove a reference by FName to a specified UObject.
  * @remark Be careful with the manual remove method, it should be used for things that you have manually added.
  * @param Name The desired FName to remove from.
  * @param InObject The UObject to be having its reference removed by the FName.
  */
void RemoveObjectByName(FName Name, UObject* InObject);
```  

#### Remove Objects

```cpp
/**
  * Remove a reference by ENDynamicRef to a TArray of UObjects.
  * @param DynamicRef The desired ENDynamicRef to remove from.
  * @param InObjects The TArray of UObjects to be having their references removed by the provided ENDynamicRef.
  */
void RemoveObjects(ENDynamicRef DynamicRef, TArray<UObject*> InObjects);
```  

#### Remove Objects	(By Name)

```cpp
/**
  * Remove a reference by FName to a TArray of UObjects.
  * @remark Be careful with the manual remove method, it should be used for things that you have manually added.
  * @param Name The desired FName to remove from.
  * @param InObjects The TArray of UObjects to be having their references removed by the FName.	 
  */
void RemoveObjectsByName(FName Name, TArray<UObject*> InObjects);
```  

### Accessing References

#### Get Actors

```cpp
/**
  * Gets an array of AActor dynamically associated with the provided ENDynamicRef.
  * @note This method will only return AActor objects, filtering out any non-AActor UObject.
  * @param DynamicRef The desired ENDynamicRef to access.
  * @return An array of UObject. 
  */
TArray<AActor*> GetActors(const ENDynamicRef DynamicRef);
```  
	
#### Get Actors (By Name)

```cpp
/**
  * Gets an array of AActor dynamically associated with the provided FName.
  * @note This method will only return AActor objects, filtering out any non-AActor UObject.
  * @param Name The desired FName to access.
  * @return An array of UObject. 
  */
TArray<AActor*> GetActorsByName(FName Name);
```  

#### Get Objects

```cpp
/**
  * Gets an array of UObject dynamically associated with the provided ENDynamicRef.
  * @param DynamicRef The desired ENDynamicRef to access.
  * @return An array of UObject. 
  */
TArray<UObject*> GetObjects(const ENDynamicRef DynamicRef);
```

#### Get Objects (By Name)

```cpp
/**
  * Gets an array of UObject dynamically associated with the provided FName.
  * @param Name The desired FName to access.
  * @return An array of UObject. 
  */
TArray<UObject*> GetObjectsByName(FName Name);
```  

#### Get First Actor

```cpp
/**
  * Retrieves the first/oldest AActor associated with a specified ENDynamicRef.
  * @param DynamicRef The ENDynamicRef collection to iterate.
  * @return A pointer to the first AActor found for the specified ENDynamicRef, or nullptr if no actors are found.
  */
AActor* GetFirstActor(const ENDynamicRef DynamicRef);
```  

#### Get First Actor (By Name)

```cpp	
/**
  * Retrieves the first/oldest AActor associated with a specified FName.
  * @param Name The FName collection to iterate.
  * @return A pointer to the first AActor found for the specified ENDynamicRef, or nullptr if no actors are found.
  */
AActor* GetFirstActorByName(FName Name);
```  

#### Get First Object

```cpp
/**
	* Gets the first/oldest UObject associated with the provided ENDynamicRef.
	* @param DynamicRef The desired ENDynamicRef collection to access.
	* @return The first UObject in the collection. 
	*/
UObject* GetFirstObject(const ENDynamicRef DynamicRef);
```  

#### Get First Object (By Name)

```cpp	
/**
  * Gets the first/oldest UObject associated with the provided FName.
  * @param Name The desired FName to access.
  * @return The first UObject in the collection. 
  */
UObject* GetFirstObjectByName(FName Name);
```  
	
#### Get Last Actor

```cpp	
/**
  * Retrieves the last/newest AActor associated with a specified ENDynamicRef.
  * @param DynamicRef The ENDynamicRef collection to iterate.
  * @return A pointer to the first AActor found for the specified ENDynamicRef, or nullptr if no actors are found.
  */
AActor* GetLastActor(const ENDynamicRef DynamicRef);
```  

#### Get Last Actor (By Name)

```cpp		
/**
  * Retrieves the last/newest AActor associated with a specified FName.
  * @param Name The FName collection to iterate.
  * @return A pointer to the first AActor found for the specified ENDynamicRef, or nullptr if no actors are found.
  */
AActor* GetLastActorByName(FName Name);
```

#### Get Last Object

```cpp	
/**
  * Gets the last/newest UObject associated with the provided ENDynamicRef.
  * @param DynamicRef The desired ENDynamicRef collection to access.
  * @return The last UObject in the collection. 
  */
UObject* GetLastObject(const ENDynamicRef DynamicRef);
```

#### Get Last Object (By Name)

```cpp			
/**
	* Gets the last/newest UObject associated with the provided FName.
	* @param Name The desired FName type to access.
	* @return The last UObject in the collection. 
	*/
UObject* GetLastObjectByName(FName Name);
```

### Tag References<VersionBadge version="0.3.0" branch="main" type="header" />

`FGameplayTag` accessors operate on the same named map as the `*ByName` calls — the tag's `TagName` is the key. There are no tag-specific `Add*` / `Remove*` calls: register a tag via the [UNDynamicRefComponent](dynamic-ref-component.md)'s `TagReferences` (or by calling the matching `*ByName` overload with `Tag.GetTagName()`). Tags that fail `IsValid()` are treated as a no-op and return empty/null.

#### Get Actors (By Tag)

```cpp
/**
  * Gets an array of AActor dynamically associated with the provided FGameplayTag.
  * @note This method will only return AActor objects, filtering out any non-AActor UObject.
  * @param Tag The desired FGameplayTag to access.
  * @return An array of AActor.
  */
TArray<AActor*> GetActorsByTag(FGameplayTag Tag);
```

#### Get Objects (By Tag)

```cpp
/**
  * Gets an array of UObject dynamically associated with the provided FGameplayTag.
  * @param Tag The desired FGameplayTag to access.
  * @return An array of UObject.
  */
TArray<UObject*> GetObjectsByTag(FGameplayTag Tag);
```

#### Get First Actor (By Tag)

```cpp
/**
  * Retrieves the first/oldest AActor associated with a specified FGameplayTag.
  * @param Tag The FGameplayTag collection to iterate.
  * @return A pointer to the first AActor found for the specified FGameplayTag, or nullptr if no actors are found.
  */
AActor* GetFirstActorByTag(FGameplayTag Tag);
```

#### Get First Object (By Tag)

```cpp
/**
  * Gets the first/oldest UObject associated with the provided FGameplayTag.
  * @param Tag The desired FGameplayTag to access.
  * @return The first UObject in the collection.
  */
UObject* GetFirstObjectByTag(FGameplayTag Tag);
```

#### Get Last Actor (By Tag)

```cpp
/**
  * Retrieves the last/newest AActor associated with a specified FGameplayTag.
  * @param Tag The FGameplayTag collection to iterate.
  * @return A pointer to the last AActor found for the specified FGameplayTag, or nullptr if no actors are found.
  */
AActor* GetLastActorByTag(FGameplayTag Tag);
```

#### Get Last Object (By Tag)

```cpp
/**
  * Gets the last/newest UObject associated with the provided FGameplayTag.
  * @param Tag The desired FGameplayTag to access.
  * @return The last UObject in the collection.
  */
UObject* GetLastObjectByTag(FGameplayTag Tag);
```

### Tag Containers<VersionBadge version="0.3.0" branch="main" type="header" />

Set-style accessors that operate on an `FGameplayTagContainer`. `*ByAnyTags` returns the union of every supplied tag's bucket (deduplicated); `*ByAllTags` returns the intersection (a `UObject` must appear under every requested tag). Invalid tags in the container are skipped for the *Any* variants; for the *All* variants, an invalid or absent tag short-circuits the result to empty.

#### Get Objects (By Any Tags)

```cpp
/**
  * Gets the union of UObjects registered under any of the supplied FGameplayTags. Results are deduplicated.
  * @param Tags The FGameplayTagContainer whose tags' buckets should be unioned.
  * @return An array of UObject. Empty if no provided tag has a registered bucket.
  */
TArray<UObject*> GetObjectsByAnyTags(const FGameplayTagContainer& Tags);
```

#### Get Actors (By Any Tags)

```cpp
/**
  * Gets the union of AActors registered under any of the supplied FGameplayTags.
  * Results are deduplicated and non-AActor UObjects are filtered out.
  * @param Tags The FGameplayTagContainer whose tags' buckets should be unioned.
  * @return An array of AActor.
  */
TArray<AActor*> GetActorsByAnyTags(const FGameplayTagContainer& Tags);
```

#### Get Count (By Any Tags)

```cpp
/**
  * @param Tags The FGameplayTagContainer whose tags' buckets should be unioned.
  * @return The number of unique UObjects registered under any of the supplied tags.
  */
int32 GetCountByAnyTags(const FGameplayTagContainer& Tags);
```

#### Get Objects (By All Tags)

```cpp
/**
  * Gets the intersection of UObjects registered under every supplied FGameplayTag.
  * A UObject must appear under every requested tag to be returned.
  * @param Tags The FGameplayTagContainer whose tags' buckets should be intersected.
  * @return An array of UObject. Empty if any provided tag has no registered bucket.
  */
TArray<UObject*> GetObjectsByAllTags(const FGameplayTagContainer& Tags);
```

#### Get Actors (By All Tags)

```cpp
/**
  * Gets the intersection of AActors registered under every supplied FGameplayTag.
  * Non-AActor UObjects are filtered out.
  * @param Tags The FGameplayTagContainer whose tags' buckets should be intersected.
  * @return An array of AActor.
  */
TArray<AActor*> GetActorsByAllTags(const FGameplayTagContainer& Tags);
```

#### Get Count (By All Tags)

```cpp
/**
  * @param Tags The FGameplayTagContainer whose tags' buckets should be intersected.
  * @return The number of UObjects registered under every supplied tag.
  */
int32 GetCountByAllTags(const FGameplayTagContainer& Tags);
```

### Utilities

#### Get Count

```cpp
/**
  * Retrieves the count of UObjects associated with a specified ENDynamicRef collection.
  * @param DynamicRef The desired ENDynamicRef collection.
  * @return The number of UObjects associated with the specified ENDynamicRef collection.
  */
int32 GetCount(const ENDynamicRef DynamicRef);
```

#### Get Count (By Name)

```cpp
/**
  * Retrieves the count of UObjects associated with a specified FName collection.
  * @param Name The desired FName collection.
  * @return The number of UObjects associated with the specified FName collection.
  */
int32 GetCountByName(FName Name);
```

#### Get Count (By Tag)<VersionBadge version="0.3.0" branch="main" type="header" />

```cpp
/**
  * Retrieves the count of UObjects associated with a specified FGameplayTag collection.
  * @param Tag The desired FGameplayTag collection.
  * @return The number of UObjects associated with the specified FGameplayTag collection.
  */
int32 GetCountByTag(FGameplayTag Tag);
```

#### Get Dynamic Refs

```cpp
/** @return All ENDynamicRef slots that currently have at least one registered object. */
TArray<ENDynamicRef> GetDynamicRefs() const;
```

Returns only the populated slots, which is useful for tooling — for example, the [Developer Overlay](../developer-overlay.md) iterates this list to render one row per active slot.

#### Get Names

```cpp
/** @return All FName buckets that currently have at least one registered object. */
TArray<FName> GetNames() const;
```

Same shape as `GetDynamicRefs`, but for the free-form `FName` buckets backed by the named-collection map.

#### Get Tags<VersionBadge version="0.3.0" branch="main" type="header" />

```cpp
/**
  * @return All FGameplayTags whose corresponding FName bucket currently has at least one registered object.
  * @remark Bucket FNames that do not resolve to a known FGameplayTag (e.g. raw names added via the FName API) are skipped.
  */
TArray<FGameplayTag> GetTags() const;
```

`GetTags` is a filtered view of `GetNames` — only buckets whose key resolves to a registered `FGameplayTag` via `UGameplayTagsManager::RequestGameplayTag` are returned. Raw `FName` buckets that were never registered as tags are intentionally omitted.

## Native-Only Fast Paths

Two families of native-only accessors skip the safety checks performed by their Blueprint-exposed counterparts. They exist for tight inner loops where the caller has already guaranteed the slot/bucket exists and is non-empty.

### Unchecked First/Last

| Method | Equivalent To |
| :-- | :-- |
| `GetFirstObjectUnsafe(ENDynamicRef)` | `GetFirstObject` without nullptr/empty checks. |
| `GetFirstObjectByNameUnsafe(FName)` | `GetFirstObjectByName` without nullptr/empty checks. |
| `GetFirstObjectByTagUnsafe(FGameplayTag)` <VersionBadge version="0.3.0" branch="main" type="header" /> | `GetFirstObjectByTag` without validity/empty checks. |
| `GetLastObjectUnsafe(ENDynamicRef)` | `GetLastObject` without nullptr/empty checks. |
| `GetLastObjectByNameUnsafe(FName)` | `GetLastObjectByName` without nullptr/empty checks. |
| `GetLastObjectByTagUnsafe(FGameplayTag)` <VersionBadge version="0.3.0" branch="main" type="header" /> | `GetLastObjectByTag` without validity/empty checks. |

:::warning

The `*Unsafe` variants will dereference into an empty array if you call them on a slot/bucket with no registered objects — only use them from native code paths that already gated the lookup with `GetCount` or by subscribing to the registration delegates below.

:::

### Collection References

Return a `const FNDynamicRefCollection&` directly, avoiding the per-call `TArray` copy that `GetObjects*` performs. Prefer these when you only need to read the backing storage.

| Method | Returns |
| :-- | :-- |
| `GetObjectCollectionRefUnsafe(ENDynamicRef)` | The collection for the slot. No bounds check on `DynamicRef`. |
| `GetObjectCollectionByNameRefUnsafe(FName)` | The collection for the bucket. `FindChecked` — asserts if `Name` is not present. |
| `GetObjectCollectionByTagRefUnsafe(FGameplayTag)` <VersionBadge version="0.3.0" branch="main" type="header" /> | The collection for the tag's `TagName` bucket. `FindChecked` — asserts if the tag is not present. |

:::warning

The returned reference is only valid until the next mutation of the underlying map. Any `Add*` / `Remove*` call may rehash the named map or reallocate the slot's backing array and invalidate the reference. Do not cache it across frames, and do not access it from multiple threads.

:::

## Delegates

The subsystem fires four native multicast delegates that broadcast every registration change. The shipped [Developer Overlay](../developer-overlay.md) listens on all four to keep its UI in sync without polling — mirror that pattern when you build custom diagnostic UIs.

| Delegate | Signature | Fires When |
| :-- | :-- | :-- |
| `OnAdded` | `(ENDynamicRef, UObject*)` | An object is registered under a slot. |
| `OnRemoved` | `(ENDynamicRef, UObject*)` | An object is unregistered from a slot. |
| `OnAddedByName` | `(FName, UObject*)` | An object is registered under a named bucket. |
| `OnRemovedByName` | `(FName, UObject*)` | An object is unregistered from a named bucket. |

The delegates are native (not `BlueprintAssignable`) — bind from C++ via `OnAdded.AddUObject(...)` and remove with `RemoveAll(this)` in your teardown path.

`OnRemoved` / `OnRemovedByName` only fire when the call actually removes something — attempting to remove a `UObject` that was never registered to a slot/bucket is now a silent no-op rather than a spurious broadcast.