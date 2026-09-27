---
sidebar_position: 5
sidebar_label: Texture Packer
description: Pack up to four maps into the channels of one texture, or split a packed texture back into one asset per map — driven by the names your textures already have.
---

# Texture Packer

Every project eventually grows a folder of `_AO`, `_R` and `_M` textures that somebody has to squash into an `_ORM`, and a folder of `_ORM` textures from a marketplace pack that somebody has to pull apart again. Usually that somebody opens an image editor, drags channels around, and gets the order wrong once.

The **Texture Packer** does both jobs inside the editor. **Pack** takes up to four maps and writes each into one channel of a new texture. **Unpack** takes a packed texture and writes one asset per map it holds. Either way it reads your asset **names** to work out what goes where. When the names follow a convention (and the defaults cover the usual ones), there is nothing to set up: select, right-click, done.

When a name says nothing useful, the window lets you say it instead.

:::tip[It never saves for you]

Everything the packer writes is left **dirty and unsaved**. You can look at the result, check it in a material, and only then save it, or throw it away if it is wrong.

:::

## Opening It

There are two ways in.

- **`Tools > NEXUS > Texture Packer`** opens the window. It is a dockable tab, so park it wherever suits you. The editor puts it back there on the next launch.
- **Right-click textures in the Content Browser** and open **NEXUS > Texture Packer**. You get four entries:

| Entry | Enabled When | What It Does |
| :-- | :-- | :-- |
| `Pack` | 1–4 textures selected | Packs the selection straight away. It works out the channel order and the output name from the names, writes the result beside the first texture, and selects it. |
| `Unpack` | Any textures selected | Unpacks **every** selected texture whose name says what it holds. It skips the ones whose names don't, and keeps going through the rest of the selection. |
| `Open in Texture Packer` | 1–4 textures selected | Opens the window on the **Pack** side, already filled in the way `Pack` would do it, so you can review before writing anything. |
| `Open in Texture Packer (Unpack)` | Any textures selected | Opens the window on the **Unpack** side with the **first** selected texture loaded. |

The first two entries write straight away. The other two open the window so you can check first.

:::warning[The one-click actions report failures to the Output Log only]

The one-click `Pack` and `Unpack` have no panel to show errors in. When they succeed, they select what they wrote. When they fail, nothing visible happens, and the reason goes to the **Output Log** under `LogNexusToolingEditor`. If a right-click `Pack` seems to do nothing, look there first, or use `Open in Texture Packer` to see the same proposal in the window.

:::

## Pack

The **Pack** side has one row per output channel: **R**, **G**, **B** and **A**. Each row has:

