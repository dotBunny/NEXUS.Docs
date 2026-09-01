---
sidebar_class_name: type native-class
description: Editor helper that registers a shared NEXUS property section across the standard Unreal property views.
---

import TypeDetails from '@site/src/components/TypeDetails';

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

/**
 * Releases the cached property sections, clears any queued categories, and resets registration state
 * so a later Register() rebinds cleanly.
 */
static void Unregister();
```

`Register()` is called once by `FNCoreEditorModule::StartupModule()`, and `Unregister()` by the matching shutdown; consumers should not call either directly.

Because `Unregister` resets the registration state rather than merely dropping the sections, a `Register` / `Unregister` / `Register` cycle — which is what a hot reload looks like — rebinds correctly and replays whatever categories were queued in between.

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
