---
sidebar_position: 3
sidebar_label: DynamicRef Subsystem
sidebar_class_name: type ue-world-subsystem
description: A locator system that maintains a map that organizes actors into predefined categories.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Actor Pool Subsystem

<TypeDetails icon="ue-world-subsystem" base="UTickableWorldSubsystem" type="UNDynamicRefSubsystem" typeExtra="" headerFile="NexusDynamicRefs/Public/NDynamicRefSubsystem.h" />

A locator system that maintains a map that organizes UObject into predefined categories [ENDynamicRef](dynamic-ref.md) or named buckets (FName).

## Getting Actors Example

Accessing the referenced `AActor`s can be done with minimal overhead.

<Tabs>
  <TabItem value="blueprint" label="Blueprint" default attributes={{className: 'tab-blueprint' }}>
    <iframe src="https://blueprintue.com/render/jc3vnwmq/" allowfullscreen="yes" scrolling="no" class="blueprintue" style={{ height : '400px' }}></iframe>

:::note

In the above blueprint example, the [UNDynamicRefComponnet](dynamic-ref-component.md) would need to have its `Link Phase` set to `ACLS_InitializeComponent` in order to ensure it is registered prior to a hypothetical `BeginPlay()` event.

:::  
  </TabItem>
  <TabItem value="native" label="C++" attributes={{className: 'tab-native' }}>
```cpp title="Getting Actors"
for (TArray<AActor*>& ReferencedActors = UNDynamicRefubsystem::Get(GetWorld())->GetActors(ENDynamicRef::NDR_Item_L);
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
  * Add a reference by ENDynamicRef to a specified AActor.
  * @remark Be careful with the manual add method. If you add it, you must remove it!
  * @param InType The desired dynamic reference type to add too.
  * @param InActor The AActor to be referenced by the InType.
  */
void AddReference(ENDynamicRef InType, AActor* InActor);
```

:::tip

The [UNDynamicRefComponent](dynamic-ref-component.md) automatically manages the registration lifecycle.

:::

### Add Object

```cpp
/**
  * Add a reference by ENDynamicRef to a specified UObject.
  * @remark Be careful with the manual add method. If you add it, you must remove it!
  * @param DynamicRef The desired ENDynamicRef to add too.
  * @param InObject The UObject to be referenced by the provided ENDynamicRef.
  */
void AddObject(ENDynamicRef DynamicRef, UObject* InObject);
```

### Add Object (By Name)

```cpp
/**
  * Add a reference by FName to a specified UObject.
  * @remark Be careful with the manual add method. If you add it, you must remove it!
  * @param Name The desired FName to add too.
  * @param InObject The UObject to be referenced by the FName.
  */
void AddObjectByName(FName Name, UObject* InObject);
```

### Remove Object	

```cpp
/**
  * Remove a reference by ENDynamicRef to a specified UObject.
  * @param DynamicRef The desired ENDynamicRef to remove from.
  * @param InObject The UObject to be having its reference removed by the provided ENDynamicRef.
  */
void RemoveObject(ENDynamicRef DynamicRef, UObject* InObject);
```  
	
### Remove Object	(By Name)

```cpp
/**
  * Remove a reference by FName to a specified UObject.
  * @remark Be careful with the manual remove method, it should be used for things that you have manually added.
  * @param Name The desired FName to remove from.
  * @param InObject The UObject to be having its reference removed by the FName.
  */
void RemoveObjectByName(FName Name, UObject* InObject);
```  
	
### Get Actors

```cpp
/**
  * Gets an array of AActor dynamically associated with the provided ENDynamicRef.
  * @note This method will only return AActor objects, filtering out any non-AActor UObject.
  * @param DynamicRef The desired ENDynamicRef to access.
  * @return An array of UObject. 
  */
TArray<AActor*> GetActors(const ENDynamicRef DynamicRef);
```  
	
### Get Actors (By Name)

