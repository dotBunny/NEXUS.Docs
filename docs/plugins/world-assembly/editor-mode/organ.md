---
description: Generating and clearing organ proxies, managing their level instances, and watching assembly operations run.
sidebar_position: 5
---

# Organ Rail

Drives editor-time assembly for the level's [Organs](../types/organ-volume.md). Shown whenever a `UNOrganComponent` is present in the current world; the [World](world.md#create) rail's **Add Organ Volume** is what puts one there.

![Organ Rail](/assets/images/docs/plugins/world-assembly/editor-mode/rail-organ.webp)

## Phase Detection

When an [Organ](../types/organ-volume.md) is selected, a quick process runs to determine its assembly order of operation, determining parallel actions and phases. The labels above each volume indicate the `<Phase>:<Index>_<Name>`.

![Phase Labels](/assets/images/docs/plugins/world-assembly/editor-mode/organ-phase-labels.webp)

The ordering is determined by first deterministically sorting the [Organs](../types/organ-volume.md) by their internal `FGuid`. Then detecting which volumes fully encompass and intersect one another, and finally appending independent phases/passes for `Unbound` volumes (as they could have world-wide impact).

## World

The first group acts on every organ in the world at once, so it needs nothing selected.

| Command | Chord | Description |
| :-- | :-- | :-- |
| **Generate All Proxies** | `CTRL+SHIFT+HOME` | Runs an editor-time assembly operation for all organs in the world, placing transient `ANCellProxy` actors representing the generated cell graph. |
| **Clear All Proxies** | | Removes all generated `ANCellProxy` actors. This also clears any `ANCellLevelInstance` produced by a load operation. |
| **Load All Level Instances** | `CTRL+SHIFT+END` | Creates and loads all level instances derived from the proxies, spawning associated `ANCellLevelInstance`s and applying the `INCellInitialized` interface callback. |
| **Unload All Level Instances** | | Unloads all created `ANCellLevelInstance`s, leaving their base `AActor` in place. |

![Generate Proxies](/assets/images/docs/plugins/world-assembly/editor-mode/organ-generate-proxies.webp)

Added elements are tracked so that repeated generation removes the last set. This is useful for seeing how World Assembly is going to behave across rapid iterations.

![Load Instances](/assets/images/docs/plugins/world-assembly/editor-mode/organ-load-instances.webp)

:::info

Both chords are registered on the edit mode's own command list, so they fire **only while the mode is open**. They are no longer part of the level editor's global actions.

:::

## Organ Picker

The second group is headed by a picker listing every [Organ](../types/organ-volume.md) in the current level — it names what the buttons under it act on, which is why it sits inside that group rather than above the whole category.

Choosing one selects it, and the button reads back the current selection — including selections made in the viewport or outliner. It reads **Multiple Selected** for more than one, and **No Organs** when the level has none.

An organ can be reached two ways — the picker selects the `UNOrganComponent`, while clicking in the viewport or outliner selects the owning `ANOrganVolume` — so the button consults both selections and reports the organ either way.

## Selected Organ

Acts on the organ or organs currently selected.

| Command | Description |
| :-- | :-- |
| **Generate Proxies** | Dispatches an assembly operation via the `UNWorldAssemblyEditorSubsystem` to generate the selected organ's output `ANCellProxy` actors. |
| **Clear Proxies** | Removes the generated `ANCellProxy` actors produced by that organ's operations. |
| **Load Level Instances** | Creates and/or loads the level instances from the selected proxies. |
| **Unload Level Instances** | Unloads the level instances from the selected proxies. |

The three that act on proxies need generated proxies to be selected, not just an organ — so they stay unavailable until a **Generate** has produced some.

## Operations

Live progress for every World Assembly operation the registry currently knows about — the Slate counterpart to the [Developer Overlay](../developer-overlay.md). One block per operation shows its name, task counts, combined progress and status message, with a bar per open status channel beneath.

The mode's own preview operation is filtered out; it stays registered for as long as the mode is open and would otherwise sit here as a permanently idle block.

### Last Run

When nothing is running, the section reports what the **last finished run** produced: its result title, a detailed message carrying the cell count and duration, and the path of the report it wrote, if any. A cancelled run carries its title and nothing else.

The summary is cleared when a new map is loaded, so it never describes a world you are no longer in.
