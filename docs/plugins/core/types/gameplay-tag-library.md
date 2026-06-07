---
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint exposure layer that turns FGameplayTagContainer queries into branch-able execution nodes.
tags: [0.3.1]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# GameplayTag Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNGameplayTagLibrary" typeExtra="" headerFile="NexusCore/Public/NGameplayTagLibrary.h" />

Blueprint exposure layer that turns `FGameplayTagContainer` queries into branch-able execution nodes. Each helper wraps a standard container query and uses `meta=(ExpandBoolAsExecs="ReturnValue")`, so the boolean result drives **True** / **False** execution pins directly — there is no need to wire a separate `Branch` node after the query.

These are Blueprint-only conveniences. From C++ call `FGameplayTagContainer::HasTagExact` / `FGameplayTagContainer::HasTag` directly.

## Branching Nodes

| Branching Node (Blueprint) | Wraps | Honors Hierarchy? |
| :-- | :-- | :-: |
| `Has Exact Tag ?` | `FGameplayTagContainer::HasTagExact` | No |
| `Has Tag ?` | `FGameplayTagContainer::HasTag` | Yes |

### Has Exact Tag ?

Branch on whether `TagContainer` holds `Tag` using an **exact** match. Tag hierarchy is ignored — the container must hold exactly `Tag` for the **True** pin to fire.

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Has Exact Tag ?", Category = "NEXUS|GameplayTags", meta=(ExpandBoolAsExecs="ReturnValue"))
static bool HasExactTagExec(const FGameplayTagContainer& TagContainer, const FGameplayTag Tag);
```

### Has Tag ?

Branch on whether `TagContainer` holds `Tag`, **honoring tag hierarchy** — a container tag that is a child of `Tag` also matches. The **True** pin fires when the container holds `Tag` or any descendant of it.

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Has Tag ?", Category = "NEXUS|GameplayTags", meta=(ExpandBoolAsExecs="ReturnValue"))
static bool HasTagExec(const FGameplayTagContainer& TagContainer, const FGameplayTag Tag);
```
