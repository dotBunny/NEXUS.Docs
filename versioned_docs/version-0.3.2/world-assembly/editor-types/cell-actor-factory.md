---
sidebar_class_name: type ue-object
description: Actor factory that turns a UNCell asset dropped into the viewport into an initialized cell proxy.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Actor Factory

<TypeDetails icon="ue-object" base="UActorFactory" type="UNCellActorFactory" typeExtra="" headerFile="NexusWorldAssemblyEditor/Public/NCellActorFactory.h" />

The drag-and-drop path from a [UNCell](../types/cell.md) asset to a placed [Cell Proxy](../types/cell-proxy.md). Drop a cell asset into the viewport and this factory spawns an `ANCellProxy` and initializes it from the dropped cell.

Note it is a `UActorFactory` — it places an actor *from* an existing asset. That is a different job from the `UFactory` that **creates** a new asset, which for tissue lives on [Asset Definition (Tissue)](asset-definitions/asset-definition-tissue.md#factory--uncellsetfactory).

## Configuration

Set in the constructor:

| Property | Value |
| :-- | :-- |
| `DisplayName` | `"NCell Proxy"` |
| `NewActorClass` | `ANCellProxy::StaticClass()` |

## Overrides

| Override | Behaviour |
| :-- | :-- |
| `CanCreateActorFrom` | Accepts only valid asset data that is an instance of `UNCell`. Anything else is rejected, so the drop is not offered. |
| `PostSpawnActor` | Casts the new actor to `ANCellProxy` and calls `InitializeFromNCell` with the dropped asset. |
| `GetDefaultActorLabel` | Strips the `_NCell` suffix from the asset name to produce the placed actor's label. |

The `_NCell` suffix is the same convention [Asset Definition (Cell)](asset-definitions/asset-definition-cell.md#package-lifecycle) applies when generating a side-car package path — this strips it back off so a proxy is labelled after the level it represents rather than after the side-car asset.

:::note[The label must not include its own numeric suffix]

`GetDefaultActorLabel` returns the bare stripped name and stops there. The engine appends the disambiguating number itself via `SetActorLabelUnique`, so adding one here would produce doubled suffixes on the second proxy placed.

:::

`PostSpawnActor` casts the asset without a preceding type check, which is safe because `InitializeFromNCell` null-checks the cell internally — a non-`UNCell` asset yields a null cast and is handled rather than crashing. `CanCreateActorFrom` should have rejected it long before that anyway; the inner check is defence in depth.

## See Also

- [Cell](../types/cell.md) — the asset this factory consumes.
- [Cell Proxy](../types/cell-proxy.md) — the actor it spawns, and what `InitializeFromNCell` sets up.
- [Asset Definition (Cell)](asset-definitions/asset-definition-cell.md) — registers the asset and owns the `_NCell` naming convention.
