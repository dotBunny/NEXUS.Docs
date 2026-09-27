---
sidebar_label: Texture Packer Tab
sidebar_class_name: type native-class
description: The Texture Packer window's dockable tab, and its entry in the NEXUS Tools menu.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Tab

<TypeDetails icon="native-class" base="class" type="FNTexturePackerTab" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/NTexturePackerTab.h" />

The [Texture Packer](../../texture-packer.md) window's tab, and its **Texture Packer** entry in the **Windows** section of `Tools > NEXUS`. It is a **nomad tab**, not a separate window, so it docks wherever you put it and the editor restores it there on the next launch. The tab is registered under the identifier `NexusTexturePacker`.

## Public API

### Register

```cpp
static void Register();
```

Registers the tab spawner and adds the Tools menu entry. Unlike most menu work this happens immediately, not deferred: a tab spawner goes to the tab manager rather than a menu, and the entry goes into the NEXUS Tools menu registry, which is read when the menu is built.

### Unregister

```cpp
static void Unregister();
```

Removes the menu entry and the tab spawner.

### Open

```cpp
static void Open();
```

Opens the window, or focuses it when it is already open.

### Open For Pack

```cpp
static void OpenForPack(const TArray<UTexture2D*>& Textures);
```

Opens the window on its **Pack** side with `Textures` assigned to channels the way an automatic run would assign them. See [SNTexturePackerPackPanel](texture-packer-pack-panel.md).

### Open For Unpack

```cpp
static void OpenForUnpack(UTexture2D* Texture);
```

Opens the window on its **Unpack** side with `Texture` loaded and its layout already read. See [SNTexturePackerUnpackPanel](texture-packer-unpack-panel.md).

The Content Browser's `Open in Texture Packer` entries use these two. The tab holds its [SNTexturePacker](texture-packer-window.md) as a **weak** reference, because the tab owns the widget and closing the tab has to be able to destroy it.
