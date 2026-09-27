---
sidebar_label: Texture Packer Types
sidebar_class_name: type native-struct
description: The vocabulary the Texture Packer is written against — channels, channel sources, roles, packed layouts and channel runs.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Types

<TypeDetails icon="native-struct" base="struct" type="FNTextureChannelRole" typeExtra="/ FNTexturePackedLayout" headerFile="NexusToolingEditor/Public/TexturePacker/NTexturePackerTypes.h" />

The vocabulary both directions of the [Texture Packer](../../texture-packer.md) are written against. A **role** is one kind of map (roughness, base color). A **layout** is an arrangement of roles across RGBA, named by a suffix. A **run** is a group of adjacent channels holding the same role. The tables of roles and layouts live on [UNTexturePackerSettings](texture-packer-settings.md).

## ENTextureChannel

One of the four channels of an RGBA texture, in memory order.

```cpp
UENUM()
enum class ENTextureChannel : uint8
{
	Red = 0,
	Green = 1,
	Blue = 2,
	Alpha = 3
};
```

The values are used directly as an index into `FLinearColor::Component`, so they must not be reordered.

## ENTextureChannelSource

Which part of a source texture feeds one output channel of a pack.

```cpp
UENUM()
enum class ENTextureChannelSource : uint8
{
	Auto = 0,
	Red = 1,
	Green = 2,
	Blue = 3,
	Alpha = 4,
	Luminance = 5,
	Constant = 6
};
```

| Value | Reads |
| :-- | :-- |
| `Auto` | **Red** from a single-channel source; the **matching** channel from anything wider. This is where every slot starts. |
| `Red` / `Green` / `Blue` / `Alpha` | That channel of the source. |
| `Luminance` | The Rec. 709 luminance of the source's RGB, for combining a color map into one channel. |
| `Constant` | Nothing. The slot's constant value fills the channel. |

## FNTextureChannelRole

One kind of map, plus everything needed to recognize it in an asset name and to configure a texture that holds it. One row of `Channel Roles`.

| Property | Type | Description |
| :-- | :-- | :-- |
| `Id` | `FName` | Stable identifier that layouts refer to. Never shown to the user. |
| `DisplayName` | `FString` | Name shown in the tool's role pickers. |
| `Suffixes` | `TArray<FString>` | Suffixes that identify the role, without the underscore, matched case-insensitively. The **first** one is canonical: it is written onto generated assets, and used to build a suffix for an arrangement no layout covers. |
| `bIndustryStandard` | `bool` | Labels the role *standard* in the pickers. |
| `bOutputSRGB` | `bool` | Whether a texture holding only this role is gamma-encoded. True for color, false for anything measured. |
| `SingleChannelCompression` | `TextureCompressionSettings` | Compression when the role is unpacked to a one-channel texture. |
| `MultiChannelCompression` | `TextureCompressionSettings` | Compression when the role spans several adjacent channels, as color and normal roles do. |

```cpp
FString GetCanonicalSuffix() const;
FText GetDisplayText() const;
```

`GetCanonicalSuffix()` returns the first suffix, or the `Id` when there are none. `GetDisplayText()` returns `DisplayName`, falling back to the `Id`.

## FNTexturePackedLayout

A known arrangement of four roles across an RGBA texture, and the suffix that names it. One row of `Packed Layouts`.

| Property | Type | Description |
| :-- | :-- | :-- |
| `Suffix` | `FString` | Suffix that identifies the layout (`ORM`), without the underscore, matched case-insensitively. |
| `DisplayName` | `FString` | Description shown beside the suffix (`Occlusion / Roughness / Metallic`). |
| `RedRole` / `GreenRole` / `BlueRole` / `AlphaRole` | `FName` | The role each channel carries, or `None` when the channel is unused. Packing leaves an unused channel at its constant, and unpacking skips it. |
| `bIndustryStandard` | `bool` | Labels the layout *standard*, and groups it under *Industry Standard* in the unpack layout menu. |
| `Compression` | `TextureCompressionSettings` | Compression applied to a texture packed into this layout. |

A role repeated across **adjacent** channels spans them. The `CA` layout is `BaseColor / BaseColor / BaseColor / Opacity`, which unpacks to one RGB color map and one grayscale opacity map rather than four grayscales. Runs have to be adjacent, which every common convention already is.

```cpp
FName GetRole(const ENTextureChannel Channel) const;
TArray<FName> GetRoles() const;
bool MatchesRoles(const TArray<FName>& InRoles) const;
FText GetDisplayText() const;
```

`GetRoles()` returns all four roles in RGBA order, with unused channels as `NAME_None`. `MatchesRoles()` is true only for exactly those four roles in that order.

## FNTextureChannelRun

A contiguous group of channels carrying the same role, produced when a layout is read for unpacking. Plain C++, not reflected.

| Member | Type | Description |
| :-- | :-- | :-- |
| `RoleId` | `FName` | The role every channel in the run carries. |
| `FirstChannel` | `ENTextureChannel` | First channel of the run. |
| `Length` | `int32` | How many adjacent channels it covers, 1–4. |

A run of one becomes a grayscale asset. A run of three becomes an RGB one. Runs are built by [FNTexturePackerUtils::BuildChannelRuns](texture-packer-utils.md#build-channel-runs).
