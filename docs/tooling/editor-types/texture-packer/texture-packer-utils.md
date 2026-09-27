---
sidebar_label: Texture Packer Utils
sidebar_class_name: type native-class
description: The Texture Packer's naming logic and pixel plumbing, as stateless free functions.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Utils

<TypeDetails icon="native-class" base="class" type="FNTexturePackerUtils" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/NTexturePackerUtils.h" />

The [Texture Packer](../../texture-packer.md)'s naming logic and pixel plumbing, as static functions. None of them keep state, and none reach for the settings object: each takes a [UNTexturePackerSettings](texture-packer-settings.md) as a parameter. That lets the naming half be tested in isolation. A test builds the settings with `NewObject` to get the shipped defaults without whatever the project's ini has changed, which is how `NexusToolingEditorTests` exercises it.

## Naming

### Split Asset Name

```cpp
static FNTextureNameParts SplitAssetName(const UNTexturePackerSettings& Settings, const FString& AssetName);
```

Splits a name into a **base** and a trailing **suffix**, returned as `FNTextureNameParts { BaseName, Suffix }`. Only the token after the **last** underscore is considered, and only when a role or layout lists it. Anything else stays on the base name. `T_Rock_01_ORM` gives `T_Rock_01` + `ORM`, but `T_Rock_01` comes back whole instead of losing its `01`.

### Common Base Name

```cpp
static FString CommonBaseName(const TArray<FString>& BaseNames);
```

The longest run of leading underscore-separated **tokens** shared by every name, compared case-insensitively. `T_Rock_01` and `T_Rock_02` share `T_Rock`, not the `T_Rock_0` a character-by-character comparison would give. Names sharing nothing, or an empty list, give an empty string.

### Compose Asset Name

```cpp
static FString ComposeAssetName(const FString& BaseName, const FString& Suffix);
```

Joins the two with an underscore, and returns whichever one is set when the other is empty.

### Compose Suffix For Roles

```cpp
static FString ComposeSuffixForRoles(const UNTexturePackerSettings& Settings, const TArray<FName>& InRoles);
```

Builds a suffix for a set of channel roles that no layout covers, by joining each role's canonical suffix. Adjacent repeats are combined, so a normal map spanning red and green contributes one `N`. Roles the settings don't know contribute nothing.

### Decompose Suffix To Roles

```cpp
static bool DecomposeSuffixToRoles(const UNTexturePackerSettings& Settings, const FString& Suffix,
	TArray<FName>& OutRoles);
```

Reads a suffix as a sequence of role suffixes, taking the longest match first (`RMAOH` → roughness, metallic, occlusion, height). Returns `true` only when the whole suffix is consumed into four or fewer roles. `OutRoles` is always four long. This is a last resort: it can't tell `AO` from `A` followed by `O`, and takes the longer one.

:::note

[Detect Layout](#detect-layout) calls this as its final fallback. In practice it never gets there, because [Split Asset Name](#split-asset-name) only accepts a suffix that the tables already list. A composite suffix like `RMH` is left on the base name, so detection reports it as unrecognized.

:::

### Infer Role

```cpp
static FName InferRole(const UNTexturePackerSettings& Settings, const FString& AssetName);
```

The role a single texture holds, from its name's suffix. `NAME_None` when the suffix is missing, or names a layout rather than a role.

### Detect Layout

```cpp
static bool DetectLayout(const UNTexturePackerSettings& Settings, const FString& AssetName,
	FNTexturePackedLayout& OutLayout, FString& OutBaseName);
```

Works out what a packed texture holds from its name. It tries three things in order:

1. A known **layout** suffix.
2. A single **role** suffix, which gives a one-role layout.
3. A decomposed suffix.

`OutBaseName` always receives the name with any recognized suffix removed. Returns `false`, with `OutLayout` empty, when nothing matches.

### Build Channel Runs

```cpp
static TArray<FNTextureChannelRun> BuildChannelRuns(const TArray<FName>& InRoles);
```

Groups adjacent channels with the same role into [runs](texture-packer-types.md#fntexturechannelrun), skipping unused channels. This is what keeps a color map packed across RGB from unpacking into three grayscales. `BaseColor, BaseColor, BaseColor, Opacity` gives two runs: base color over three channels starting at red, then opacity over one channel at alpha.

## Pixels

### Read Texture Linear

```cpp
static bool ReadTextureLinear(UTexture2D* Texture, FImage& OutImage, bool bTreatAsLinear,
	FText& OutError);
```

Reads a texture's **source art** (mip 0) as 32-bit float linear RGBA. Every channel operation works in this format. A gamma-encoded source is decoded exactly as a material sampler would decode it, unless `bTreatAsLinear` is set. Fails for a missing texture, a texture without source data (created at runtime or stripped), or a UDIM texture with more than one block.

### Is Channel Uniform

```cpp
static bool IsChannelUniform(const FImage& LinearImage, ENTextureChannel Channel);
```

`true` when every pixel of `Channel` is within one 8-bit step (1/255) of the first pixel's value.

### Sample Channel

```cpp
static float SampleChannel(const FLinearColor& Pixel, ENTextureChannelSource Source,
	ENTextureChannel TargetChannel, bool bSourceIsSingleChannel);
```

The value `Source` selects from `Pixel`. `TargetChannel` and `bSourceIsSingleChannel` only matter for `Auto`, which reads red from a single-channel source and the matching channel otherwise. `Luminance` uses Rec. 709 weights.

### Is Single Channel Source

```cpp
static bool IsSingleChannelSource(const UTexture2D* Texture);
```

`true` when the texture's source format holds one meaningful channel (`G8`, `G16`, `R16F`, `R32F`), so `Auto` should read red.

## Assets

### Create Or Update Texture

```cpp
static UTexture2D* CreateOrUpdateTexture(const FString& PackagePath, const FString& AssetName,
	const FImage& Image, bool bSRGB, TextureCompressionSettings Compression,
	const UTexture2D* SettingsTemplate, bool bCheckOut, FText& OutError);
```

Writes `Image` into the texture at `PackagePath/AssetName`, creating it when needed.

- **Checkout.** With `bCheckOut` set, an existing file on disk is checked out (or added) first. A texture already under revision control is read-only, and writing its source would otherwise fail late.
- **Settings template.** A **new** texture copies its mip, address, filter and LOD-group settings from `SettingsTemplate`.
- **Existing assets.** An existing texture keeps its own settings. An existing asset that isn't a `UTexture2D` is refused rather than replaced.
- **Saving.** The package is left **dirty, not saved**.

Returns `nullptr` with `OutError` set on failure.

### Get Package Path

```cpp
static FString GetPackagePath(const UObject* Asset);
```

The long package path (the folder) holding `Asset`, or empty when it has no package.

### Does Asset Exist

```cpp
static bool DoesAssetExist(const FString& PackagePath, const FString& AssetName);
```

Asks the Asset Registry whether an asset already exists at `PackagePath/AssetName`.

### Select Assets In Content Browser

```cpp
static void SelectAssetsInContentBrowser(const TArray<UObject*>& Assets);
```

Moves the Content Browser to `Assets`, replacing its selection.

### Get Content Browser Path

```cpp
static FString GetContentBrowserPath();
```

The folder currently selected in the Content Browser, converted from the browser's virtual path (`/All/Game/...`) to one that can be written to (`/Game/...`). Empty when nothing usable is selected. It backs the window's **Use Selected** buttons.
