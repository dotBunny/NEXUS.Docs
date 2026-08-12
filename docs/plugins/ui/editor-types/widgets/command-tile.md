---
sidebar_label: Command Tile
sidebar_class_name: type native-class
description: A palette tile drawing one FUICommandInfo as an icon above a wrapping, centered label — the toolbar button the engine's palette path cannot produce.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Command Tile

<TypeDetails icon="native-class" base="SCompoundWidget" type="SNCommandTile" typeExtra="" headerFile="NexusUIEditor/Public/Widgets/SNCommandTile.h" />

One command drawn as a palette tile: its icon above a label that wraps and centers inside a fixed tile width.

![The Collision Visualizer command drawn as a tile, its two-word label wrapped onto two centered lines beneath the icon](/assets/images/docs/plugins/ui/editor-types/widgets/command-tile.webp)

Above is the [World Assembly edit mode's](../../../world-assembly/editor-mode/world.md#visualizers) visualizer group — a single tile in an `SWrapBox`, with `Collision Visualizer` broken across the two label lines the tile reserves by default.

It exists because the engine's palette button cannot show a label of more than about a word, which makes any editor palette whose commands are named as phrases unreadable. NEXUS' own palettes — the [World Assembly editor mode's](../../../world-assembly/editor-mode/index.mdx) tile groups among them — are built from these instead.

## Why Not a Toolbar Button

The limit is structural rather than a style that needed setting.

- `SToolBarButtonBlock` builds its label as a plain `STextBlock` with **no wrapping**.
- `SMultiBoxWidget` then hands the block a cell it **caps at 50 by 43**, and `PaletteToolBar`'s `Ellipsis` overflow policy eats whatever does not fit.
- Nothing in `FToolBarStyle` turns wrapping on for that path.
- The content cannot be replaced from a builder either: `FButtonArgs` carries no custom widget, and `FToolBarButtonBlock::SetCustomWidget` is only reachable through `UToolMenus`.

So the drawing is reimplemented — and **only** the drawing.

## Only the Drawing Is Ours

Execution, enablement, check state and visibility all resolve through the `FUICommandList` the tile is given, so a command behaves here exactly as it does in a toolbar or a menu:

| Aspect | Resolved through |
| :-- | :-- |
| Click | `FUICommandList::ExecuteAction` |
| Enablement | `FUICommandList::CanExecuteAction` |
| Check state | `FUICommandList::GetCheckState` |
| Visibility | `FUICommandList::GetVisibility` |
| Tooltip | The command's description, with its chord appended when it has one |

Visibility is set on the **tile**, not on the button inside it, so a command whose `FIsActionButtonVisible` predicate hides it gives its place in the group back to the tiles after it.

The widget also makes the same split `SToolBarButtonBlock` makes: a plain `Button` action is drawn as an `SButton`, and anything with a state to report — toggles, radio buttons, checks — as an `SCheckBox`, because a check box is what can draw itself held down. For a toggle, the reported check state is discarded: the command's own `Execute` already flips whatever that state reflects, so driving the toggle from it would apply the change twice.

## Arguments

| Argument | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Command` | `TSharedPtr<const FUICommandInfo>` | The command the tile draws, and acts on when clicked. | *(none)* |
| `CommandList` | `TSharedPtr<const FUICommandList>` | The list the command's action, enablement, check state and visibility are resolved against. | *(none)* |
| `Style` | `FToolBarStyle` | Toolbar style the tile borrows its button, label and paddings from, so it matches the toolbars around it. | `PaletteToolBar` |
| `TileWidth` | `float` | Width the tile takes. A hard bound — it is what the label wraps against, and every tile in a group has to agree on it for the group to read as a grid. | `64.0f` |
| `ReservedLabelLines` | `int32` | Lines of label height the tile keeps room for, so one wrapped label does not leave itself standing taller than the tiles beside it. Room only: a label needing another line still gets it, and takes its tile's height with it. | `2` |

A tile constructed without a valid `Command` **or** a valid `CommandList` builds nothing at all.

## Laying Out a Group

Tiles are **sized, not uniform** — they do not negotiate a common size with each other. A group of them therefore wants a panel that lays out fixed-size children; an `SWrapBox` with `UseAllottedSize` is what the World Assembly edit mode's rail puts them in, and is the layout the defaults above are tuned for.

The reserved label height is *measured* from the style's font rather than declared, so a tile is only ever as tall as its icon, its paddings and the lines it is keeping room for. The reservation sits on the label alone — putting it on the tile would mean knowing what the icon and the two paddings above come to, and being wrong about any of them shows up as dead space.

:::note[Why the Label Slot Fills Rather Than Centers]

`AutoWrapText` breaks against the width the text block is *given*. A centered slot gives it only the width it asked for, which for unwrapped text is the whole label on one line — so it never wraps.

Filling hands it the tile's width to wrap into, and `Justification` is then what centers the resulting lines within it.

:::

## Usage

```cpp
SNew(SWrapBox)
.UseAllottedSize(true)

+ SWrapBox::Slot()
[
    SNew(SNCommandTile)
    .Command(Commands.BeginCellBoundsTool)
    .CommandList(ToolkitCommandList)
]
```
