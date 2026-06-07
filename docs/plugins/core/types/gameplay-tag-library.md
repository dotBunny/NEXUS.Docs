---
sidebar_class_name: type ue-blueprint-function-library
description: Blueprint exposure layer that turns FGameplayTagContainer queries into branch-able execution nodes.
tags: [0.3.1]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# GameplayTag Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNGameplayTagLibrary" typeExtra="" headerFile="NexusCore/Public/NGameplayTagLibrary.h" />

Blueprint exposure layer that turns `FGameplayTagContainer` queries into branch-able execution nodes. Each helper wraps a standard container query and uses `meta=(ExpandBoolAsExecs="ReturnValue")`, so the boolean result drives **True** / **False** execution pins directly — there is no need to wire a separate `Branch` node after the query.

These are Blueprint-only conveniences. From C++ call the underlying `FGameplayTagContainer` queries (`HasTagExact`, `HasTag`, `HasAnyExact`, `HasAny`) directly.

## Branching Nodes

| Branching Node (Blueprint) | Wraps | Honors Hierarchy? |
| :-- | :-- | :-: |
| `Has Exact Tag ?` | `FGameplayTagContainer::HasTagExact` | No |
| `Has Tag ?` | `FGameplayTagContainer::HasTag` | Yes |
| `Has Any Exact Tags ?` | `FGameplayTagContainer::HasAnyExact` | No |
| `Has Any Tags ?` | `FGameplayTagContainer::HasAny` | Yes |

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

### Has Any Exact Tags ?

Branch on whether `TagContainer` holds **any** of the tags in `Tags` using an **exact** match. Tag hierarchy is ignored — the **True** pin fires when at least one tag in `Tags` is held exactly.

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Has Any Exact Tags ?", Category = "NEXUS|GameplayTags", meta=(ExpandBoolAsExecs="ReturnValue"))
static bool HasAnyTagExactExec(const FGameplayTagContainer& TagContainer, const FGameplayTagContainer Tags);
```

### Has Any Tags ?

Branch on whether `TagContainer` holds **any** of the tags in `Tags`, **honoring tag hierarchy** — a container tag that is a child of a queried tag also matches. The **True** pin fires when the container holds at least one tag in `Tags` or a descendant of it.

```cpp
UFUNCTION(BlueprintCallable, DisplayName="Has Any Tags ?", Category = "NEXUS|GameplayTags", meta=(ExpandBoolAsExecs="ReturnValue"))
static bool HasAnyTagExec(const FGameplayTagContainer& TagContainer, const FGameplayTagContainer Tags);
```
