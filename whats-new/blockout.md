---
description: A highlight reel for the Blockout plugin and its additions over time.
---

# Blockout

## 0.4.0

### Walls, Parapets, Barriers And Stairs

Blocking out a building used to mean scaling cubes until they looked like walls. The
[mesh library](/docs/dev/blockout/meshes) now has almost a hundred architectural pieces:

- **Walls**, 3 m tall: straight, curved, and with doors, windows and openings cut in.
- **Parapets** for ledges and rooftops, with pillars.
- **Barriers** with corners and curves.
- A flight of **stairs**.

They come in two thicknesses, and every size is in the name (`SM_NWall_Curve90_R400_T100_H300`), so you can pick the
right one without opening it. Everything has **Nanite** enabled.

### A Few More Materials

- `MI_NGrid_Brown` and `MI_NGrid_BrownDark`, for ground that shouldn't read as grey.
- `MI_NGrid_FinishLine`: a bold checkerboard for a start, a goal or a finish.
- `MI_NDebug_White_Emissive`, and emissive versions of the debug text materials, for labels that need to read in the
  dark.

See [Grid](/docs/dev/blockout/material-library/grid) and [Debug](/docs/dev/blockout/material-library/debug).
