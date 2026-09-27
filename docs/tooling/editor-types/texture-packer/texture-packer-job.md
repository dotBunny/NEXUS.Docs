---
sidebar_label: Texture Packer Job
sidebar_class_name: type native-class
description: Executes the Texture Packer's two operations, and builds a request for either from asset names alone.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Job

<TypeDetails icon="native-class" base="class" type="FNTexturePackerJob" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/NTexturePackerJob.h" />

Runs the [Texture Packer](../../texture-packer.md)'s two operations, and builds a request for either one from asset names alone. It has no Slate dependency. The window fills in a request and calls in here, and so do the [Content Browser actions](texture-packer-asset-actions.md) and [UNTexturePackerLibrary](texture-packer-library.md).

Every decision (what an output is called, what compression it gets, which channels belong together) is made in the `Build*` functions rather than in the UI. That is why a batch run makes the same choices the window would propose.

The header also declares the request and result structs that every entry point passes around. They are all `BlueprintType`, so Blueprint and Python can build and read them.

## Functions

### Pack

```cpp
static void Pack(const FNTexturePackRequest& Request, FNTexturePackerResult& OutResult);
```

Combines the request's four slots into one texture. In order:

1. Rejects a request that doesn't have exactly four slots, or whose output already exists (unless `bOverwriteExisting`).
2. Reads each distinct source **once**, as linear float. Three channels taken from one texture cost one read, not three.
3. Uses the output size given, or else the largest input, and resamples anything smaller with a warning.
4. Fills each channel from its slot's source, inverting where asked.
5. Writes the texture. An sRGB output is always demoted to 8-bit with a warning. When an 8-bit pack reads a gamma-encoded source, it warns that 16-bit would keep more precision in the darks.

A request with no texture in any slot is an error: at least one channel has to read something.

### Unpack

```cpp
static void Unpack(const FNTextureUnpackRequest& Request, FNTexturePackerResult& OutResult);
```

Writes one texture per **enabled** output. Every output name is checked for emptiness and collisions **before** anything is written, so a run that would collide partway through leaves nothing behind. Channels an output doesn't write are black with an opaque alpha, which is what a two-channel normal needs.

### Build Auto Pack Request

```cpp
static bool BuildAutoPackRequest(const UNTexturePackerSettings& Settings,
	const TArray<UTexture2D*>& Textures, FNTexturePackRequest& OutRequest, FNTexturePackerResult& OutResult);
```

Proposes a pack of one to four textures. Each texture's role comes from its name, and the first layout covering **exactly** those roles decides channel order, suffix and compression. Without such a layout, textures are assigned in the order given and the suffix is built from their roles (`Packed` if none are recognized), with a warning.

A second texture holding a role already taken is skipped with a warning. The output goes beside the first texture, named for the inputs' [common base name](texture-packer-utils.md#common-base-name). Bit depth and checkout come from the settings. Returns `false` with `OutResult.Error` set when there is nothing to propose.

### Build Auto Unpack Request

```cpp
static bool BuildAutoUnpackRequest(const UNTexturePackerSettings& Settings, UTexture2D* Texture,
	FNTextureUnpackRequest& OutRequest, FNTexturePackerResult& OutResult);
```

Proposes an unpack of `Texture` from its name. Adjacent channels with the same role become one output. When [Skip Uniform Channels](texture-packer-settings.md) is on, the source is decoded once and any output whose channels hold a single value throughout is switched off, with a warning. Returns `false` when the name says nothing about what the texture holds.

### Apply Role To Output

```cpp
static void ApplyRoleToOutput(const UNTexturePackerSettings& Settings, const FString& BaseName,
	FNTextureUnpackOutput& Output);
```

Fills in an output's name, sRGB flag and compression from its role: the canonical suffix, the role's `bOutputSRGB`, and its single- or multi-channel compression depending on `Length`. An unknown role is named after the channel letters it covers (`_R`, `_GB`), written linear, and compressed as `Alpha` or `Masks`.

## Pack Request

`FNTexturePackRequest`: everything one pack run needs.

