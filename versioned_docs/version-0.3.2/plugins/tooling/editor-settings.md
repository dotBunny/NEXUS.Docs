---
sidebar_position: 6
description: Project-shared editor settings for NEXUS Tooling — icon overrides, project levels, validator severities, and the multiplayer-test toggles.
---

# Editor Settings

Project-shared editor settings for Tooling. These are saved to the project's editor config (`DefaultNexusEditor.ini`) and are meant to be **checked into source control**, so every contributor gets the same validator severities and the same tooling setup.

From the `Edit > Editor Preferences` window, find the **Tooling** section. The per-user values live in the separate **Tooling (User)** section — see [User Settings](user-settings.md).

Backed by `UNToolingEditorSettings`; from C++, read them with `UNToolingEditorSettings::Get()`.

:::info[Editor Preferences, but not per-user]

These are in `Edit > Editor Preferences` rather than `Project Settings`, because they configure the *editor*. They are still **project-wide** — changing one changes it for everyone who pulls the config. If you want a value that stays on your machine, it belongs in [User Settings](user-settings.md) instead.

:::

## Configuration Options

### Editor Icon

Overrides for the editor's branding, so a project can put its own mark on the window it is developed in. Both are consumed by the [Editor Window Icon](enhancements/editor-window-icon.md) enhancement.

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `AppIcon Path` | `FString` | Replaces the Starship AppIcon style. SVG or image format. | empty |
| `Window Icon Path` | `FString` | Replaces the OS-level editor window icon. Give the path **without any extension** — the platform-appropriate one is resolved for you, so every resource must share a base name and folder. | empty |

:::warning

Both require an **editor restart** to take effect. Neither applies live on edit.

:::

### Project

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Levels` | `TArray<FSoftObjectPath>` | The set of project levels referenced by NEXUS tooling — most visibly the quick-open bookmarks described in [Project Levels](enhancements/project-levels.md). Restricted to `UWorld` assets. | empty |

### Validators — Severity

Every [validator](validators/index.mdx) reads its severity from here, so a studio can dial validation up or down without touching code. Each takes an `ENValidatorSeverity`:

| Severity | Data-validation verdict | Effect |
| :-- | :-- | :-- |
| `Disable` | `NotValidated` | Validator off — reports nothing. |
| `Warning` | `Invalid` | Adds a warning **and fails the asset**. |
| `Warning (Validate)` | `Valid` | Adds a warning but lets the asset pass. |
| `Error` | `Invalid` | Adds an error and fails the asset. |
| `Message` | `Valid` | Informational only. |

:::note[`Warning` fails the asset; `Warning (Validate)` does not]

This is the distinction worth internalising. Plain `Warning` marks the asset **Invalid**, so it will block a validation gate in CI exactly like `Error` does — the only difference is the message category. `Warning (Validate)` is the setting you want for "tell me, but don't stop me".

:::

| Setting | Description | Default |
| :-- | :-- | :-- |
| `Blueprint: Empty Tick` | Severity reported when a Blueprint contains an empty Tick event. See [Blueprint Validator](validators/blueprint-validator.md). | `Error` |
| `Blueprint: Multi-Pin Pure Node` | Severity reported when a Blueprint pure node has multiple connected output pins, causing it to be re-evaluated per pin. See [Blueprint Validator](validators/blueprint-validator.md). | `Warning` |
| `Engine: Content Change` | Severity reported when engine content has been modified. See [Engine Content Validator](validators/engine-content-validator.md). | `Warning` |
| `Level: Blueprint Logic` | Severity reported when a level blueprint contains non-ghost logic nodes. See [Level Blueprint Validator](validators/level-blueprint-validator.md). | `Disable` |

The defaults are deliberately uneven: empty Tick is an `Error` because the fix is trivial and the cost is real, multi-pin pure nodes are a `Warning` because fixing them takes thought, and level-blueprint logic ships `Disable`d because plenty of projects legitimately use it.

### Validators — Ignored

Exclusions apply to **all** validators at once, not per-validator.

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Ignored Assets` | `TArray<FSoftObjectPath>` | Specific assets excluded from validation. Matched exactly. | empty |
| `Ignored Prefixes` | `TArray<FString>` | Path prefixes excluded from validation. Matched as a **starts-with**, so a folder path excludes everything beneath it. | empty |

### Multiplayer Test

The project-level half of [Multiplayer Test](enhancements/multiplayer-test.md). Per-developer session layout — client count, window size, network simulation — is in [User Settings](user-settings.md#multiplayer-test).

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Enabled` | `bool` | Whether the Multiplayer Test toolbar section is installed at all. | `true` |
| `Use Online Subsystem` | `bool` | Whether multiplayer-test authentication goes through the Online Subsystem. | `false` |

:::tip[`Enabled` applies immediately]

Unlike the icon paths, toggling `Enabled` installs or removes the toolbar section **live** — no restart. The class watches for that specific property changing and adds or removes the section to match.

:::