```cpp
/**
  * Gets an array of AActor dynamically associated with the provided FName.
  * @note This method will only return AActor objects, filtering out any non-AActor UObject.
  * @param Name The desired FName to access.
  * @return An array of UObject. 
  */
TArray<AActor*> GetActorsByName(FName Name);
```  

### Get Count

```cpp
/**
  * Retrieves the count of UObjects associated with a specified ENDynamicRef collection.
  * @param DynamicRef The desired ENDynamicRef collection.
  * @return The number of UObjects associated with the specified ENDynamicRef collection.
  */
int32 GetCount(const ENDynamicRef DynamicRef);
```  
### Get Count (By Name)

```cpp
/**
  * Retrieves the count of UObjects associated with a specified FName collection.
  * @param Name The desired FName collection.
  * @return The number of UObjects associated with the specified FName collection.
  */
int32 GetCountByName(FName Name);
```

### Get Objects

```cpp
/**
  * Gets an array of UObject dynamically associated with the provided ENDynamicRef.
  * @param DynamicRef The desired ENDynamicRef to access.
  * @return An array of UObject. 
  */
TArray<UObject*> GetObjects(const ENDynamicRef DynamicRef);
```

### Get Objects (By Name)

```cpp
/**
  * Gets an array of UObject dynamically associated with the provided FName.
  * @param Name The desired FName to access.
  * @return An array of UObject. 
  */
TArray<UObject*> GetObjectsByName(FName Name);
```  

### Get First Actor

```cpp
/**
  * Retrieves the first/oldest AActor associated with a specified ENDynamicRef.
  * @param DynamicRef The ENDynamicRef collection to iterate.
  * @return A pointer to the first AActor found for the specified ENDynamicRef, or nullptr if no actors are found.
  */
AActor* GetFirstActor(const ENDynamicRef DynamicRef);
```  

### Get First Actor (By Name)

```cpp	
/**
  * Retrieves the first/oldest AActor associated with a specified FName.
  * @param Name The FName collection to iterate.
  * @return A pointer to the first AActor found for the specified ENDynamicRef, or nullptr if no actors are found.
  */
AActor* GetFirstActorByName(FName Name);
```  

### Get First Object

```cpp
/**
	* Gets the first/oldest UObject associated with the provided ENDynamicRef.
	* @param DynamicRef The desired ENDynamicRef collection to access.
	* @return The first UObject in the collection. 
	*/
UObject* GetFirstObject(const ENDynamicRef DynamicRef);
```  

### Get First Object (By Name)

```cpp	
/**
  * Gets the first/oldest UObject associated with the provided FName.
  * @param Name The desired FName to access.
  * @return The first UObject in the collection. 
  */
UObject* GetFirstObjectByName(FName Name);
```  
	
### Get Last Actor

```cpp	
/**
  * Retrieves the last/newest AActor associated with a specified ENDynamicRef.
  * @param DynamicRef The ENDynamicRef collection to iterate.
  * @return A pointer to the first AActor found for the specified ENDynamicRef, or nullptr if no actors are found.
  */
AActor* GetLastActor(const ENDynamicRef DynamicRef);
```  

### Get Last Actor (By Name)

```cpp		
/**
  * Retrieves the last/newest AActor associated with a specified FName.
  * @param Name The FName collection to iterate.
  * @return A pointer to the first AActor found for the specified ENDynamicRef, or nullptr if no actors are found.
  */
AActor* GetLastActorByName(FName Name);
```

### Get Last Object

```cpp	
/**
  * Gets the last/newest UObject associated with the provided ENDynamicRef.
  * @param DynamicRef The desired ENDynamicRef collection to access.
  * @return The last UObject in the collection. 
  */
UObject* GetLastObject(const ENDynamicRef DynamicRef);
```

### Get Last Object (By Name)

```cpp			
/**
	* Gets the last/newest UObject associated with the provided FName.
	* @param Name The desired FName type to access.
	* @return The last UObject in the collection. 
	*/
UObject* GetLastObjectByName(FName Name);
```