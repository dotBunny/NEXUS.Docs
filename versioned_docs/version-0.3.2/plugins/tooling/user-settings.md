---
sidebar_position: 6
description: Per-user editor preferences for NEXUS Tooling — graph navigation, editor performance, leak check, visualizer colors, and multiplayer-test session layout.
---

# User Settings

Per-user editor preferences for Tooling. Unlike the project-shared [Editor Settings](editor-settings.md), these are machine-local and stored in `NexusUserSettings.ini`, so each developer keeps their own values and they never reach source control.

From the `Edit > Editor Preferences` window, find the **Tooling (User)** section.

Most values here **apply the moment you change them** — `UNToolingEditorUserSettings` re-applies to the relevant editor system on edit, rather than waiting for a restart. From C++, read them with `UNToolingEditorUserSettings::Get()`.

## Configuration Options

### Graph Navigation

Ergonomics for Blueprint and material graphs, described in full under [Graph Navigation](enhancements/graph-navigation.md).

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Space To Pan` | `bool` | While holding `Space`, left-click and drag to pan the foreground graph. | `true` |
| `Pan Speed Multiplier` | `float` | Multiplier applied to drag distance when using Space-to-pan. | `1.0` |

Both are published to the shared input processor on change, so a new pan speed is live on the next drag.

### Editor Performance

See [Performance](enhancements/performance.md).

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Initial Editor Maximum FPS` | `float` | Caps the editor's frame rate, keeping GPUs quiet and cool. **`0` uses the engine default** rather than meaning "unlimited". | `60.0` |
| `Always Show Frame Rate & Memory` | `bool` | Keeps the editor's *Show Frame Rate & Memory* option checked even if local settings are wiped. | `true` |

`Always Show Frame Rate & Memory` exists because that toggle is stored in editor-local state that gets reset more often than you would like — a fresh machine, a cleared config, a new engine version. This re-asserts it instead of you noticing it is gone.

### Leak Check

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Duration` | `float` | How long the [Leak Check](debuggers/leak-check.md) runs, in seconds. | `30.0` |

### Visualizers — Distribution

Colors and line quality for the distribution visualizers drawn in the viewport — in practice the [Actor Pool Spawner Component](../actor-pools/types/actor-pool-spawner-component.md)'s radius, sphere, and box gizmos, which are the only consumers today. Defaults shown as sRGB.

Inner and outer are the two ends of a range: a spawner with a radius range draws its minimum in `Inner Color` and its maximum in `Outer Color`, so you can see the band it picks within rather than just its extent.

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Outer Color` | `FColor` | Outer boundary of a distribution visualizer. | `#FF0058` |
| `Inner Color` | `FColor` | Inner boundary of a distribution visualizer. | `#960059` |
| `Line Thickness` | `float` | Thickness of drawn debug lines. | `1.5` |
| `Circle Sides` | `int32` | Number of line segments used to draw a debug circle. Lower it if a dense scene of visualizers costs you frames. | `64` |

### Multiplayer Test

The per-developer half of [Multiplayer Test](enhancements/multiplayer-test.md) — how *your* test session is laid out. Whether the feature exists at all, and how it authenticates, is project-level: see [Editor Settings](editor-settings.md#multiplayer-test).

#### Setup

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Clear Logs Folder` | `bool` | Clear the (not-in-use) log files before running a test. | `false` |

#### Clients

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Count` | `int32` | Number of clients to spawn. | `2` |
| `Window Size` | `FIntPoint` | Size of each created client window. | `(800, 600)` |
| `Disable Sound` | `bool` | Mute audio on spawned clients. | `false` |
| `Generate Network Profile` | `bool` | Capture a per-client network profile, written to `<PROJECT>/Saved/Profiling/<PROJECT>-<TIMESTAMP>.nprof`. | `false` |
| `Parameters` | `FString` | Extra command-line parameters passed to each launched client. | empty |

#### Clients — Network Simulation

These become command-line switches on each launched client, applied **on top of** the real round-trip time rather than replacing it — so simulating 20 ms on an already-slow connection gives you both.

| Setting | Type | Description | Default | Range |
| :-- | :-- | :-- | :-- | :-- |
| `Lag (Minimum)` | `int32` | Minimum simulated **round-trip** lag, in ms. Becomes `-PktLagMin`. | `20` | `0`–`1000` |
| `Lag (Maximum)` | `int32` | Maximum simulated **round-trip** lag, in ms. Becomes `-PktLagMax`. | `60` | `0`–`1000` |
| `Packet Loss` | `int32` | Simulated packet loss, as a percentage. Becomes `-PktLoss`. | `0` | `0`–`100` |
| `Packet Jitter` | `int32` | Simulated packet jitter, in ms. Becomes `-PktJitter`. | `0` | `0`–`1000` |
| `Packet Duplication` | `int32` | Simulated packet duplication, as a percentage. Becomes `-PktDup`. | `0` | `0`–`100` |
| `Receive Out Of Order` | `bool` | Force clients to receive packets out of order. Becomes `-PktOrder=1`. | `false` |

:::note[The lag values are round-trip, and are halved on the way out]

`-PktLagMin` / `-PktLagMax` are **one-way** latency, so the value you type is halved before it is passed along — a `Lag (Minimum)` of `20` launches the client with `-PktLagMin=10`.

That is the right conversion, and it means the number in this panel is the round-trip figure you would actually quote for a connection. It also means a value read back off the client's command line will not match what you entered. The halving floors, so odd values lose the remainder (`21` → `10`).

:::

A value of `0` means **the switch is not passed at all**, leaving the engine at its own default — it is not the same as explicitly simulating zero loss. The one exception is `Lag (Minimum)`: if it is `0` while `Lag (Maximum)` is not, an explicit `-PktLagMin=0` is passed so the range still has a floor.

The defaults are not a clean network: `20`–`60` ms of lag is on out of the box, so a test session behaves like a modest real connection rather than a LAN. Zero both `Lag` values to measure something without it.

#### Server

| Setting | Type | Description | Default |
| :-- | :-- | :-- | :-- |
| `Dedicated Server` | `bool` | Spawn a dedicated server for the test clients. | `true` |
| `Spawn Separate Server` | `bool` | Rarely needed. Launches a separate server even when the net mode would not require one (such as Standalone). If the net mode *does* require a server, one is launched regardless of this setting. | `false` |
| `Generate Network Profile` | `bool` | Capture a server-side network profile. **Hidden in the panel while the client-side option is on** — see below. | `false` |
| `Parameters` | `FString` | Extra command-line parameters passed to the launched server. | empty |

Client and server arguments are built and delivered **separately** — the client set goes to the play session's client launch parameters and the server set to its server launch parameters. So `Parameters` here is the server's own list, not an addition to or override of the client's.

:::warning[A hidden `Generate Network Profile` still applies]

The server profiling checkbox is hidden by an `EditCondition` whenever the client-side option is enabled, but the stored value is **still read** when the arguments are assembled. If you enabled server profiling earlier and then turned on client profiling, the server continues to launch with profiling on even though the field is no longer visible to tell you so.

Turn client profiling off, clear the server checkbox, then turn client profiling back on if you need the server clean.

:::
