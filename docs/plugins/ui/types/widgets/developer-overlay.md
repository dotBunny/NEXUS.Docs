---
sidebar_position: 7
sidebar_label: Developer Overlay
sidebar_class_name: type ue-widget
description: Abstract base widget for NEXUS developer/diagnostic overlays; provides a banner row and a container box for subclasses to populate.
tags: [0.2.7]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Developer Overlay

<TypeDetails icon="ue-widget" base="UCommonUserWidget" type="UNDeveloperOverlay" typeExtra="" headerFile="NexusUI/Public/Widgets/NDeveloperOverlay.h" />

The `Abstract`, `Blueprintable` base widget that every per-plugin developer overlay subclasses. It supplies a banner row (a `UCommonBorder` and `UCommonTextBlock` pair) plus a `ContainerBox` `UVerticalBox` that subclasses fill with diagnostic rows. The `bIsEditorUtilityWidget` flag toggles editor-only behavior when the overlay is hosted inside a [UNEditorUtilityWidget](../../editor-types/editor-utility-widget.md).

This is the type each plugin's `UN<Plugin>DeveloperOverlay` derives from — for example, [`UNActorPoolsDeveloperOverlay`](/docs/plugins/actor-pools/developer-overlay.md), [`UNDynamicRefsDeveloperOverlay`](/docs/plugins/dynamic-references/developer-overlay.md), and [`UNGuardianDeveloperOverlay`](/docs/plugins/guardian/developer-overlay.md). Build your own diagnostic surface by subclassing this widget and adding rows to `ContainerBox`.

## Bound Widgets

Subclasses must provide widgets bound to these names — the `meta=(BindWidget)` markup makes them required, and Unreal will fail compilation if a subclass omits them.

| Widget | Type | Role |
| :-- | :-- | :-- |
| `ContainerBanner` | `UCommonBorder` | Background brush for the banner row; recolored by `ShowContainerBanner`. |
| `ContainerBannerMessage` | `UCommonTextBlock` | Message text rendered inside the banner row. |
| `ContainerBox` | `UVerticalBox` | Slot subclasses populate with their diagnostic rows. |

## API

### Show Container Banner

```cpp
/**
 * Display the banner row with Text and the supplied foreground/background color pair.
 * @param Text         Message to render in the banner.
 * @param MessageColor Foreground (text) color drawn from the palette.
 * @param BannerColor  Background color drawn from the palette.
 */
UFUNCTION(BlueprintCallable)
void ShowContainerBanner(const FText& Text = FText::GetEmpty(),
    ENColor MessageColor = ENColor::NC_White,
    ENColor BannerColor = ENColor::NC_NexusDarkBlue) const;
```

### Hide Container Banner

```cpp
/** Collapse the banner row. */
UFUNCTION(BlueprintCallable)
void HideContainerBanner() const;
```

## Editor Utility Widget Mode

```cpp
/** When true the overlay is hosted inside an EUW and should avoid runtime-only assumptions. */
UPROPERTY(EditDefaultsOnly)
bool bIsEditorUtilityWidget;
```

Set this to `true` on the Class Defaults of a Blueprint subclass intended to live inside a [UNEditorUtilityWidget](../../editor-types/editor-utility-widget.md). Subclasses inspect the flag to gate behavior that only makes sense at runtime — for example, binding to a `UWorld` that does not exist outside PIE.

:::tip

Each shipped overlay also registers a wrapping `UNEditorUtilityWidget` (e.g. `WB_NActorPoolsDeveloperOverlay`) under `Tools > NEXUS > <Plugin>` so users can spawn it from the editor menu. Mirror this pattern when building a custom overlay.

:::
