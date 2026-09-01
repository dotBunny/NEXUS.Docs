---
sidebar_class_name: type ue-data-asset
sidebar_label: Cell
description: Asset definition for UNCell — Content Browser presentation plus the package-lifecycle hooks that keep a cell side-car in sync with its host world.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell (Asset Definition)

<TypeDetails icon="ue-data-asset" base="UAssetDefinitionDefault" type="UAssetDefinition_NCell" typeExtra="" headerFile="NexusWorldAssemblyEditor/Public/AssetDefinitions/AssetDefinition_NCell.h" />

Asset definition for [UNCell](../../types/cell.md) — the on-disk side-car mirroring a cell actor's authored bounds, hull, and voxel data. It does considerably more than register a Content Browser entry: it owns the **package lifecycle** that keeps the side-car and its host world from drifting apart.

That extra weight comes from what a `UNCell` *is*. It is not a standalone asset an author creates; it is generated alongside a world and bound to it. Every hook here exists to maintain that binding when the world is renamed, deleted, or saved.

## Asset Surface

| Method | Returns |
| :-- | :-- |
| `GetAssetDisplayName` | Human-readable name shown in the Content Browser. |
| `GetAssetColor` | The NEXUS light-blue asset tint. |
| `GetAssetClass` | `UNCell::StaticClass()`. |
| `GetAssetCategories` | Category path the asset surfaces under. |
| `GetAssetDescription` | **The name of the world this side-car belongs to** — empty if the asset will not load. |
| `GetThumbnailActionOverlay` | A custom overlay brush on the thumbnail whose button selects the cell's level in the Content Browser. |

`GetAssetDescription` returning the host world's name is the useful bit: since a side-car is meaningless without its world, that pairing is what you need to see in a browser listing.

:::note[The thumbnail overlay uses a deprecated path deliberately]

UE 5.8 deprecated `ActionImageWidget` in favour of an `IsActionPlaying` delegate — but that newer path is hard-wired to the engine's Play/Stop icons and cannot render a custom brush. Since the cell overlay is a static NEXUS brush rather than a play toggle, the still-honoured widget path is kept and the deprecation locally silenced. The engine's own `SAssetThumbnail` does the same.

Expect this to need revisiting when the deprecated path is finally removed.

:::

## Duplication Is Blocked

```cpp
// We do not want NCells to be duplicated as they are tied to a specific world.
virtual FAssetSupportResponse CanDuplicate(const FAssetData& InAsset) const override { return FAssetSupportResponse::NotSupported(); }
```

:::warning

A cell side-car is tied to one specific world **and** one specific cell actor. Duplicating the asset would copy those references without rebinding them, producing a phantom that points at content it does not belong to — so the definition refuses outright rather than letting you create it.

To get a second cell, place another [Cell Actor](../../types/cell.md#cell-actor) and let its side-car be generated. Do not try to duplicate your way there.

:::

## Package Lifecycle

The static hooks that keep the side-car aligned with its host world.

| Hook | When | Does |
| :-- | :-- | :-- |
| `GetCellPackagePath` | — | Returns the canonical side-car path: the base path plus a `_NCell` suffix. |
| `GetOrCreatePackage` | On demand | Returns the world's existing side-car, **creating one on disk if missing**. |
| `OnAssetRemoved` | Asset registry | Cleans up orphaned side-car references when a cell asset is deleted. |
| `OnAssetRenamed` | Asset registry | Moves the side-car alongside its host world when that world is renamed. |
| `OnPreSaveWorldWithContext` | World pre-save | Syncs in-memory cell data into the side-car, **in memory only**. |
| `OnPostSaveWorldWithContext` | World post-save | Flushes that dirtied side-car package to disk. |

The `_NCell` suffix is also what [Cell Actor Factory](../cell-actor-factory.md) strips when naming a dropped proxy, so the two agree on the convention.

:::warning[Saving is split across two hooks on purpose]

The pre-save hook captures the recalculated cell state so it lands in the same level save, but it does **not** write the side-car package. Writing a package from inside a pre-save broadcast is a re-entrant save, which is unsafe — so the disk write is deferred to the post-save hook, once the world's own save has completed and a fresh top-level `SavePackage` is safe.

If you add work to either hook, keep that split: state capture goes in pre-save, disk writes in post-save.

:::

## Validation

```cpp
/** Data-validation entry point invoked by UNWorldAssemblyEditorValidator for UNCell assets. */
static EDataValidationResult ValidateAsset(const FAssetData& InAssetData, UObject* InAsset, FDataValidationContext& Context);
```

Called by `UNWorldAssemblyEditorValidator` during data-validation runs, so a malformed cell is caught on save or in a commandlet rather than at generation time.

## See Also

- [Cell](../../types/cell.md) — the cell actor, root component, and the side-car data this definition registers.
- [Asset Definition (Tissue)](asset-definition-tissue.md) — the sibling definition, and the contrast: a standalone asset with none of this lifecycle machinery.
- [Cell Actor Factory](../cell-actor-factory.md) — turns one of these assets into a placed proxy.
