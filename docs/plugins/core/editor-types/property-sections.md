---
sidebar_label: Property Sections
sidebar_class_name: type native-class
description: Editor helper that registers a shared NEXUS property section across the standard Unreal property views.
tags: [0.3.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Property Sections

<TypeDetails icon="native-class" base="class" type="FNPropertySections" typeExtra="" headerFile="NexusCoreEditor/Public/NPropertySections.h" />

Editor-only helper that registers a single shared `NEXUS` property section against Unreal's `Actor`, `ActorComponent`, `SceneComponent`, and `UObject` property views, and provides per-section `AddCategory` entry points so plugin modules can opt their own categories into that section at startup.

The section appears as a `NEXUS` tab in the details panel of any registered type, grouping every category the plugins have contributed under it. Categories registered before `Register()` runs are queued and replayed on first registration, so module-startup ordering does not matter.

## Lifecycle

```cpp
/**
 * Find-or-create the four NEXUS property sections (Actor, ActorComponent, SceneComponent, Object),
 * seed them with the base "NEXUS" category, and flush any categories queued by AddCategory calls
 * that ran before Register().
 */
static void Register();
```

`Register()` is called once by `FNCoreEditorModule::StartupModule()`; consumers should not call it directly.

## Category Registration

Each entry point adds the supplied category name to the matching property section, queuing it for replay when `Register()` runs later in the startup ordering.

```cpp
/** Add Category to every NEXUS property section (Actor, ActorComponent, SceneComponent, Object). */
static void AddCategory(FName Category);

/** Add Category to the NEXUS property section attached to AActor details views. */
static void AddActorCategory(FName Category);

/** Add Category to the NEXUS property section attached to UActorComponent details views. */
static void AddActorComponentCategory(FName Category);

/** Add Category to the NEXUS property section attached to USceneComponent details views. */
static void AddSceneComponentCategory(FName Category);

/** Add Category to the NEXUS property section attached to UObject details views. */
static void AddObjectCategory(FName Category);
```

Calling any of these with a category that has already been added is a no-op — internal `HasAddedCategory` checks guard against duplicates.
