---
sidebar_label: Texture Packer Pack Panel
sidebar_class_name: type native-class
description: The Pack half of the Texture Packer window — four channel slots, and where their combination is written.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Pack Panel

<TypeDetails icon="native-class" base="SCompoundWidget" type="SNTexturePackerPackPanel" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/SNTexturePackerPackPanel.h" />

The **Pack** half of the [Texture Packer window](texture-packer-window.md): four channel slots and an output row. The controls are described from a user's point of view under [Pack](../../texture-packer.md#pack). This page covers how the panel behaves.

- **Slots hold textures weakly.** A texture assigned in the panel can be deleted or reloaded while the window is open, and the slot simply goes empty.
- **Clearing a slot resets it.** Its source goes back to `Auto` and `Invert` is cleared, so an empty slot never looks as if it is reading a particular channel.
- **Detection re-runs on every assignment.** Each slot's role comes from its texture's name, and the four roles are looked up **in RGBA order** with [Find Layout By Roles](texture-packer-settings.md#find-layout-by-roles). If a layout matches, it provides the suffix and compression. If not, the suffix is built from the roles in channel order and compression falls back to `Masks`.
- **Naming updates until you take over.** The output name (common base name + suffix) and path (the first assigned texture's folder) keep updating until you type in either box. **Suggest** clears both overrides.
- **Runs go through the job.** **Pack** turns the slots into an [FNTexturePackRequest](texture-packer-job.md#pack-request) and calls [FNTexturePackerJob::Pack](texture-packer-job.md#pack). A slot without a texture is sent as `Constant`. The run's warnings and any error stay on screen until the next run, in red if it failed.

## Public API

### Set Source Textures

```cpp
void SetSourceTextures(const TArray<UTexture2D*>& Textures);
```

Assigns `Textures` to channels exactly as [Build Auto Pack Request](texture-packer-job.md#build-auto-pack-request) would, then re-runs detection and the output proposal. Because it uses the same function as the batch path, what the window opens with is what an unattended run would have done. If no proposal can be made (no textures, or more than four), the panel shows the reason instead.