| Property | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Slots` | `TArray<FNTexturePackSlot>` | The four output channels in RGBA order. Any count other than four is rejected. | empty |
| `PackagePath` | `FString` | Content Browser folder to write to (`/Game/Art/Rock`). | empty |
| `AssetName` | `FString` | Name of the generated asset, suffix included. | empty |
| `OutputSizeX` / `OutputSizeY` | `int32` | Output size, or `0` to take the widest and tallest input. | `0` |
| `bSixteenBit` | `bool` | Write 16 bits per channel instead of 8. | `false` |
| `bSRGB` | `bool` | Whether the result is gamma-encoded. Packed textures almost never are. | `false` |
| `Compression` | `TextureCompressionSettings` | Compression assigned to the result. | `TC_Masks` |
| `bCheckOut` | `bool` | Check an existing asset out of revision control rather than failing on a read-only file. | `true` |
| `bOverwriteExisting` | `bool` | Replace an asset already at the output path. Without it, an existing asset is an error. | `false` |

### Pack Slot

`FNTexturePackSlot`: what feeds one output channel.

| Property | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Texture` | `UTexture2D*` | Texture read for this channel. Null makes the slot constant regardless of `Source`. | `nullptr` |
| `Source` | [ENTextureChannelSource](texture-packer-types.md#entexturechannelsource) | Which part of `Texture` feeds the channel. | `Auto` |
| `bInvert` | `bool` | Write one minus the value (gloss → roughness). Ignored on a constant slot. | `false` |
| `ConstantValue` | `float` | Value written when the slot has no texture, linear, 0–1. | `0.0` |
| `bTreatSourceAsLinear` | `bool` | Take the texture's stored values as they are, ignoring its sRGB flag. | `false` |

## Unpack Request

`FNTextureUnpackRequest`: everything one unpack run needs.

| Property | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Texture` | `UTexture2D*` | The packed texture to split. | `nullptr` |
| `Outputs` | `TArray<FNTextureUnpackOutput>` | The textures to produce. An empty list, or one with nothing enabled, is an error rather than a no-op. | empty |
| `PackagePath` | `FString` | Content Browser folder to write to. | empty |
| `bSixteenBit` | `bool` | Write 16 bits per channel. Ignored for a gamma-encoded output, which is always 8. | `false` |
| `bTreatSourceAsLinear` | `bool` | Take the source's stored values as they are, ignoring its sRGB flag. | `false` |
| `bCheckOut` | `bool` | Check existing assets out rather than failing on read-only files. | `true` |
| `bOverwriteExisting` | `bool` | Replace assets already at the output paths. | `false` |

### Unpack Output

`FNTextureUnpackOutput`: one texture an unpack produces.

| Property | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `bEnabled` | `bool` | Whether this output is written. | `true` |
| `RoleId` | `FName` | Role the channels carry. Sets the suffix, sRGB flag and compression proposed for the asset. | `None` |
| `FirstChannel` | [ENTextureChannel](texture-packer-types.md#entexturechannel) | First source channel this output reads. | `Red` |
| `Length` | `int32` | How many adjacent channels it reads, 1–4. More than one produces a color texture. | `1` |
| `AssetName` | `FString` | Name of the generated asset, suffix included. | empty |
| `bSRGB` | `bool` | Whether the generated texture is gamma-encoded. | `false` |
| `Compression` | `TextureCompressionSettings` | Compression assigned to it. | `TC_Alpha` |

## Result

`FNTexturePackerResult`: what a run produced, and anything worth knowing about how it went.

| Property | Type | Description |
| :-- | :-- | :-- |
| `bSucceeded` | `bool` | Whether the run completed. A failed pack, or an unpack stopped by a bad name or collision, writes nothing. |
| `Textures` | `TArray<UTexture2D*>` | Textures written, in the order they were requested. |
| `Warnings` | `TArray<FText>` | Notes from a run that still succeeded: a resample, a precision loss, a skipped duplicate, a uniform channel left off. |
| `Error` | `FText` | Why the run stopped, when it did. |
