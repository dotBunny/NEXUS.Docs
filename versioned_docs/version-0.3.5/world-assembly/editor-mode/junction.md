---
description: Placing and managing the focused cell's junctions — the placement tool, the component commands, and the junction picker.
sidebar_position: 4
---

# Junction Rail

Places and aligns the focused cell's [Junctions](../types/junction-component.md). Shown whenever the level contains a `ANCellActor` — junctions hang off cells, so the category is relevant exactly when there is one to hang them off.

![Junction Rail](/assets/images/docs/world-assembly/editor-mode/rail-junction.webp)

## Tools

### Place

> Add a junction to the focused cell and position it.

Click the surface the junction should open through. The click settles all three things at once: the position (the impact point, raised by half the socket height), the facing (oriented out of the surface normal, kept upright), and the owner — the actor you clicked, falling back to the `ANCellActor` when you click into empty space. The junction is attached to the owner's root keeping its world transform.

This supersedes the old **Add Component** flow, which attached a junction at the identity transform to whatever happened to be selected and left you to position it by hand. That command is still available under [Component](#component) when you want exactly that.

## Component

| Command | Description |
| :-- | :-- |
| **Add** | Adds a `UNCellJunctionComponent` to the current actor, at the identity transform. Needs an actor selected. |
| **Collect All** | Collects every [Junction](../types/junction-component.md) in the level and moves it onto the selected `AActor`, preserving each one's world transform — handy for consolidating scattered junctions under a single owner. |

## Junction Picker

Below the commands, a picker lists every [Junction](../types/junction-component.md) in the current level. Choosing one selects it in the level, and the button reads back whatever is currently selected — including selections made in the viewport or the outliner. It reads **Multiple Selected** for more than one, and **No Junctions** when the level has none.

Entries are named with the full `Actor > Parent > Component` breadcrumb, which is what tells near-identical junctions apart; the button shows just the component's own name.

Entries are drawn with check marks rather than radio buttons, because the selection they report back can hold several junctions at once. Picking one still *replaces* the selection — the mark says what is selected, not what a click will do.

## Editing Junctions

![Junction Anatomy](/assets/images/docs/world-assembly/editor-mode/cell-junction-anatomy.webp)

As junctions represent the connection point between [Cells](../types/cell.md), they are positioned freely and without rotational constraints. They are **not** on a grid by default, though some choose to place them on one to make overlapping junctions easier to auto-match.

Their matching size is represented by the lego-like nubs drawn inside the rectangle. The rendered arrow should always face inward to the cell — [Junctions](../types/junction-component.md) have directionality.

:::info

More detail on the component itself lives on [`UNCellJunctionComponent`](../types/junction-component.md), and on how unmatched junctions get paired and connected in [Junction Connecting](../architecture/tasks.md#junction-connecting).

:::
