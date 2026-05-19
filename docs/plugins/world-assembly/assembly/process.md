---
description: A procedural generation system focused on creating dynamic gameplay-focused spaces.
sidebar_label: Process Flow
title: Process Flow
---

## Task Graph

`FNWorldAssemblyTaskGraph` builds — but does not dispatch — the following dependency chain. `UnlockTasks()` then releases every node in construction order.

```mermaid
flowchart TD
  classDef gameThread fill:#3b6ea5,stroke:#1f3b5f,color:#fff
  classDef anyThread  fill:#2f7a4f,stroke:#1c4a30,color:#fff
  classDef bgThread   fill:#7a4f9a,stroke:#3f2854,color:#fff
  classDef gate       fill:#8a6a1f,stroke:#4a3810,color:#fff,stroke-dasharray: 4 2

  CreateVW["FNCreateVirtualWorldTask<br/><i>Step 0 · Capture World</i>"]:::gameThread
  ProcessVW["FNProcessVirtualWorldTask<br/><i>Step 1 · Process Capture</i>"]:::anyThread

  subgraph Pass0["Pass 0"]
    direction TB
    Organ0["FNOrganGraphBuilderTask × N<br/>(one per activated organ component)"]:::anyThread
    ProcPass0["FNProcessPassTask<br/>(collects pass results, propagates collision)"]:::bgThread
    Organ0 --> ProcPass0
  end

  subgraph PassN["Pass 1 … N"]
    direction TB
    OrganN["FNOrganGraphBuilderTask × N"]:::anyThread
    ProcPassN["FNProcessPassTask"]:::bgThread
    OrganN --> ProcPassN
  end

  CreateSpawns["FNCreateSpawnsTask<br/><i>Step 3 · Flatten graphs into spawn context</i>"]:::anyThread
  SpawnProxies["FNSpawnCellProxiesTask<br/><i>Step 4 · Time-sliced proxy spawning</i>"]:::gameThread
  SpawnGate(["SpawnCellProxiesTaskCompleted<br/><i>graph-event gate</i>"]):::gate
  Finalize["FNWorldAssemblyFinalizeTask<br/><i>Step 5 · Finalize &amp; analytics</i>"]:::gameThread

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
- **Thread targets.**
  - <span style={{color:'#3b6ea5',fontWeight:600}}>Game Thread</span>: world capture, proxy spawning, finalize.
  - <span style={{color:'#2f7a4f',fontWeight:600}}>Any Normal Thread</span>: world processing, organ graph building, spawn-context creation.
  - <span style={{color:'#7a4f9a',fontWeight:600}}>Any Background Thread</span>: per-pass collection (`FNProcessPassTask`).
- **`SpawnCellProxiesTaskCompleted`** is a manually-fired `FGraphEvent` the spawn task triggers when its time-sliced work finishes; it is what actually gates `FNWorldAssemblyFinalizeTask`, not the dispatcher task itself.