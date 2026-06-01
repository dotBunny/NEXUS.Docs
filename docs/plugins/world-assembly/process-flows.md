---
description: A procedural generation system focused on creating dynamic gameplay-focused spaces.
sidebar_position: 4
tags: [0.3.0]
---

# Process Flows

While not necessary to understand in-depth, these flowcharts express some of the inner workings of the systems used inside of World Assembly in a digestable way. 

## Task Graph

When a `FNAssemblyTaskGraph` is created, it builds out the full graph of tasks but does not dispatch them until instructed.

### Order Of Operations

```mermaid
flowchart TD
  classDef gameThread fill:#3b6ea5,stroke:#1f3b5f,color:#fff
  classDef anyThread  fill:#2f7a4f,stroke:#1c4a30,color:#fff
  classDef gate       fill:#8a6a1f,stroke:#4a3810,color:#fff,stroke-dasharray: 4 2

  CreateVW["FNCreateVirtualWorldTask<br/><i>Step 0 · Capture World</i>"]:::gameThread
  ProcessVW["FNProcessVirtualWorldTask<br/><i>Step 1 · Process Capture</i>"]:::anyThread

  subgraph Pass0["Pass 0"]
    direction TB
    Organ0["FNOrganGraphBuilderTask × N<br/>(one per activated organ component)"]:::anyThread
    ProcPass0["FNProcessPassTask<br/>(collects pass results, propagates collision)"]:::anyThread
    Organ0 --> ProcPass0
  end

  subgraph PassN["Pass 1 … N"]
    direction TB
    OrganN["FNOrganGraphBuilderTask × N"]:::anyThread
    ProcPassN["FNProcessPassTask"]:::anyThread
    OrganN --> ProcPassN
  end

  CreateSpawns["FNCreateSpawnsTask<br/><i>Step 3 · Flatten graphs into spawn context</i>"]:::anyThread
  SpawnProxies["FNSpawnCellProxiesTask<br/><i>Step 4 · Time-sliced proxy spawning</i>"]:::gameThread
  SpawnGate(["SpawnCellProxiesTaskCompleted<br/><i>graph-event gate</i>"]):::gate
  Finalize["FNAssemblyFinalizeTask<br/><i>Step 5 · Finalize &amp; analytics</i>"]:::gameThread

  CreateVW --> ProcessVW
  ProcessVW --> Organ0
  ProcPass0 --> OrganN
  ProcPassN --> CreateSpawns
  CreateSpawns --> SpawnProxies
  SpawnProxies --> SpawnGate
  SpawnGate --> Finalize
  CreateSpawns -.->|also a finalizer prereq| Finalize
```

### Notes

- **Per-pass chaining.** Each pass's organ builders chain on the *previous* pass's `FNProcessPassTask` (not its organ builders) so that pass's collision data is fully propagated into the shared `FNVirtualWorldContext` before any builder reads `NodeCollisionMeshes`.
- **Inactive components are skipped.** `FNOrganGraphBuilderTask` is only created for components whose `SourceComponent->bActivated` is true. A pass with zero activated components still increments the pass counter but adds no tasks.
- **Thread targets** (from each task's `GetDesiredThread()`):
  - <span style={{color:'#3b6ea5',fontWeight:600}}>Game Thread</span>: world capture (`FNCreateVirtualWorldTask`), proxy spawning (`FNSpawnCellProxiesTask`), finalize (`FNAssemblyFinalizeTask`).
  - <span style={{color:'#2f7a4f',fontWeight:600}}>Any Thread</span> (`AnyNormalThreadNormalTask`): world-capture processing (`FNProcessVirtualWorldTask`), organ graph building (`FNOrganGraphBuilderTask`), per-pass collection (`FNProcessPassTask`), and spawn-context creation (`FNCreateSpawnsTask`).
- **`SpawnCellProxiesTaskCompleted`** is a manually-fired `FGraphEvent` the spawn task triggers when its time-sliced work finishes; it is what actually gates `FNAssemblyFinalizeTask`, not the dispatcher task itself.