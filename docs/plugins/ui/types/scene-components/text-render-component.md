---
sidebar_class_name: type ue-actor-component
description: A component that builds a network-synchronized UTextRenderComponent between clients.
tags: [0.1.0, 0.3.0, 0.3.2]
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

Sets the text of the `NTextRenderComponent` from an `FName`, ensuring it is only done with **authority**, and then replicated.

```cpp
/**
  * Set the value of the text component from an FName.
  * @param NewValue The desired text value.
  */	
void SetFromName(const FName& NewValue);
```

### Set From String

Sets the text of the `NTextRenderComponent` from an `FString`, ensuring it is only done with **authority**, and then replicated.

```cpp
/**
  * Set the value of the text component from an FString.
  * @param NewValue The desired text value.
  */		
void SetFromString(const FString& NewValue);
```

### Set From Text

Sets the text of the `NTextRenderComponent` from an `FText`, ensuring it is only done with **authority**, and then replicated.

```cpp
/**
  * Set the value of the text component from an FText.
  * @param NewValue The desired text value.
  */	
void SetFromText(const FText& NewValue);
```

## Replication

The component holds a single replicated `FString CachedValue` field that is the source of truth across the wire. The three setters above all funnel into `CachedValue` on the server; clients receive the change via the `OnRep_TextValue` callback, which applies the new text to the underlying `UTextRenderComponent` and broadcasts `OnTextChanged`.

Because replicated text only propagates when the **owning actor itself replicates**, `BeginPlay` verifies that the owner has replication enabled. If it does not, the component logs an error and the text will not propagate — it no longer silently turns on replication for the owner on your behalf (changed in `0.3.2`). Enable replication on the owning actor, or, for actors that are intentionally non-replicated, disable the check via the `Should Check Replication` property below.

| Property | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `bShouldCheckReplication` | `bool` | When `true`, `BeginPlay` verifies the owning actor is replicated and logs an error if it is not. Disable to silence the check on owners that are intentionally non-replicated. | `true` |

## Delegates

### On Text Changed

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTextChanged, FString, NewText);

UPROPERTY(BlueprintAssignable)
FOnTextChanged OnTextChanged;
```

A `BlueprintAssignable` multicast delegate that fires whenever the text changes — both on the server (immediately when one of the `SetFrom*` setters is called) and on every client (when `OnRep_TextValue` runs). The payload is the new `FString` value. Bind from Blueprint to react to text changes without having to poll the underlying component each frame.
