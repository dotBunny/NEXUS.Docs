---
sidebar_position: 3
sidebar_label: Developer Utils
sidebar_class_name: type native-class
description: Cheap, read-only native helpers for build identification, root-set diagnostics, and editor compilation barriers.
tags: [0.2.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Developer Utils

<TypeDetails icon="native-class" base="class" type="FNDeveloperUtils" typeExtra="" headerFile="NexusCore/Public/Developer/NDeveloperUtils.h" />

Native helpers exposed for developer tooling and diagnostics. Members are intentionally cheap and read-only so they can be safely invoked from tests, overlays, and developer UIs without perturbing the state they are inspecting. [Developer Library](developer-library.md) re-exposes a Blueprint-friendly subset of these for in-editor use.

## Methods

### Is Demo Build

Returns `true` when the build was compiled with `IS_DEMO_BUILD=1`. Useful for gating demo-only content paths.

```cpp
FORCEINLINE static bool IsDemoBuild();
```

### Get Current Object Count

Approximate live UObject count, computed from `GUObjectArray`'s allocated count minus free slots.

```cpp
FORCEINLINE static int32 GetCurrentObjectCount();
```

### Get Root Set Objects

Scans the global UObject array and returns every object currently flagged on the engine root set.

```cpp
/**
 * @return An array of every rooted UObject at the time of the call.
 * @note Potentially expensive on large projects; use sparingly and from tools/diagnostics only.
 */
static TArray<UObject*> GetRootSetObjects();
```

### Dump Root Set To Log

Writes every rooted UObject's name to `LogNexusCore`, prefixed with the total count.

```cpp
/** @note Intended for on-demand leak diagnosis; not suitable for continuous logging. */
static void DumpRootSetToLog();
```

### Get Build Watermark

Builds a human-readable watermark identifying the current build — `<Version>-<Config><Target> (<Date>)`, with `+` replaced by `/` so it is path-safe.

```cpp
static FString GetBuildWatermark();
```

### Has Build Info

Returns `false` when running an unsubmitted local build (`UE5-CL-0`), `true` otherwise. Used to suppress overlays that rely on real changelist information.

```cpp
static bool HasBuildInfo();
```

### Wait For Static Mesh Compilation

Editor-only barrier that blocks until every currently-compiling `UStaticMesh` finishes its async compile. Iterates every loaded mesh, so cost scales with project size — call before operations that read mesh bounds, render data, or BodySetups where placeholder data would yield incorrect results.

```cpp
static void WaitForStaticMeshCompilation();
```

## See Also

- [Developer Library](developer-library.md) — Blueprint-callable wrappers around these helpers.
