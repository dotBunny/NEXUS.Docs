---
sidebar_label: Texture Packer Window
sidebar_class_name: type native-class
description: The Texture Packer window — a Pack / Unpack mode switch and the panel it selects.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Window

<TypeDetails icon="native-class" base="SCompoundWidget" type="SNTexturePacker" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/SNTexturePacker.h" />

The contents of the [Texture Packer](../../texture-packer.md) tab: a **Pack / Unpack** segmented switch at the top, and whichever of the two panels it has selected.

The window itself owns nothing except the switch. Each panel keeps its own state, so switching modes and back finds your work where you left it. That matters because packing a set and then checking an existing packed texture is a normal order to work in.

## ENTexturePackerMode

```cpp
enum class ENTexturePackerMode : uint8
{
	Pack = 0,
	Unpack = 1
};
```

`Pack` means several maps in, one packed texture out. `Unpack` means one packed texture in, one asset per map out. The values double as the widget switcher's slot index.

## Public API

### Open For Pack

```cpp
void OpenForPack(const TArray<UTexture2D*>& Textures);
```

Switches to [Pack](texture-packer-pack-panel.md) and assigns `Textures` to channels.

### Open For Unpack

```cpp
void OpenForUnpack(UTexture2D* Texture);
```

Switches to [Unpack](texture-packer-unpack-panel.md) and loads `Texture`.

Both are called through [FNTexturePackerTab](texture-packer-tab.md), which is where anything outside the window should go.
