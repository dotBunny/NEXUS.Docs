---
sidebar_label: Selection Lock
description: Lock an actor against being selected by clicking it in a level viewport, without hiding it or taking it out of the Outliner.
---

# Selection Lock

Some actors are in the way. A blockout shell you are building inside, a floor plane you keep clicking instead of the prop standing on it, a giant trigger volume wrapping the whole level — they need to stay visible, but you would rather they stopped intercepting every click.

**Selection Lock** does exactly that and nothing more. A locked actor cannot be picked by clicking it in a level viewport; the click passes straight through to whatever sits behind it. The actor stays visible, stays in the Outliner, and stays fully editable once you select it from there.

## Locking An Actor

Two places, same toggle.

The **Selection Lock** column sits beside the visibility gutter at the left of the Outliner. Locked actors show a padlock, and hovering any row reveals a faded one you can click to lock it. The column is on by default, and can be hidden like any other from the header dropdown.

Right-clicking an actor — on its Outliner row, or in the viewport — offers **Lock Selection** under the **NEXUS** section. It is a check item, so it reads back the current state as well as setting it.

Either route applies to the whole selection when more than one actor is selected. A mixed selection locks rather than splitting, so a second click clears the lot.

## What A Lock Does And Does Not Do

A locked actor:

- **Cannot be clicked in a viewport.** The click lands on whatever is behind it, exactly as if the actor were not there.
- **Does not highlight on hover.**
- **Can still be selected from the Outliner**, and behaves normally once selected — the gizmo moves it, the Details panel edits it, delete deletes it. Without this you would have no way back to a locked actor.
- **Is still caught by marquee selection.** Dragging a selection box over a locked actor still selects it.
- **Draws no selection outline** when selected from the Outliner.

Those last three are deliberate consequences of how the lock works: it removes the actor from the viewport's hit-proxy pass, which is the same information the renderer uses to draw selection and hover highlights. Marquee selection is geometry-based and never consults hit proxies, so it is unaffected.

:::note

Selection Lock is unrelated to the **Lock Actor Movement** toggle in the Details panel's transform section. That one prevents an actor from being moved; this one prevents it from being picked. They can be used together.

:::

## Turning It Off

The whole feature is gated on a single project setting at `Edit > Editor Preferences > NEXUS > Tooling > Selection Lock > Enabled`, stored in `DefaultNexusEditor.ini` so it travels with the project. See [Editor Settings](../editor-settings.md#selection-lock).

The setting is read once at editor startup, so changing it requires a restart to take effect.

Turning it off does not unlock anything. The column and the context menu entry go away and no actor has its lock applied, but every recorded lock stays on disk untouched — turn it back on, restart, and they all return.

## Persistence

The lock is stored as editor-only metadata on the actor and saved with the level, so it survives closing and reopening the map and travels with the level through source control. It is stripped when the project is cooked and never appears in a packaged build.

Locking or unlocking an actor dirties its package, which under **World Partition** is the actor's own external package rather than the whole map.

A few things worth knowing:

- **Duplicating a locked actor produces an unlocked one.** The metadata is keyed to the original.
- **The toggle is not undoable.** Package metadata is not part of the transaction system, so <kbd>Ctrl</kbd>+<kbd>Z</kbd> will not restore a lock you just cleared.
- Actors with no primitive components cannot be locked — there is no geometry to click in the first place, so the column leaves those rows blank.
