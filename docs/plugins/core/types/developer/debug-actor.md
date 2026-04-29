---
sidebar_position: 12
sidebar_label: Debug Actor
sidebar_class_name: type ue-actor
description: A disposable diagnostic actor used to visualize a world-space location or arbitrary geometry during development.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Debug Actor

<TypeDetails icon="ue-actor" base="AActor" type="ANDebugActor" typeExtra="" headerFile="NexusCore/Public/Developer/NDebugActor.h" />

A disposable diagnostic actor used to visualize a world-space location or arbitrary geometry during development. Hidden from the editor's *Place Actors* panel, has no gameplay behavior, and should not be shipped in release content.

## Creation

```cpp
/**
 * Spawns a debug actor in the supplied world at the given transform, labeled for quick identification.
 * @param World The world to spawn into.
 * @param Position World position of the spawned marker.
 * @param Rotation World rotation of the spawned marker.
 * @param Label Human-readable message stored on the actor and shown in the details panel.
 * @param Scale World scale applied to the spawned marker.
 * @return The newly spawned debug actor, or nullptr if spawning failed.
 */
static ANDebugActor* CreateInstance(UWorld* World, const FVector& Position, const FRotator& Rotation, const FString& Label,
  const FVector& Scale = FVector::OneVector);
```

## Properties

| Property | Type | Role |
| :-- | :-- | :-- |
| `Message` | `FString` | Human-readable message shown in the details panel. |
| `OnDestroyed` | `FSimpleDelegate` | Fires when the actor is destroyed. |

## Methods

### Override With Dynamic Mesh

Replaces the sphere marker with arbitrary dynamic-mesh geometry, hiding the sphere in the process. Calls `Modify()` on the dynamic-mesh component so the change is captured by the editor's transaction system.

```cpp
void OverrideWithDynamicMesh(FDynamicMesh3 NewMesh, UMaterialInterface* Material) const;
```

### Outliner Visibility

Removes or restores this actor from the editor's World Outliner without affecting viewport visibility, selection, or any other behavior. Compiled out of non-editor builds.

```cpp
void HideInSceneOutliner();
void ShowInSceneOutliner();
```

### Component Accessors

```cpp
/** Accessor for the sphere marker component. */
TObjectPtr<UStaticMeshComponent> GetStaticMeshComponent() const;

/** Accessor for the dynamic-mesh component used by OverrideWithDynamicMesh. */
TObjectPtr<UDynamicMeshComponent> GetDynamicMeshComponent() const;
```
