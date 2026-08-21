---
sidebar_class_name: type native-class
description: The shared TCommands binding context for NexusToolingEditor's keybound commands.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Tooling Editor Bindings

<TypeDetails icon="native-class" base="TCommands<FNToolingEditorBindings>" type="FNToolingEditorBindings" typeExtra="" headerFile="NexusToolingEditor/Public/NToolingEditorBindings.h" />

The keyboard-bindable commands published by `NexusToolingEditor`. It appears in `Editor Preferences > Keyboard Shortcuts` as **NEXUS: Tooling**.

One shared binding context rather than one per feature, so every keybound Tooling command groups under a single heading instead of each adding its own category.

:::warning[Not to be confused with `FNToolingEditorCommands`]

Despite the name, `FNToolingEditorCommands` is **not** a `TCommands` at all — it is the ToolMenus menu builder, and it carries no chords. This class is the one with keybindings in it.

:::

## Commands

| Command | Chord | Runs |
| :-- | :-- | :-- |
| `Quick High Resolution Screenshot` | <kbd>Alt</kbd>+<kbd>F9</kbd> | [`FNQuickHighResScreenshot::Capture`](quick-highres-screenshot.md) |

<kbd>Alt</kbd>+<kbd>F9</kbd> is a deliberately *modified* <kbd>F9</kbd>: bare <kbd>F9</kbd> is the engine's own 1× viewport Screen Capture, so the same key asking for more pixels reads correctly. The chord itself is unclaimed on every platform, though the rest of that column is spoken for — <kbd>Ctrl</kbd>+<kbd>F9</kbd> by the Content Browser, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F9</kbd> by Delete All Breakpoints, and bare <kbd>F9</kbd> additionally by Toggle Breakpoint in graph editors.

## Public API

### Map Actions

```cpp
/**
 * Bind the registered commands onto the level editor's global command list, so their chords fire
 * regardless of which panel holds focus within the level editor window.
 */
static void MapActions();
```

### Unmap Actions

```cpp
/** Drop those bindings again, leaving no action pointing at this module once it unloads. */
static void UnmapActions();
```

Both lists outlive the module and the actions point at functions inside it, so unmapping on shutdown is not optional.

## Two Command Lists

A chord that works in the editor does **not** automatically work in play. `MapActions` maps onto both lists, which is what it takes:

| List | Covers | Why |
| :-- | :-- | :-- |
| `FLevelEditorModule::GetGlobalLevelEditorActions()` | The editor | The chord fires with focus anywhere in the level editor window, rather than only in the viewport. |
| `FPlayWorldCommands::GlobalPlayWorldActions` | PIE | The level editor list stops being consulted the moment PIE takes focus. |

Once PIE has focus, key events go to the game viewport and are forwarded to `UEditorEngine::ProcessDebuggerCommands`, which asks **only** `GlobalPlayWorldActions` — the list <kbd>F8</kbd>-eject and the pause/step chords live on. Separate-window PIE reaches that same list through `SGlobalPlayWorldActions::OnKeyDown`.

:::note[The module is loaded, not fetched]

`MapActions` uses `FModuleManager::LoadModuleChecked` for the level editor. The global command list is built in `FLevelEditorModule::StartupModule`, and post-engine-init is early enough that the module may not have been asked for yet.

:::

## Registration Is Gated

The whole context is registered only when [`Tooling (User) > Quick HighRes Screenshot > Enabled`](../user-settings.md#quick-highres-screenshot) is on. That setting is marked `ConfigRestartRequired` because registration happens once at post-engine-init.

Leaving it unregistered is the point: an unregistered command does not appear in `Editor Preferences > Keyboard Shortcuts` at all, which leaves <kbd>Alt</kbd>+<kbd>F9</kbd> genuinely free for something else rather than merely inert.

## See Also

- [Quick HighRes Screenshot](quick-highres-screenshot.md) — the only command on this context today.
