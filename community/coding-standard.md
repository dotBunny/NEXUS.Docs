---
title: Coding Standard
description: Trying to herd cats.
hide_table_of_contents: false
sidebar_position: 3
---

# Coding Standard

We follow the published [Epic C++ Coding Standard](https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine) wherever possible. There are some minor cases where we will diverge with an opinionated purpose, with inspirations from Michael Allar’s [UE5 Style Guide](https://github.com/Allar/ue5-style-guide/tree/v2) as well.

:::info[Editor Config]

Included with the project is an [EditorConfig](https://github.com/dotBunny/NEXUS/blob/main/TestProject/.editorconfig) which attempts to enforce our coding standard while working on the **TestProject**.

:::

## File Layout

Every C++ source file (`.h` / `.cpp`) starts with the standard two-line header — the EditorConfig `file_header_template` enforces this, and the SonarQube job will flag headers that drift from it:

```cpp
// Copyright dotBunny Inc. All Rights Reserved.
// See the LICENSE file at the repository root for more information.
```

Headers use `#pragma once` rather than include guards, and module APIs follow Unreal's standard `Public/` / `Private/` split. Inside `Public/`, headers are organized into themed subfolders that mirror their logical grouping — for example, [`Math/`](https://github.com/dotBunny/NEXUS/tree/main/Plugins/Core/Source/NexusCore/Public/Math), [`Types/`](https://github.com/dotBunny/NEXUS/tree/main/Plugins/Core/Source/NexusCore/Public/Types), [`Macros/`](https://github.com/dotBunny/NEXUS/tree/main/Plugins/Core/Source/NexusCore/Public/Macros), and [`Developer/`](https://github.com/dotBunny/NEXUS/tree/main/Plugins/Core/Source/NexusCore/Public/Developer) under `NexusCore`. New plugins should follow the same shape; the documentation site mirrors it under `types/<subfolder>/`.

Every plugin exposes a single-namespace minimal header (e.g. `NActorPoolsMinimal.h`) and a public log category declared with `<MODULE>_API DECLARE_LOG_CATEGORY_EXTERN(LogNexus<Module>, …)`. Module classes are `FN<Name>Module` and use the `N_IMPLEMENT_MODULE` macro from [`NModuleMacros.h`](https://github.com/dotBunny/NEXUS/blob/main/Plugins/Core/Source/NexusCore/Public/Macros/NModuleMacros.h).

## Naming Conventions

**NEXUS**-owned types insert an `N` after the standard Unreal type prefix so they are immediately distinguishable from engine and project types in editor browsers, autocomplete, and stack traces:

| Kind | Prefix | Example |
| :-- | :-- | :-- |
| `UCLASS` (UObject-derived) | `UN` | `UNActorPoolSubsystem` |
| `UCLASS` (Actor-derived) | `AN` | `ANKillZoneActor` |
| `USTRUCT` | `FN` | `FNPositionRotation` |
| `UENUM` | `EN` | `ENCardinalDirection` |
| `UINTERFACE` | `IN` / `UN` | `INActorPoolItem` / `UNActorPoolItem` |
| Module class | `FN…Module` | `FNCoreModule` |

Other rules:

- **Macros** are prefixed `N_` (e.g. `N_WORLD_SUBSYSTEM`, `N_TEST_SMOKE`, `N_TRUE_FALSE`). Reserve all-caps `N_` identifiers for macros.
- **Namespaces** for compile-time constants and lightweight helpers nest under `NEXUS::<Subsystem>::<Group>` — see [`NEXUS::Version`](https://github.com/dotBunny/NEXUS/blob/main/Plugins/Core/Source/NexusCore/Public/NCoreMinimal.h) and `NEXUS::Core::CardinalDirection`.
- **Log categories** follow `LogNexus<Module>` (e.g. `LogNexusCore`, `LogNexusActorPools`).
- **Booleans** use the `b` prefix on locals, parameters, and fields (`bIsAttachedToActorPool`) — enforced by EditorConfig.
- Prefer `int32` over `int` to remove ambiguity between 32-bit and 64-bit values.

## Formatting

The EditorConfig is the source of truth, but in summary:

- **Tabs** for indentation (width 4); access specifiers are not indented relative to the class brace.
- **Allman braces** — opening brace on its own line for namespaces, types, and functions.
- **Max line length** of 150 characters.
- Pointer/reference alignment is left (`Type* Name`, not `Type *Name`).

## Comments 

Unreal Engine implements a Javadoc-style parsing system, which supports some of the tags of the typical Doxygen spec.

| Tag | Outcome | Description |
| :-- | :-: | :-- |
| `@param` | **Parsed** | |	
| `@note` |	**Parsed** | Converted to "Notes:" inside of tooltips. |
| `@brief` | Passthrough | |	
| `@remark` |	Passthrough | |	
| `@see` | Passthrough | |	
| `@warning` | _Ignored_ | |	
| `@return` |	**Parsed** | |	

:::info[Passthrough]

Any `@tag` marked as `Passthrough` will show up in tooltips as-is.

:::

## Macros & Boilerplate

Common patterns are wrapped in macros under [`Public/Macros/`](https://github.com/dotBunny/NEXUS/tree/main/Plugins/Core/Source/NexusCore/Public/Macros). Prefer using these over hand-rolled boilerplate so behavior stays consistent across plugins:

- **Module declaration** — [`N_IMPLEMENT_MODULE`](https://github.com/dotBunny/NEXUS/blob/main/Plugins/Core/Source/NexusCore/Public/Macros/NModuleMacros.h) inside an `FN<Name>Module` class body.
- **World subsystems** — [`N_WORLD_SUBSYSTEM`](https://github.com/dotBunny/NEXUS/blob/main/Plugins/Core/Source/NexusCore/Public/Macros/NSubsystemMacros.h), `N_WORLD_SUBSYSTEM_GAME_ONLY`, and the `N_TICKABLE_WORLD_SUBSYSTEM_*` family inject the standard `Get(World)` accessors, stat IDs, and `ShouldCreateSubsystem` gating.
- **Tests** — [`N_TEST`](https://github.com/dotBunny/NEXUS/blob/main/Plugins/Core/Source/NexusCore/Public/Macros/NTestMacros.h) plus its priority/filter variants (`N_TEST_SMOKE_HIGH`, `N_TEST_PERF_CRITICAL`, etc.) auto-tag tests with `[NEXUS]` and the appropriate filter so they show up correctly in [Automation](automation.md).
- **General helpers** — [`NGeneralMacros.h`](https://github.com/dotBunny/NEXUS/blob/main/Plugins/Core/Source/NexusCore/Public/Macros/NGeneralMacros.h) provides small utilities like `N_TRUE_FALSE`, `N_STRINGIFY`, and `N_CONCAT` for log/format expressions.

When a public `UCLASS`, `USTRUCT`, `UINTERFACE`, or `UENUM` is documented on this site, link back to its page from the header's Doxygen comment using `@see` so the type's tooltip points users at the live documentation:

```cpp
/**
 * ...
 * @see <a href="https://nexus-framework.com/docs/plugins/<plugin>/types/<type>/">UNExampleType</a>
 */
```

## Choices

- Prefer to use `int32` over `int` to match typedef and remove any ambiguity between 32-bit and 64-bit values.
- Prefer `using enum E…;` inside `switch`/lookup blocks to keep enumerator references readable — see [`FNCardinalDirectionUtils`](https://github.com/dotBunny/NEXUS/blob/main/Plugins/Core/Source/NexusCore/Public/Types/NCardinalDirection.h) for the pattern.
- Prefer `FORCEINLINE` accessors on subsystem `Get` helpers and other one-line wrappers; the subsystem macros already do this.

## ReSharper Warnings

We disable warnings which are considered expected behavior.

### Potential GC Of Private Raw Pointers

```cpp
// ReSharper disable once CppUE4ProbableMemoryIssuesWithUObjectsInContainer
```

### Enumeration Naming

```cpp
// ReSharper disable IdentifierTypo, CppUE4CodingStandardNamingViolationWarning
...
// ReSharper enable IdentifierTypo, CppUE4CodingStandardNamingViolationWarning
```

## SonarQube Analysis

[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-highlight.svg)](https://sonarcloud.io/summary/overall?id=dotBunny_NEXUS&branch=main)

A special thanks to the folks at [SonarSource](https://www.sonarsource.com/) for the free static analysis of the framework, on _every_ commit. :heart:

### Tags

We primarily are using a tag based exclusion method when a rule needs to be violated.

```cpp
// #SONARQUBE-DISABLE-<LANGUAGE>_<RULE> <reason>
...
// #SONARQUBE-ENABLE
```

### Duplication Exclusions

- `**/Macros/N*.h`
- `**/Types/NCardinalDirection.h`
- `**/NexusPicker/Private/N*Picker.cpp`
- `**/NexusCore/Private/Developer/NPrimitiveFont.cpp`
  
### Source Folder Exclusions

- `.github/**`
- `SourceAssets/**`
- `**/*Editor/Tests/*`
  
### Ignore Issues on Multiple Criteria

| Rule Key Pattern | File Path Pattern | Choice |
| :-- | :-- | :-- |
| [`cpp:S3471`](https://sonarcloud.io/organizations/dotbunny/rules?open=cpp%3AS3471&rule_key=cpp%3AS3471), [`cpp:S3576`](https://sonarcloud.io/organizations/dotbunny/rules?open=cpp%3AS3576&rule_key=cpp%3AS3576) |  `**` | This is a developer choice; where the `override` and `virtual` specifiers are used to easily identify methods being replaced from the `Super`. This **also** matches the practice done in the Unreal Engine codebase. |