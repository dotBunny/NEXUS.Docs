---
description: A mechanism for touchpad navigation of blueprint graphs with ease.
---

# Graph Navigation

A fascinating problem emerged when we started using laptops with the **Unreal Editor**, a distinct inability to move around graphs with the touchpad easily. This problem manifests itself in many different ways, and not all touchpads exhibit the behaviour. However, for those of you suffering from this shortcoming, there is a solution.

Once `Space To Pan` is enabled, holding down the `Spacebar` and pressing and moving your finger (`Left Mouse Button` + `Drag`) will pan the current top level graph.

:::info

Not all graphs are created equal; this currently **only** works with Blueprint-based graphs

:::

## Settings

To enable, and customize this feature head on over to the developer's Editor Preferences under  `NEXUS > Core (User) > Graph Navigation`.

![Graph Navigation: Settings](graph-navigation-settings.webp)

|Setting|Description|Default|
|:--|:--|:--|
| Space To Pan| Enable or disable the feature. | `true` |
| Pan Speed Multiplier | This is a multiplier that is applied against the movement calculation when panning the graph. Working with the delta and not an actual movement amount creates a somewhat accelerated feeling effect. You may want to lessen this if you find the movement doesn't correlate to your input. | `1.0f` |

:::info

We've heard that some laptops' touchpads work to navigate around graphs, but this seems to be specifically for macOS users; our Razer Blade laptops are not so lucky, for example.

:::