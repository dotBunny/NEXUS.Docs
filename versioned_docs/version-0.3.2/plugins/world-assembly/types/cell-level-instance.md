---
sidebar_class_name: type ue-actor
description: Runtime level-instance actor spawned for a cell during a World Assembly pass, carrying replicated assembly data.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Cell Level Instance

<TypeDetails icon="ue-actor" base="ALevelInstance" type="ANCellLevelInstance" typeExtra="" headerFile="NexusWorldAssembly/Public/Cell/NCellLevelInstance.h" />

The actor that carries a placed cell's actual content into the world. Where a [Cell Proxy](cell-proxy.md) is the lightweight stand-in, this is the `ALevelInstance` holding the streamed level — and it is the object gameplay is handed when a cell finishes initializing.

It is also **the replication boundary**. The assembly data lives here, replicated to clients, which is how a client attributes a cell back to the operation that produced it without having generated anything itself.

:::note

`NotPlaceable`, `Hidden`, `HideDropdown`, and **`Transient`** — created exclusively by the pipeline and never saved. The class is `final`.

:::

## Reading Assembly Data

The cell's [Cell Assembly Data](cell-assembly-data.md) is replicated on this actor, with accessors for the parts gameplay usually wants:

| Accessor | Returns |
| :-- | :-- |
| `GetAssemblyData()` | The whole record, mutable. |
| `GetContextTags()` | Mutable access to the operation's final context tags. |
| `GetAssemblyTags()` | Mutable access to this cell's assembly tags. |
| `GetSeed()` | The seed this cell was generated with. |
| `GetNodeIdentifier()` | The graph node this cell came from. |
| `GetOperationTicket()` | The [operation](assembly-operation.md) ticket this instance belongs to. |
| `GetCellLinkDetails(JunctionIdentifier)` | The connection state for one junction. |

:::warning[Several accessors return mutable references]

`GetAssemblyData`, `GetContextTags`, and `GetAssemblyTags` hand back **non-const references** into the replicated struct. Writing through them changes local state without replicating it, so a client and server can silently diverge. Treat them as read paths unless you specifically intend a local-only change — and prefer the [World Assembly Library](world-assembly-library.md) nodes, which return copies.

:::

`UpdateFromAssemblyData()` refreshes the instance from the current data, and is what the `OnRep_AssemblyData` notify calls when a client receives it.

## Junction Data

```cpp
/** Local copy of junction data from generation output, built from replicated JunctionDetails array. */
TMap<int32, FNCellJunctionDetails> JunctionData;
```

A map keyed by junction instance identifier, rebuilt locally from the replicated array. The array is what crosses the wire; the map exists so lookups by identifier are constant-time rather than a scan. Use `GetCellLinkDetails()` for connection state, and see [Junction Component](junction-component.md#component-details) for the fields.

## Proxy Mesh

```cpp
/** @return The cell's proxy dynamic mesh, or nullptr if none is set. */
UDynamicMesh* GetProxyMesh() const;
```

:::note[Server/owner only]

The proxy mesh is a **non-owning** reference set during `ANCellProxy` spawn, so it only resolves on the machine that spawned the proxy. On a client it returns `nullptr`. Anything that needs cell geometry on a client must derive it from the streamed level rather than this.

:::

## Lifecycle

`OnLevelInstanceLoaded()` fires once the level content is in. That is the point at which the paired [Cell Proxy](cell-proxy.md) hides its preview mesh, and where [Cell Initialized](cell-initialized.md) implementors receive their callback.

Instances register themselves with the World Assembly registry so lookups by locator can find them; the proxy's `DestroyLevelInstance` can optionally unregister on the way out.
