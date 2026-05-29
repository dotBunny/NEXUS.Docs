---
sidebar_class_name: type ue-object
description: Editor data validator that runs UAssetDefinition_NActorPoolSet::ValidateAsset against pool-set assets on save and during commandlet validation.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Actor Pools Editor Validator

<TypeDetails icon="ue-object" base="UEditorValidatorBase" type="UNActorPoolsEditorValidator" typeExtra="" headerFile="NexusActorPoolsEditor/Public/NActorPoolsEditorValidator.h" />

`UEditorValidatorBase` that gates Actor Pools assets — currently [UNActorPoolSet](../types/actor-pool-set.md) — through the engine's data-validation pipeline. The actual validation logic lives on [UAssetDefinition_NActorPoolSet::ValidateAsset](asset-definitions/asset-definition-actor-pool-set.md); this validator only handles registration and delegation so the Engine's `DataValidation` hooks pick up the check on save and during commandlet runs.

## Overrides

### Can Validate Asset

```cpp
virtual bool CanValidateAsset_Implementation(
    const FAssetData& InAssetData,
    UObject* InObject,
    FDataValidationContext& InContext) const override;
```

Returns `true` for `UNActorPoolSet` instances; the validator declines everything else so unrelated asset types are not affected.

### Validate Loaded Asset

```cpp
virtual EDataValidationResult ValidateLoadedAsset_Implementation(
    const FAssetData& InAssetData,
    UObject* InAsset,
    FDataValidationContext& Context) override;
```

Forwards the loaded asset to `UAssetDefinition_NActorPoolSet::ValidateAsset` and returns its verdict.

## See Also

- [UAssetDefinition_NActorPoolSet](asset-definitions/asset-definition-actor-pool-set.md) — owns the actual `ValidateAsset` implementation.
- [UNActorPoolSet](../types/actor-pool-set.md) — the data asset being validated.
