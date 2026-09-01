---
sidebar_label: Ed Mode Rail
sidebar_class_name: type native-class
description: Base class for one category on an editor-mode rail — its button, its visibility, and the group builders its panel content is assembled from.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Ed Mode Rail

<TypeDetails icon="native-class" base="class" type="FNEdModeRail" typeExtra=" + FNRailCommand" headerFile="NexusUIEditor/Public/NEdModeRail.h" />

One **category** on an editor-mode rail: the button that selects it, the rule deciding whether it appears at all, and the panel content shown when it is selected.

It is the generalized half of the [World Assembly editor mode](../../world-assembly/editor-mode/index.mdx)'s toolkit, lifted into `NexusUIEditor` so any NEXUS edit mode can be built the same way. Subclasses supply a command and some content; everything about how a group of buttons is drawn lives here.

## What A Subclass Provides

| Override | Required | Answers |
| :-- | :-- | :-- |
| `GetCategoryCommand` | **Yes** | The command this category's rail button is built from — its icon, label and tooltip. |
| `CreateContent` | No | The category's own content. Null gives a category with none. |
| `GetAvailable` | No | Whether the category appears on the rail at all. Unset always shows it. |
| `ShouldAutoSelect` | No | Whether the mode should *open* on this category rather than the first one it finds. |

```cpp
/**
 * @param InCommandList The toolkit's command list, which every button this rail builds resolves against.
 */
explicit FNEdModeRail(const TSharedRef<FUICommandList>& InCommandList);
```

## Availability Asks About The Level, Not The Moment

`GetAvailable` decides **visibility**, and a hidden button closes the gap under the cursor — so the question it answers has to be a stable one.

It asks *"is this category relevant to the level"*, not *"can the user act right now"*. World Assembly's Cell and Junction rails key off the level containing a cell actor, **not** off one being focused: focus comes and goes with every selection change, and a button hiding on that would vanish constantly and shuffle the buttons below it out from under the pointer mid-click.

Whether the commands inside a category can run is each command's own business — they already grey themselves out.

`ShouldAutoSelect` is only consulted for a category that is **available**, so a mode cannot open on a category whose button is hidden. Where several say yes, rail order settles it.

## Group Builders

Panel content is assembled from these. Each returns one group; a rail's `CreateContent` stacks them.

| Builder | Shape | Reach for it when |
| :-- | :-- | :-- |
| `CreateCommandPalette` | Icon tiles, wrapping across the panel, on a recessed backing. | A handful of commands the user learns by **shape**. |
| `CreateCommandGrid` | Half-width buttons, two to a row, labels beside icons. | Commands whose labels are a **phrase** rather than a name — they read as a list of named operations. |
| `CreateCommandList` | Full-width buttons, one to a row. | A short group whose labels would ellipsize at half a panel, or one that wants reading **down** rather than scanning across. |
| `CreateCheckList` | Labelled checkboxes, one per command. | Commands that read as persistent **settings** rather than actions. |
| `CreateBackedContent` | An arbitrary widget in a group of its own, on a recessed backing. | A section that is no set of commands at all. |
| `CreateGroupSeparator` | A horizontal rule, optionally naming the run that follows. | Ruling off one run of groups from a run of a **different kind**. |

`CreateCommandGrid` and `CreateCommandList` both take an optional `LeadingContent` widget that sits above the buttons **inside the same group** — for the thing the buttons act on. A picker naming a target belongs in the group it decides the target of, not in one of its own.

### The Recessed Backing Means Something

Tile palettes and `CreateBackedContent` are drawn on a recessed well; the labelled-button groups sit straight on the panel.

That is the distinction the backing carries: a well says the content inside it is **not** one of the labelled-button groups — a block of icon tiles, or the Organ rail's operations list.

### Separators

The only break there is, now that no group carries a heading. It earns its place **between runs of groups that are a different kind of thing**, not between every pair of them.

A label rides *on* the rule rather than sitting above it, the way the engine's menus name a section — the rule is centered against the text, so the two read as one line with a name in it. Keep labels short: nothing wraps, and a long one leaves no rule to speak of.

Drop a separator in its own slot between two group slots. It carries the whole of its own spacing, so that slot wants no padding.

## Rail Commands

`CreateCommandGrid` and `CreateCommandList` take `FNRailCommand` rather than a bare command:

```cpp
struct FNRailCommand
{
  /** The command the button runs, and takes its label and tooltip from. */
  TSharedPtr<FUICommandInfo> Command;

  /** Icon drawn instead of the one the command was registered with, or unset to keep that one. */
  TAttribute<FSlateIcon> Icon;
};
```

It converts implicitly from a bare command, so a group wanting nothing special still reads as a braced list of command infos.

:::warning[Bind the icon, do not resolve it]

`Icon` is re-read **every paint** by `SToolBarButtonBlock`. Bind it to something that reports state rather than resolving an icon once at construction. The command's registered icon still stands everywhere else the command appears.

Only the grid and the list take these — the tiles and the check lists draw their icons through widgets that have no override to offer.

:::

## Why Not The Engine's Palette Builder

`CreateCommandPalette` builds [`SNCommandTile`](widgets/command-tile.md) in an `SWrapBox`, not the `FUniformToolBarBuilder` that `FModeToolkit::CreatePaletteWidget` takes.

The builder path is what the Landscape and Foliage palettes use, and it comes with their limit: `SMultiBoxWidget` caps a palette cell at 50 by 43, and `PaletteToolBar`'s label style ellipsizes anything wider. Labels of more than about a word were unreadable, and nothing in the style or the builder could widen the cell or wrap the label.

The tiles keep the style's buttons, label and paddings, so a group still reads as one of the engine's.

`CreateCommandGrid` is the engine's own toolkit palette rendering reproduced so a rail can head and split one — the plugin's `Rail.CommandGrid` style (`SlimPaletteToolBar` with its backing cleared) on `FSlimHorizontalUniformToolBarBuilder`, whose `SUniformWrapPanel` fills its width across the style's two columns. It is a **different widget** from the tile palette's, not a wider setting on it.

## See Also

- [World Assembly → Editor Mode](../../world-assembly/editor-mode/index.mdx) — the mode built on this, and the five rails that subclass it.
- [Command Tile](widgets/command-tile.md) — the tile the palette groups are built from.
