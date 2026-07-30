---
sidebar_class_name: type ue-data-asset
description: Asset definition registering UNTissue with the Content Browser, plus the factory that creates new tissue assets.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Asset Definition (Tissue)

<TypeDetails icon="ue-data-asset" base="UAssetDefinitionDefault" type="UAssetDefinition_NTissue" typeExtra=" + UNCellSetFactory" headerFile="NexusWorldAssemblyEditor/Public/AssetDefinitions/AssetDefinition_NTissue.h" />

Asset definition for [UNTissue](../../types/tissue.md) — a reusable named collection of cell templates an organ draws from during generation. Registers the asset with the Content Browser and supplies the data-validation entry point.

Unlike its [Cell](asset-definition-cell.md) counterpart, a tissue is a **standalone** asset: an author creates it, fills it, and reuses it across organs and worlds. Nothing binds it to a particular level, so this definition needs none of the package-lifecycle machinery the cell side-car requires — presentation and validation is all of it.

## Asset Surface

| Method | Returns |
| :-- | :-- |
| `GetAssetDisplayName` | Human-readable name shown in the Content Browser. |
| `GetAssetColor` | The NEXUS light-blue asset tint. |
| `GetAssetClass` | `UNTissue::StaticClass()`. |
| `GetAssetCategories` | Category path the asset surfaces under in the "Create Asset" menu. |
| `GetAssetDescription` | Per-asset description rendered in the Content Browser. |

Duplication is **allowed** here — a tissue is a template, so copying one as the starting point for a variant is a reasonable thing to do.

## Validation

```cpp
/** Data-validation entry point invoked by UNWorldAssemblyEditorValidator for UNTissue assets. */
static EDataValidationResult ValidateAsset(const FAssetData& InAssetData, UObject* InAsset, FDataValidationContext& Context);
```

Called by `UNWorldAssemblyEditorValidator` during data-validation runs, so a tissue with broken cell references or contradictory tag groups is reported on save rather than silently producing an unbuildable organ.

## Factory — `UNCellSetFactory`

The factory that creates new tissue assets from the Content Browser's "Add" menu lives in **this same header** rather than in a file of its own:

```cpp
UCLASS(MinimalAPI, HideCategories = Object)
class UNCellSetFactory : public UFactory
```

It is configured for the standard blank-asset path — `bCreateNew = true`, `bEditorImport = false`, `bEditAfterNew = false` — and the body wiring comes from the `N_ASSET_FACTORY_BASE` macro in `NexusCoreEditor`'s `NEditorAssetMacros.h`. The result is an empty tissue the author then populates with cell templates.

:::note[The factory's name predates the type's]

The class is `UNCellSetFactory`, not `UNTissueFactory` — the type it creates was called "Cell Set" before it was renamed to "Tissue", and the factory kept the old name. It creates `UNTissue` assets and nothing else.

Worth knowing when grepping: searching for `TissueFactory` finds nothing. Renaming it would be a source-only change with no Blueprint exposure to redirect, since a `UFactory` is editor infrastructure.

:::

## See Also

- [Tissue](../../types/tissue.md) — the asset this definition registers, and its tag-group semantics.
- [Asset Definition (Cell)](asset-definition-cell.md) — the sibling definition, and the contrast: a world-bound side-car with a full package lifecycle.
