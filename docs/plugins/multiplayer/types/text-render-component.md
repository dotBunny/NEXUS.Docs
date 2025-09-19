---
sidebar_position: 3
sidebar_label: Text Render Component
sidebar_class_name: type ue-actor-component
description: A component that builds a network-synchronized UTextRenderComponent between clients.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Text Render Component

<TypeDetails icon="ue-actor-component" base="UTextRenderComponent" type="UNTextRenderComponent" typeExtra="" headerFile="NexusMultiplayer/Public/UTextRenderComponent.h" />

A component that builds a network-synchronized `UTextRenderComponent` between clients.

![Text Render Component](text-render-component.webp)

## UFunctions

### Set From Name

Sets the text of the `NTextRenderComponent` from a `FName`, with `Server_SetFromName` allowing clients to change the text as well so long as `bAllowRPC` is `true`.

```cpp
/**
  * Set the value of the text component from an FName.
  * @param NewValue The desired text value.
  */	
void SetFromName(const FName& NewValue);

/**
  * Set the value of the text component from an FName via RPC.
  * @remark Client setter requires bAllowRPC to be true.
  * @param NewValue The desired text value.
  */
void Server_SetFromName(const FName& NewValue);
```

### Set From String

Sets the text of the `NTextRenderComponent` from a `FString`, with `Server_SetFromString` allowing clients to change the text as well so long as `bAllowRPC` is `true`.

```cpp
/**
  * Set the value of the text component from an FString.
  * @param NewValue The desired text value.
  */		
void SetFromString(const FString& NewValue);

/**
  * Set the value of the text component from an FString via RPC.
  * @remark Client setter requires bAllowRPC to be true.
  * @param NewValue The desired text value.
  */
void Server_SetFromString(const FString& NewValue);
```

### Set From Text

Sets the text of the `NTextRenderComponent` from a `FText`, with `Server_SetFromText` allowing clients to change the text as well so long as `bAllowRPC` is `true`.

```cpp
/**
  * Set the value of the text component from an FText.
  * @param NewValue The desired text value.
  */	
void SetFromText(const FText& NewValue);

/**
  * Set the value of the text component from an FText via RPC.
  * @remark Client setter requires bAllowRPC to be true.
  * @param NewValue The desired text value.
  */	
void Server_SetFromText(const FText& NewValue);
```

## Component Settings

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Allow RPC | `bool` | Allow client calls to `Server_` function variants to set the content of the text renderer. | `false` |