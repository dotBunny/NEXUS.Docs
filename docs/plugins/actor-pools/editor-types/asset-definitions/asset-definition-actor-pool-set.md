---
sidebar_position: 1
sidebar_label: Asset Definition (Actor Pool Set)
sidebar_class_name: type ue-data-asset
description: Asset definition that registers UNActorPoolSet with the Content Browser — display name, color, category, and the static validator entry point.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Asset Definition (Actor Pool Set)

<TypeDetails icon="ue-data-asset" base="UAssetDefinitionDefault" type="UAssetDefinition_NActorPoolSet" typeExtra="" headerFile="NexusActorPoolsEditor/Public/AssetDefinitions/AssetDefinition_NActorPoolSet.h" />

Asset definition for [UNActorPoolSet](../../types/actor-pool-set.md). Registers the asset with the Content Browser, supplying the display name, NEXUS light-blue tint, category path, and a `ValidateAsset` static used by [UNActorPoolsEditorValidator](../actor-pools-editor-validator.md).

## Asset Surface

| Method | Returns |
| :-- | :-- |
| `GetAssetDisplayName` | Human-readable name shown in the Content Browser. |
| `GetAssetColor` | `FNColor::GetLinearColor(ENColor::NC_NexusLightBlue)` — the NEXUS asset tint. |
| `GetAssetClass` | `UNActorPoolSet::StaticClass()`. |
| `GetAssetCategories` | Category path the asset surfaces under in the "Create Asset" menu. |
| `GetAssetDescription` | Per-asset description rendered in the Content Browser. |

## Validation

### Validate Asset

Static helper that validates a single `UNActorPoolSet` asset. Used by the editor validator to gate save / commandlet runs.

```cpp
/**
 * Validate a single UNActorPoolSet asset, reporting issues to the provided context.
 * @param InAssetData Registry-level metadata for the asset.
 * @param InAsset The loaded asset instance.
 * @param Context Validation context to accumulate messages into.
 * @return The resulting validation verdict.
 */
static EDataValidationResult ValidateAsset(const FAssetData& InAssetData, UObject* InAsset, FDataValidationContext& Context);
```

## See Also

- [UNActorPoolSet](../../types/actor-pool-set.md) — the data asset this definition registers.
- [UNActorPoolSetFactory](../actor-pool-set-factory.md) — the matching factory that creates new instances.
- [UNActorPoolsEditorValidator](../actor-pools-editor-validator.md) — invokes `ValidateAsset` during data-validation runs.
