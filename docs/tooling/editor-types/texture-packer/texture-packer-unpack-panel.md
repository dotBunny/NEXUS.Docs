---
sidebar_label: Texture Packer Unpack Panel
sidebar_class_name: type native-class
description: The Unpack half of the Texture Packer window — one packed texture, and a row per map it turns out to hold.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Unpack Panel

<TypeDetails icon="native-class" base="SCompoundWidget" type="SNTexturePackerUnpackPanel" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/SNTexturePackerUnpackPanel.h" />

The **Unpack** half of the [Texture Packer window](texture-packer-window.md): one packed texture, a layout picker, and one row per map it turns out to hold. The controls are described from a user's point of view under [Unpack](../../texture-packer.md#unpack). This page covers how the panel behaves.

- **Loading a texture reads its name.** A recognized layout (by [Detect Layout](texture-packer-utils.md#detect-layout)) becomes one row per [channel run](texture-packer-types.md#fntexturechannelrun). An unrecognized name gets the **custom** layout: four single-channel rows, one per channel, each waiting for a role.
- **Names can be wrong, so the layout can be changed.** The layout menu groups the known layouts under *Industry Standard* and *Project*, plus *Other > Custom - one texture per channel*. Picking one rebuilds the rows.
- **Each row is editable.** The enable toggle, a role picker (which re-proposes the name, sRGB flag and compression through [Apply Role To Output](texture-packer-job.md#apply-role-to-output)), and the asset name. A name you type is left alone from then on.
- **Uniform channels start switched off** when [Skip Uniform Channels](texture-packer-settings.md) is on. The source is decoded once to check, respecting the panel's `Raw source` toggle.
- **Unpack needs a path and one enabled, named row.** It then builds an [FNTextureUnpackRequest](texture-packer-job.md#unpack-request) and calls [FNTexturePackerJob::Unpack](texture-packer-job.md#unpack). When [Select Results](texture-packer-settings.md) is on, the written textures are selected in the Content Browser.

## Public API

### Set Source Texture

```cpp
void SetSourceTexture(UTexture2D* Texture);
```

Loads `Texture` into the panel and re-reads what it holds. Loading a texture resets the output path to that texture's folder, even if you had typed a path for the previous one, and clears the previous run's messages.
