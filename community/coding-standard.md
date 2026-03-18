---
title: Coding Standard
description: Trying to heard cats.
hide_table_of_contents: false
sidebar_position: 3
---

# Coding Standard

We follow the published [Epic C++ Coding Standard](https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine) wherever possible. There are some minor cases where we will diverge with an opinionated purpose, with inspirations from Michael Allar’s [UE5 Style Guide](https://github.com/Allar/ue5-style-guide/tree/v2) as well.

:::info[Editor Config]

Included with the project is an [EditorConfig](https://github.com/dotBunny/NEXUS/blob/main/TestProject/.editorconfig) which attempts to enforce our coding standard while working on the **TestProject**.

:::

## Comments 
Unreal Engine implements a Javadoc-style parsing system, which supports some of the tags of the typical Doxygen spec.
| Tag | Outcome | Description |
| --- | --- | --- |
| `@param` | **Parsed** | |	
| `@note` |	**Parsed** | Converted to "Notes:" inside of tooltips. |
| `@brief` | Passthrough | |	
| `@remark` |	Passthrough | |	
| `@see` | Passthrough | |	
| `@warning` | _Ignored_ | |	
| `@return` |	**Parsed** | |	

## Choices

- Prefer to use `int32` over `int` to match typedef and remove any ambiguity between 32-bit and 64-bit values.

## Resharper Warnings

We disable warnings which are considered expected behaviour.

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

### Source File Exclusions

- `.github/**`
- `SourceAssets/**`
- `**/NexusPicker/Private/N*Picker.cpp`
  
### Ignore Issues on Multiple Criteria

| Rule Key Pattern | File Path Pattern | Choice |
| :-- | :-- | :-- |
| [`cpp:S3471`](https://sonarcloud.io/organizations/dotbunny/rules?open=cpp%3AS3471&rule_key=cpp%3AS3471), [`cpp:S3576`](https://sonarcloud.io/organizations/dotbunny/rules?open=cpp%3AS3576&rule_key=cpp%3AS3576) |  `**` | This is a developer choice; where the `override` and `virtual` specifiers are used easily identify methods being replaced from the `Super`. This **also** matches the practice done in the Unreal Engine codebase. |