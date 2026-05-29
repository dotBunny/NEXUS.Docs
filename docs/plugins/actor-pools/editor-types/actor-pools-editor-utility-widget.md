---
sidebar_class_name: type ue-widget
description: Editor utility widget that hosts the Actor Pools developer overlay and exposes editor-only actions like creating new pool-set assets.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pools Editor Utility Widget

<TypeDetails icon="ue-widget" base="UNEditorUtilityWidget" type="UNActorPoolsEditorUtilityWidget" typeExtra="" headerFile="NexusActorPoolsEditor/Public/NActorPoolsEditorUtilityWidget.h" />

A [UNEditorUtilityWidget](../../ui/editor-types/editor-utility-widget.md) subclass that hosts the [Actor Pools Developer Overlay](../developer-overlay.md) in a dockable editor tab, plus a single button that creates a new [UNActorPoolSet](../types/actor-pool-set.md) asset in the current Content Browser path.

## Bound Widgets

| Name | Type | Description |
| :-- | :-- | :-- |
| `Overlay` | `UNActorPoolsDeveloperOverlay*` | The live developer-overlay widget displaying pool state. |
| `CreateAPSButton` | `UButton*` | "Create Actor Pool Set" button bound to `OnCreateActorPoolSet`. |

## Methods

### Native Construct

```cpp
virtual void NativeConstruct() override;
```

Binds the `CreateAPSButton` click delegate to `OnCreateActorPoolSet` so the button creates a new pool-set asset when pressed.

### On Create Actor Pool Set

```cpp
/** Button handler that creates a new UNActorPoolSet asset in the current content browser path. */
UFUNCTION()
void OnCreateActorPoolSet();
```

Invoked when the user clicks `CreateAPSButton` — drops a new `UNActorPoolSet` into whatever folder the Content Browser is currently pointed at.

## See Also

- [Actor Pools Developer Overlay](../developer-overlay.md) — the overlay this widget hosts.
- [UNActorPoolSetFactory](actor-pool-set-factory.md) — the factory invoked when the button creates an asset.
