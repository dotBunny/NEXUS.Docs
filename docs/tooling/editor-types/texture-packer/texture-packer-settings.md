---
sidebar_label: Texture Packer Settings
sidebar_class_name: type ue-settings
description: The naming conventions the Texture Packer reads and writes, plus the defaults its two modes start on.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Texture Packer Settings

<TypeDetails icon="ue-settings" base="UDeveloperSettings" type="UNTexturePackerSettings" typeExtra="" headerFile="NexusToolingEditor/Public/TexturePacker/NTexturePackerSettings.h" />

The naming conventions the [Texture Packer](../../texture-packer.md) reads and writes, plus the defaults its two modes start on. Found at `Edit > Editor Preferences > NEXUS > Texture Packer`, and saved to `DefaultNexusEditor.ini` (`config = NexusEditor, defaultconfig`), so the conventions are **shared by the whole project**.

Everything the tool knows about what a suffix means is in this class rather than in code, because the answer differs between projects. A project with its own vocabulary edits two tables and never touches C++. The shipped defaults are listed on the feature page under [Channel Roles](../../texture-packer.md#channel-roles) and [Packed Layouts](../../texture-packer.md#packed-layouts).

## Properties

| Property | Display Name | Type | Default |
| :-- | :-- | :-- | :-- |
| `Roles` | `Channel Roles` | `TArray<FNTextureChannelRole>` | 16 roles |
| `Layouts` | `Packed Layouts` | `TArray<FNTexturePackedLayout>` | 12 layouts |
| `bSixteenBitOutput` | `Sixteen Bit Output` | `bool` | `false` |
| `bCheckOutAssets` | `Check Out Assets` | `bool` | `true` |
| `bSelectResults` | `Select Results` | `bool` | `true` |
| `bSkipUniformChannels` | `Skip Uniform Channels` | `bool` | `true` |

The row types, `FNTextureChannelRole` and `FNTexturePackedLayout`, are documented on [Texture Packer Types](texture-packer-types.md).

:::info[Order matters in Layouts]

Several conventions describe the same arrangement under different names. `ORM` and `ARM` are both occlusion / roughness / metallic. A lookup **by roles** returns the **first** matching row, so put the spelling your project prefers above its synonyms. Lookups **by suffix** are exact and unaffected by order.

:::

`Sixteen Bit Output` sets the starting value of the 16-bit toggle on both sides of the window, and the bit depth of the automatic runs. `Select Results` is only read by the window. The Content Browser's one-click actions always select what they wrote.

## Lookups

All of these are native C++, compiled only with editor data (`WITH_EDITORONLY_DATA`), and match suffixes case-insensitively without a leading underscore.

### Find Role

```cpp
const FNTextureChannelRole* FindRole(const FName Id) const;
```

Returns the role registered under `Id`, or `nullptr`.

### Find Role By Suffix

```cpp
const FNTextureChannelRole* FindRoleBySuffix(const FString& Suffix) const;
```

Returns the first role listing `Suffix` among its suffixes, or `nullptr`.

### Find Layout By Suffix

```cpp
const FNTexturePackedLayout* FindLayoutBySuffix(const FString& Suffix) const;
```

Returns the layout named by `Suffix`, or `nullptr`.

### Find Layout By Roles

```cpp
const FNTexturePackedLayout* FindLayoutByRoles(const TArray<FName>& InRoles) const;
```

Returns the **first** layout whose four channel roles are exactly `InRoles`, in RGBA order, or `nullptr`. A signature with no roles at all matches nothing, even a layout of four empty channels.

### Get All Suffixes

```cpp
void GetAllSuffixes(TArray<FString>& OutSuffixes) const;
```

Fills `OutSuffixes` with every suffix from both tables, de-duplicated and sorted **longest first**. Matching suffixes greedily, as [FNTexturePackerUtils](texture-packer-utils.md) does, relies on that order to take `AO` before `A`.

## Accessing It

`Get()` and `GetMutable()` come from the NEXUS editor-settings macro:

```cpp
const UNTexturePackerSettings* Settings = UNTexturePackerSettings::Get();
```

For tests, `NewObject<UNTexturePackerSettings>()` gives you the shipped defaults without anything the project's ini has changed. [FNTexturePackerUtils](texture-packer-utils.md) takes its settings as a parameter for exactly that reason.
