---
sidebar_label: Texture Packer Asset Actions
sidebar_class_name: type native-class
description: Installs the Texture Packer submenu on the Content Browser's texture context menu.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Asset Actions

<TypeDetails icon="native-class" base="class" type="FNTexturePackerAssetActions" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/NTexturePackerAssetActions.h" />

Installs the **NEXUS > Texture Packer** submenu on the Content Browser's texture context menu (`ContentBrowser.AssetContextMenu.Texture2D`). The four entries are described on the feature page under [Opening It](../../texture-packer.md#opening-it).

Two entries decide nothing themselves. They read the selection's names, work out the arrangement, and write the result through [UNTexturePackerLibrary](texture-packer-library.md), so unpacking a whole folder of packed textures is one action instead of one per texture. The other two open the [window](texture-packer-tab.md) on the selection, for when a name doesn't say enough.

The submenu is rebuilt every time it opens, so the selection is read fresh then and shared by all four entries. A successful one-click run selects what it wrote. A failed one reports only to the log, because a menu action has nowhere else to show it.

## Public API

### Register

```cpp
static void Register();
```

Adds the NEXUS section and the Texture Packer submenu to the texture context menu. The tooling module calls it from a `UToolMenus` startup callback.

### Unregister

```cpp
static void Unregister();
```

Removes the submenu again.

This is editor-bootstrap glue. Typical NEXUS users never call it directly: the tooling module installs the menu on startup and removes it on shutdown.
