---
sidebar_class_name: type ue-actor-component
description: A component that builds a network-synchronized UTextRenderComponent between clients.
tags: [0.1.0, 0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Text Render Component

<TypeDetails icon="ue-actor-component" base="UTextRenderComponent" type="UNTextRenderComponent" typeExtra="" headerFile="NexusUI/Public/SceneComponents/NTextRenderComponent.h" />

A component that builds a network-synchronized `UTextRenderComponent` between clients.

![Text Render Component](text-render-component.webp)

:::info[Module Migration]

`UNTextRenderComponent` was previously shipped in the standalone `NexusMultiplayer` module and now lives in `NexusUI`. Existing Blueprint references continue to resolve via a `ClassRedirect` in `DefaultEngine.ini` — no action is required when upgrading.

The previous `Server_*` setter variants were removed in `0.3.0`; call the [`SetFrom*`](#set-from-name) setters directly — they handle the authority check and replication internally.

:::

## UFunctions

### Set From Name

Sets the text of the `NTextRenderComponent` from a `FName`, ensuring it is only done with **authority**, and then replicated.

```cpp
/**
  * Set the value of the text component from an FName.
  * @param NewValue The desired text value.
  */	
void SetFromName(const FName& NewValue);
```

### Set From String

Sets the text of the `NTextRenderComponent` from a `FString`, ensuring it is only done with **authority**, and then replicated.

```cpp
/**
  * Set the value of the text component from an FString.
  * @param NewValue The desired text value.
  */		
void SetFromString(const FString& NewValue);
```

### Set From Text

Sets the text of the `NTextRenderComponent` from a `FText`, ensuring it is only done with **authority**, and then replicated.

```cpp
/**
  * Set the value of the text component from an FText.
  * @param NewValue The desired text value.
  */	
void SetFromText(const FText& NewValue);
```

## Replication

The component holds a single replicated `FString CachedValue` field that is the source of truth across the wire. The three setters above all funnel into `CachedValue` on the server; clients receive the change via the `OnRep_TextValue` callback, which applies the new text to the underlying `UTextRenderComponent` and broadcasts `OnTextChanged`.

## Delegates

### On Text Changed

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTextChanged, FString, NewText);

UPROPERTY(BlueprintAssignable)
FOnTextChanged OnTextChanged;
```

A `BlueprintAssignable` multicast delegate that fires whenever the text changes — both on the server (immediately when one of the `SetFrom*` setters is called) and on every client (when `OnRep_TextValue` runs). The payload is the new `FString` value. Bind from Blueprint to react to text changes without having to poll the underlying component each frame.
