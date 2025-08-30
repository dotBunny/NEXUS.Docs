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

## Functions

### SetFromName

Sets the text of the `NTextRenderComponent` from a `FName`, with `Server_SetFromName` allowing clients to change the text as well so long as `bAllowRPC` is `true`.

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Set From Name", Category = "NEXUS|Multiplayer")
void SetFromName(const FName& NewValue);

UFUNCTION(Server, Reliable, BlueprintCallable, DisplayName="Set From Name (Server)", Category = "NEXUS|Multiplayer")
void Server_SetFromName(const FName& NewValue);
```

### SetFromString

Sets the text of the `NTextRenderComponent` from a `FString`, with `Server_SetFromString` allowing clients to change the text as well so long as `bAllowRPC` is `true`.

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Set From String", Category = "NEXUS|Multiplayer")
void SetFromString(const FString& NewValue);

UFUNCTION(Server, Reliable, BlueprintCallable, DisplayName="Set From String (Server)", Category = "NEXUS|Multiplayer")
void Server_SetFromString(const FString& NewValue);
```

### SetFromText

Sets the text of the `NTextRenderComponent` from a `FText`, with `Server_SetFromText` allowing clients to change the text as well so long as `bAllowRPC` is `true`.

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Set From Text",  Category = "NEXUS|Multiplayer")
void SetFromText(const FText& NewValue);

UFUNCTION(Server, Reliable, BlueprintCallable, DisplayName="Set From Text (Server)", Category = "NEXUS|Multiplayer")
void Server_SetFromText(const FText& NewValue);
```

## Component Settings

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| Allow RPC | `bool` | Allow client calls to `Server_` function variants to set the content of the text renderer. | `false` |