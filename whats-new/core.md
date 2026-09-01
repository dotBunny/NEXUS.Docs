---
description: A highlight reel for the Core plugin and it's additions over time.
---

# Core

## 0.3.5

### Target Point Markers You Can Actually See

[Target Point Components](/docs/core/types/pcg/target-point-component) now have a presence in the level viewport:
scaled axes plus a world-down reference arrow, drawn as a screen-space handle so they stay visible and clickable at any
zoom, and labelled with the component tags `Get Component Points` filters on.

### Mesh Merging Got A Lot Faster

`CombineMesh` was recomputing the centre and bounds of everything merged so far on every single call. One merge, fine. A
loop of them — which is what merging a level's collision is — quadratic. Measured at roughly a hundred million vector
adds and a twelve second editor stall on toggling the collision visualizer. Centre and bounds are now accumulated over
the vertices being appended, in the same pass that appends them.
