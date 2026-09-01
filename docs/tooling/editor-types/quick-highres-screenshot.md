---
sidebar_class_name: type native-class
description: Static class performing a one-keypress high-resolution viewport capture through the engine's own high-res path.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Quick HighRes Screenshot

<TypeDetails icon="native-class" base="class" type="FNQuickHighResScreenshot" typeExtra="" headerFile="NexusToolingEditor/Public/NQuickHighResScreenshot.h" />

Static class implementing [Quick HighRes Screenshot](../enhancements/quick-highres-screenshot.md): one keypress does to a viewport what `HighResShot` does. The chord that reaches it lives on [Tooling Editor Bindings](tooling-editor-bindings.md).

## Public API

### Capture

```cpp
/**
 * Capture the target viewport at the per-user multiplier, sized off that viewport rather than any
 * fixed resolution, and let the engine report the written file.
 * @note Does nothing when a capture is already in flight, or when no viewport can be resolved.
 */
static void Capture();
```

Everything is inside this one call — resolve the viewport, configure the engine's high-res config, fire the capture, and restore the shared state afterwards.

## How It Works

The capture itself is `FViewport::TakeHighResScreenShot` — the same engine path the `HighResShot` console command takes, rendering the scene offscreen at the multiplied size. What comes out is the rendered view with **no editor chrome in it**.

### Resolving The Viewport

| Condition | Viewport |
| :-- | :-- |
| `GEditor->PlayWorld` is set | `UEditorEngine::GetPIEViewport()` |
| Otherwise | The level editor's first active viewport |

`GetPIEViewport` is used rather than the level viewport's own active viewport because a PIE session may be hosted in the level viewport, a floating window, **or** a standalone one. Reading the level viewport only finds the first of the three.

### Sizing

`GScreenshotResolutionX/Y` are deliberately left at **zero**, which is what makes `TakeHighResScreenShot` derive the size from the viewport it is called on, times `ResolutionMultiplier`. This mirrors `FHighResScreenshotConfig::ParseConsoleCommand`, the setup `HighResShot` itself runs through.

Measuring one viewport and setting those globals by hand instead pins every later shot to that size — which is wrong the moment the target is a PIE window rather than the level viewport, and stale values are also what a rejected shot would otherwise leave behind.

### The Multiplier

Read from `UNToolingEditorUserSettings::QuickHighResScreenshotMultiplier` **at capture time**, so an edit takes effect on the very next keypress. Only the property's own `ClampMin`/`ClampMax` bound it: `FHighResScreenshotConfig::MinResolutionMultipler` is `1.0`, but the console command's parser accepts anything above zero and downscaling works, so the dialog's floor is a UI convention rather than a capability limit.

### The Output Path

The **only** thing not left to the engine.

The engine's own naming resolves against `UEngine::GameScreenshotSaveDirectory`, which is only ever assigned on the `UGameEngine` instance while the high-res path reads the CDO — so in the editor that is empty, and an un-overridden `HighResShot` writes relative to the process working directory instead of `Saved/Screenshots`.

A timestamped `FilenameOverride` fixes the location:

```text
<EditorScreenshotSaveDirectory>/NEXUS_HighResScreenshot_<YYYYMMDD>_<HHMMSS>.<ext>
```

The directory is `ULevelEditorMiscSettings::EditorScreenshotSaveDirectory` — the one the editor's own <kbd>F9</kbd> capture writes to — falling back to `FPaths::ScreenShotDir()`. The extension follows `FViewport::GetSceneHDREnabled()`: `.exr` when set, `.png` otherwise.

An override also skips the engine's index-suffix pass, which is why the name carries a timestamp rather than a counter.

:::warning[`FilenameOverride` is shared state]

It is global, and the built-in High Resolution Screenshot dialog and `HighResShot` both read it. Leaving ours in place would have the next capture from either reuse our name.

`Capture` therefore stashes the previous value and restores it from a one-shot `FScreenshotRequest::OnScreenshotRequestProcessed` binding. A shot rejected outright — for exceeding the maximum texture dimension — never gets processed, so that path unwinds the bookkeeping by hand instead.

:::

### Reporting

Deliberately the engine's job. `FViewport::HighResScreenshot` raises its own toast naming the written path with an **Open Folder** hyperlink, so nothing here duplicates it.

The only thing logged is which viewport was picked, at `Verbose` — the part that is otherwise invisible when the answer looks wrong.

## Guards

| Situation | Behaviour |
| :-- | :-- |
| A capture is already in flight (`GIsHighResScreenshot`) | Returns immediately. The engine's own dialog guards the same way. |
| No viewport resolves | Warns and returns. |
| Multiplier at or below zero | Returns silently. |
| The engine rejects the shot | The engine raises its own notification; the bookkeeping is unwound here since nothing will be processed. |

## See Also

- [Quick HighRes Screenshot](../enhancements/quick-highres-screenshot.md) — the workflow.
- [Tooling Editor Bindings](tooling-editor-bindings.md) — where the chord is registered and mapped.
- [User Settings → Quick HighRes Screenshot](../user-settings.md#quick-highres-screenshot) — the two settings.
