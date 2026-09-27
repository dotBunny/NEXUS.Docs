---
sidebar_label: Texture Packer Library
sidebar_class_name: type ue-blueprint-function-library
description: The Texture Packer without its window — pack and unpack driven from Blueprint, Python or C++.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNTexturePackerLibrary" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/NTexturePackerLibrary.h" />

The [Texture Packer](../../texture-packer.md) without its window, for driving pack and unpack from an Editor Utility Widget, an Editor Utility Blueprint, Python, or a commandlet. Its nodes are in the Blueprint action menu under **NEXUS | Tooling**.

The three *automatic* functions make the same choices the window proposes. Channel order and output names come from the asset names ([Naming Conventions](../../texture-packer.md#naming-conventions)), so a batch run over a folder produces what opening each texture in the window would have. The two *Advanced* functions decide nothing and do exactly what their request says.

Every function returns an [FNTexturePackerResult](texture-packer-job.md#result) and writes its warnings and outcome to `LogNexusToolingEditor`. As with the window, generated assets are left **dirty rather than saved**.

## Functions

### Pack Textures

```cpp
static FNTexturePackerResult PackTextures(const TArray<UTexture2D*>& Textures);
```

Packs one to four textures into one. Each texture's role is read from its name, and the first [layout](../../texture-packer.md#packed-layouts) covering exactly those roles decides the channel order and the suffix. When no layout covers them, the textures fill channels in the order given and the suffix is built from their roles, with a warning.

The result is written beside the first texture. An existing asset at that path is an **error**, not an overwrite. A texture holding the same map as one already assigned is skipped with a warning.

### Unpack Texture

```cpp
static FNTexturePackerResult UnpackTexture(UTexture2D* Texture);
```

Splits a packed texture into one texture per map, reading its layout from the name. Adjacent channels carrying the same role come out as one multi-channel texture. With [Skip Uniform Channels](texture-packer-settings.md) on, a channel holding one value throughout is left out. **Fails** when the name says nothing; the window is the tool for that case.

### Unpack Textures

```cpp
static FNTexturePackerResult UnpackTextures(const TArray<UTexture2D*>& Textures);
```

Runs [Unpack Texture](#unpack-texture) over every entry and combines the results. A texture that fails (usually because its name gives no layout) becomes a *"'Name' was skipped: …"* warning, and the batch carries on. The combined result succeeds when **at least one** texture unpacked, and fails only when none did. Null entries are ignored.

### Pack Textures (Advanced)

```cpp
static FNTexturePackerResult PackTexturesAdvanced(const FNTexturePackRequest& Request);
```

Packs exactly what an [FNTexturePackRequest](texture-packer-job.md#pack-request) describes: four slots, an output path and name, bit depth, sRGB, compression, and whether to overwrite.

### Unpack Texture (Advanced)

```cpp
static FNTexturePackerResult UnpackTextureAdvanced(const FNTextureUnpackRequest& Request);
```

Unpacks exactly what an [FNTextureUnpackRequest](texture-packer-job.md#unpack-request) describes: which runs of channels to write, and what to call each one.

## Example

```cpp title="Pack a hand-built request"
#include "TexturePacker/NTexturePackerLibrary.h"

FNTexturePackRequest Request;
Request.Slots.SetNum(4);                        // exactly four, RGBA order
Request.Slots[0].Texture = OcclusionMap;        // R
Request.Slots[1].Texture = GlossMap;            // G
Request.Slots[1].bInvert = true;                //   gloss -> roughness
Request.Slots[2].Texture = MetallicMap;         // B
Request.Slots[3].ConstantValue = 1.0f;          // A: no texture, flat white
Request.PackagePath = TEXT("/Game/Art/Rock");
Request.AssetName = TEXT("T_Rock_01_ORM");

const FNTexturePackerResult Result = UNTexturePackerLibrary::PackTexturesAdvanced(Request);
```

:::note

The class lives in the **editor-only** `NexusToolingEditor` module. Blueprints calling it must be editor-only too, such as Editor Utility Widgets or Editor Utility Blueprints.

:::