| Control | What It Does |
| :-- | :-- |
| Texture | The source map for this channel. Leave it empty and the channel is filled with a flat value instead. |
| Source | Which part of the source to read: `Auto`, `Red`, `Green`, `Blue`, `Alpha`, `Luminance`, or `Constant`. See [Source Channels](#source-channels). |
| Constant | The flat value (0–1, linear) written when no texture is assigned. It only appears while the texture slot is empty. |
| `Invert` | Writes one minus the value. This turns a gloss map into a roughness map. |
| `Raw` | Reads the source's stored values as they are and ignores its sRGB flag. See [Color, Precision & Size](#color-precision--size). |

Above the output row, a readout says what the tool thinks you have made, for example *Detected ORM - Occlusion / Roughness / Metallic (industry standard)*. If no known layout matches, it says so and shows the suffix it built instead ([Naming Conventions](#naming-conventions) explains how).

The readout checks the channels **in the order you arranged them**. Roughness in red and occlusion in green is not an `ORM`, however you look at it, so the readout builds a suffix from that exact order instead. When the tool fills the slots itself (see [Opening It](#opening-it)), it picks the order from a matching layout, so the readout agrees.

The output **Path** and **Name** are filled in from the assigned textures, and they update as you change the assignment. Type in either box and it stops updating, so a name you chose isn't overwritten. **Use Selected** takes the folder currently selected in the Content Browser. **Suggest** discards your edits and goes back to the proposed path and name.

`16-bit output` and `Overwrite existing` apply to this run only. Then press **Pack**.

### Source Channels

`Auto` is where every slot starts, and it is usually correct:

- A **single-channel** source (a grayscale mask stored as `G8`, `G16`, `R16F` or `R32F`) is read from **red**, which is where a grayscale texture keeps its data.
- **Anything wider** is read from the **matching** channel. Assigning one RGB texture to R, G and B copies it straight across without three manual choices.

The others do what their names say. `Luminance` combines the source's RGB into one channel using Rec. 709 weights (0.2126 red, 0.7152 green, 0.0722 blue), which is useful for turning a color map into a mask. `Constant` ignores the texture and writes the slot's constant value.

:::note

When the tool fills the slots for you (from a right-click `Pack` or `Open in Texture Packer`), a map that takes a **single** channel is set to `Red` rather than `Auto`. The assumption is that a mask keeps its data in red however many channels it was saved with. A map that spans several channels, such as the normal in a `_NAH` texture, is set to `Auto` so its channels line up one for one.

:::

## Unpack

The **Unpack** side takes one packed **Texture**. It reads the name, works out the **Layout**, and lists one row per map that will be written.

- **Channels that carry the same map become one texture.** A `_CA` texture (color in RGB, opacity in A) unpacks to one **RGB** base-color texture and one grayscale opacity texture, not four grayscales. The same applies to a normal map packed across two or three channels.
- **Channels that hold one value throughout are switched off** when [Skip Uniform Channels](#settings) is on, which it is by default. The unused alpha of an `_ORM` texture is the main case, since writing it out produces an asset nothing will ever sample. A channel counts as uniform when every pixel is within one 8-bit step of the first pixel.
- **Each row can be changed.** Untick it to skip that map, change its **role** (which sets the suffix, the sRGB flag and the compression of the generated texture), or rename it. Once you type in a name box, that name stops updating.
- **The layout menu overrides the name.** It lists the known layouts under *Industry Standard* and *Project*, and has *Custom - one texture per channel* under *Other*. Use it when a texture is badly named, or not named at all.
- **An unrecognized name opens on the custom layout.** You get four single-channel rows, each still to be given a role and named after its channel letter for now (`_R`, `_G`, `_B`, `_A`). Give each row a role before unpacking, or `_R` will look a lot like roughness to the next person.

`16-bit output`, `Overwrite existing`, `Raw source`, and the output **Path** (with **Use Selected**) behave as they do on the Pack side. Then press **Unpack**.

Before writing anything, the unpack checks that every enabled output has a name and that none of them would collide with an existing asset (unless `Overwrite existing` is on). A run can't stop halfway and leave only some of its textures behind.

## Naming Conventions

This is what makes the one-click actions work. The rules are short:

1. **The suffix is the last underscore-separated part of the name**, matched without its underscore and **case-insensitively**. `T_Rock_01_ORM` has the suffix `ORM`, and `T_Rock_01_d` reads as base color.
2. **Only suffixes the tables know count as suffixes.** `T_Rock_01` has no suffix, because `01` is not a known map type, so the whole name is the base name. The tool never guesses.
3. **Pack names its output from what the inputs share.** The base name is the longest run of leading *tokens* the inputs have in common, compared token by token rather than letter by letter. `T_Rock_01_R` and `T_Rock_02_M` share `T_Rock`, not `T_Rock_0`. The layout's suffix goes on the end.
4. **Unpack names each output from the canonical suffix of its role**, which is the **first** suffix listed for that role. `T_Rock_01_ORM` becomes `T_Rock_01_AO`, `T_Rock_01_R` and `T_Rock_01_M`.

### Channel Roles

A role is one kind of map, together with the texture settings a texture holding it should get. These are the shipped defaults. The first suffix in each row is the one written onto generated textures.

| Role | Suffixes | sRGB | Standard |
| :-- | :-- | :-: | :-: |
| Base Color | `BC`, `D`, `C`, `Albedo`, `Diffuse` | ✔ | ✔ |
| Normal | `N`, `NRM`, `Normal` | | ✔ |
| Roughness | `R`, `Rough` | | ✔ |
| Metallic | `M`, `Metal` | | ✔ |
| Ambient Occlusion | `AO`, `O`, `Occlusion` | | ✔ |
| Height | `H`, `Disp`, `Displacement` | | ✔ |
| Specular | `S`, `Spec` | | ✔ |
| Emissive | `E`, `Emissive` | ✔ | ✔ |
| Opacity | `A`, `Alpha`, `Opacity` | | ✔ |
| Smoothness | `Smooth`, `Gloss` | | ✔ |
| Bent Normal | `BN` | | |
| Subsurface | `SSS` | | |
| Cavity | `CAV` | | |
| Curvature | `CV` | | |
| Translucency | `T`, `Trans` | | |
| Mask | `MSK` | | |

Compression follows the kind of data:

- Color roles (Base Color, Emissive) use the engine default compression.
- Normal roles (Normal, Bent Normal) use `Normalmap`.
- Every other role unpacks to `Alpha` (BC4) when it is a single channel, and to `Masks` when it spans several.

### Packed Layouts

A layout is a known arrangement of roles across RGBA. A role repeated across adjacent channels spans them.

| Suffix | Red | Green | Blue | Alpha | Standard |
| :-- | :-- | :-- | :-- | :-- | :-: |
| `ORM` | Occlusion | Roughness | Metallic | — | ✔ |
| `ARM` | Occlusion | Roughness | Metallic | — | ✔ |
| `RMA` | Roughness | Metallic | Occlusion | — | ✔ |
| `MRA` | Metallic | Roughness | Occlusion | — | ✔ |
| `MRAO` | Metallic | Roughness | Occlusion | — | ✔ |
| `ORMH` | Occlusion | Roughness | Metallic | Height | ✔ |
| `RMAH` | Roughness | Metallic | Occlusion | Height | |
| `MSR` | Metallic | Specular | Roughness | — | |
| `CA` | Base Color | Base Color | Base Color | Opacity | |
| `NAH` | Normal | Normal | Occlusion | Height | |
| `NT` | Normal | Normal | Normal | Translucency | |
| `MSK` | Mask | Mask | Mask | Mask | |

Every layout writes with `Masks` compression. **Standard** only affects how the tool labels the layout ("industry standard") and which group it appears under in the unpack layout menu.

:::info[The first layout in the table wins]

When **packing**, the tool uses the first layout that covers exactly the maps you gave it: nothing missing, nothing extra. With the defaults, an occlusion, roughness and metallic set always comes out as `_ORM`, because `ORM` is listed above its `ARM` synonym. If your project prefers `ARM`, move that row up in the [settings](#settings). Unpacking by suffix is exact, so row order never matters there.

:::

### When No Layout Matches

The tool still has a fallback before it gives up.

- **Packing** a set that no layout covers still works. The maps go into channels **in the order they were given**, and the suffix is built from each map's canonical suffix, with adjacent repeats combined. Roughness, metallic and height would give `_RMH`. You get a warning saying so. If none of the maps is recognized at all, the name ends in `_Packed`.
- **Unpacking** only recognizes suffixes that are in one of the two tables. A built suffix like `_RMH` is not, so the one-click `Unpack` skips that texture with a warning, and the window opens it on the custom layout. Pick the roles by hand, or add an `RMH` row to [Packed Layouts](#packed-layouts) so both directions recognize it.
- **Unpacking** a name that ends in a single role suffix (`T_Rock_R`) reads it as holding just that one map, so there is nothing to split out. The proposed output has the source's own name, and the run stops with an *already exists* error unless you choose to overwrite.

## Color, Precision & Size

The packer does every calculation in 32-bit float, in **linear** space.

- **Sources are decoded the way a material would decode them.** A source with its `sRGB` flag set is converted to linear on the way in, unless you tick `Raw` for that slot (or `Raw source` for an unpack). Use `Raw` when a texture has the wrong flag and you want its stored numbers taken as they are.
- **Packed textures are written with sRGB off**, because they almost always hold masks. This includes a `_CA` pack, so its color is stored as linear values.
- **Converting a gamma-encoded source to linear and writing it at 8 bits loses precision in the darks.** When you pack a gamma-encoded source at 8 bits, the tool warns you and suggests `16-bit output`. It points out the problem and leaves the choice to you.
- **A gamma-encoded output is always 8-bit.** Unpacking a color role with `16-bit output` on still writes that texture at 8 bits, with a warning. The engine's wider image formats are linear only, so a 16-bit texture flagged as sRGB would carry mislabelled values.
- **Mismatched sizes are resampled.** A pack is written at the size of its **largest** input, and anything smaller is resampled up to it with a warning. A half-resolution height map is common and not treated as an error. The Advanced request can set the output size explicitly.
- **New textures copy their settings from a source.** A newly created texture takes its mip generation, address, filter and LOD group settings from the texture in the **red** slot (for a pack) or from the packed texture (for an unpack). An overwritten texture keeps its own settings; only its pixels, sRGB flag and compression are replaced. An existing asset of any other type is never replaced.

### Limitations

- **UDIM textures are not supported.** A texture with more than one UDIM block is rejected.
- **The source art must be available.** Textures created at runtime, or stripped of their source data, can't be read.
- **Pack takes four maps at most**, one per channel.
- **The one-click actions never overwrite.** If an output already exists, that run fails. Use the window's `Overwrite existing`, or `bOverwriteExisting` on an Advanced request, when replacing a texture is what you want.

## Scripting It

Everything the window does is available without it. [UNTexturePackerLibrary](editor-types/texture-packer/texture-packer-library.md) exposes five Blueprint-callable functions under **NEXUS | Tooling**. They work in Editor Utility Widgets, Editor Utility Blueprints, Python and C++.

| Node | Decides For You? | Use It For |
| :-- | :-: | :-- |
| `Pack Textures` | Yes | The same result as the right-click `Pack`: layout and name worked out from the names. |
| `Unpack Texture` | Yes | The same result as the right-click `Unpack`, for one texture. |
| `Unpack Textures` | Yes | A batch. Textures whose names say nothing become warnings, and the run only fails if **none** of them unpacked. |
| `Pack Textures (Advanced)` | No | Packs exactly what an [FNTexturePackRequest](editor-types/texture-packer/texture-packer-job.md#pack-request) describes. |
| `Unpack Texture (Advanced)` | No | Unpacks exactly what an [FNTextureUnpackRequest](editor-types/texture-packer/texture-packer-job.md#unpack-request) describes. |

Every call returns an [FNTexturePackerResult](editor-types/texture-packer/texture-packer-job.md#result) with `bSucceeded`, the `Textures` written, any `Warnings`, and an `Error` when it fails. Each call also writes its warnings and outcome to `LogNexusToolingEditor`, so a batch job leaves a record in the log.

```cpp title="Unpack a folder's worth of packed textures"
#include "TexturePacker/NTexturePackerLibrary.h"

const FNTexturePackerResult Result = UNTexturePackerLibrary::UnpackTextures(PackedTextures);
for (const FText& Warning : Result.Warnings)
{
	UE_LOG(LogTemp, Warning, TEXT("%s"), *Warning.ToString());
}
if (!Result.bSucceeded)
{
	UE_LOG(LogTemp, Error, TEXT("Nothing unpacked: %s"), *Result.Error.ToString());
}
```

```python title="The same, from the editor's Python console"
import unreal

selected = [a for a in unreal.EditorUtilityLibrary.get_selected_assets() if isinstance(a, unreal.Texture2D)]
result = unreal.NTexturePackerLibrary.unpack_textures(selected)
for warning in result.warnings:
    unreal.log_warning(str(warning))
```

The module is **editor-only** (`NexusToolingEditor`), so none of this is available in a cooked build.

## Settings

The conventions and defaults are under `Edit > Editor Preferences > NEXUS > Texture Packer`. They are saved to `DefaultNexusEditor.ini`, which means they are **project-wide** and meant to be checked in, so everyone on the team packs to the same convention. Backed by [UNTexturePackerSettings](editor-types/texture-packer/texture-packer-settings.md).

| Setting | Description | Default |
| :-- | :-- | :-- |
| `Channel Roles` | The [roles table](#channel-roles): suffixes, sRGB flag and compression per kind of map. | See above |
| `Packed Layouts` | The [layouts table](#packed-layouts). Row order matters when packing. | See above |
| `Sixteen Bit Output` | Starts both sides of the window, and the one-click actions, at 16 bits per channel. | `false` |
| `Check Out Assets` | Checks generated assets out of revision control, and adds new ones, instead of failing on a read-only file. | `true` |
| `Select Results` | Selects what a **window** run produced in the Content Browser. The one-click actions always select their results. | `true` |
| `Skip Uniform Channels` | When unpacking, leaves switched off any channel whose pixels are all the same value. | `true` |

A project with its own naming (say `_Rgh` for roughness, or a `_RMOH` layout) just adds rows. You don't need any C++.
