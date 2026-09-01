---
sidebar_position: 1
description: The first step in being awesome is using the **NEXUS** Framework. Let's get you moving in the right direction.
---

# Getting Started

## Installation

### Acquiring The Framework

There are numerous ways to include the framework into your Unreal project; ultimately, you control where you place your plugins. How and where you acquire **NEXUS** really is entirely dependent on you.

#### GitHub

The most straightforward approach to getting **NEXUS** is to check it out into your plugins folder. You can do this by running the commands below (from within your plugins folder):

````bash
git clone https://github.com/dotBunny/NEXUS.git
git checkout -b release origin/release
````

:::note
The second part checks out the `release` branch — a more stable branch to get started with!
:::

#### Fab

While there are aspirations of distributing the framework via [Fab](https://www.fab.com/), a significant amount of work is necessary before it will be ready for such a high-profile distribution. It is on the roadmap for when we hit **v0.5.0**.

### Placement

The framework has been tested to work when placed inside of a Project's `Plugins` folder, as well as referenced via External Plugins references.

:::tip[Rocket Build Support]

One of the design pillars for this framework is to ensure that it is functionally equivalent for **both** the rocket (downloaded from Epic Games Launcher) and source builds of the Unreal Engine/Editor. This adds some complexity to the development of the framework, in exchange for opening its use up to a significantly larger number of developers.

:::

### Upgrading

While we do our best to minimize the impact of API changes, there are times when an API may change in definition between versions.  We will do our best to call out those changes in the [CHANGELOG](/whats-new/changelog/), as well as provide a set of [Core Redirects](https://dev.epicgames.com/documentation/en-us/unreal-engine/core-redirects-in-unreal-engine) that can be implemented to resolve any content remapping _if possible_.


## Configuration

### Plugins À La Carte

By going to the `Edit > Plugins` you can configure what parts of the **NEXUS** Framework are loaded.

![Plugins Window](/assets/images/guides/getting-started/configuration-plugins-window.webp)

#### NEXUS

A full list of the available plugins in the **NEXUS** Framework, with only [NEXUS: Core](/docs/core/) being enabled by default. This pattern enables users to selectively utilize only what they need for their project, minimizing any additional overhead that plugins may cause.

A good starting point is to enable [NEXUS: Tooling](/docs/tooling/) and [NEXUS: UI](/docs/ui/), and from there anything that your game may want to take advantage of.

:::tip

Don't forget to update any build targets with references to any plugins used.

:::

#### NEXUS Samples

For many of the **NEXUS** Framework plugins, there is a counterpart plugin that houses sample content. They’re broken out into individuals to allow for fine-grain control of inclusion into your project. Additionally, there is a [TestProject](#test-project) at the root of the repository, which serves as a showcase project for all the plugins and hosts all our functional tests.

### Project Settings

Some of the plugins have persistent configuration values used at runtime; these are found in the **NEXUS** section of the **Project Settings**.

![Project Settings Window](/assets/images/guides/getting-started/configuration-project-settings.webp)

### Editor Preferences

Depending on the plugin, corresponding entries will appear in the **NEXUS** section of the **Editor Preferences**.

![Editor Preferences Window](/assets/images/guides/getting-started/configuration-editor-preferences.webp)

:::info

Any section ending with `(User)` denotes that all settings in that category are saved on the local user's machine, and are not shared amongst other developers.

:::

## Test Project

Included with the framework is a project that serves two purposes.

Primarily to demonstrate some of the functionality provided by the framework and its plugins in an easy-to-consume manner. Content is on display in dedicated `DEMO_` prefixed levels for each respective plugin, with example Blueprint-based content to view as well.

The secondary part is where the `DEMO_` prefixed levels are used as sub-levels to the `TEST_` prefixed levels that then run functional tests on the content displays.

![Test Project](/assets/images/guides/getting-started/test-project.webp)

### Finding

The project is right at the root of the repository, under the `TestProject` folder. There is a `NEXUS.uproject` that can be quickly opened using a rocket-build there.

### Controls

The samples project contains some custom input to assist with taking screenshots for this documentation.

|Key|Description|
|:--|---|
|`Tab`, `}`| Select next `NSamplesDisplayActor`'s camera. |
| `{` | Select previous `NSamplesDisplayActor`'s camera. |
| `Backspace` | Toggle the HUD's visibility. |
| `\` | Return camera view to pawn. |
| `F12` | Take high-resolution screenshot, saving to the default `<ProjectFolder>\Saved\Screenshots`. |
| `F10` | Start automatic screenshot run; this is how screenshots are often generated for this documentation. |
| `=` | Increase screenshot resolution multiplier. |
| `-` | Decrease screenshot resolution multiplier. |

## Updates

A simple system to notify you when updates are available to the **NEXUS** Framework.

### Settings

Customizing the behavior and frequency of the update check can be done in the Editor Preferences under  `NEXUS > Core > Updates`.

![Update Notifications](/assets/images/guides/getting-started/updates.webp)

| Setting | Description | Default |
| --- | :-- | :-- |
| `Check For Updates` | Should update checks be made?  | `true` |
| `Frequency (Days)` | After how many days should an update check be made. | `7` |
| `Channel` | What channel to monitor for updates: `Main`, `Release` or a `Custom` one. | `Release` |
| `Custom Query URI` | [`Channel==Custom`] A fully qualified URI to the `NCoreMinimal.h` file located in a custom repository to be checked as the source of updates. | `<empty>` |
| `Custom Update URI` |  [`Channel==Custom`] A fully qualified URI to open when an update is detected and requested. | `<empty>` |
| `Ignore Version Number <=` | A project settable version number that is compared against `N_VERSION_NUMBER` to determine if an update should be ignored. Allowing developers to set up ignores for the notification project-wide based on customized versions. | `N_VERSION_NUMBER` |


## Frequently Asked Questions

### Why another framework? Seriously!

As development began on the original procedural generation side of things (now called World Assembly) it became abundantly clear that there would be a non-trivial amount of supporting pieces of tech necessary for it to achieve its development goals. The decision to make them bespoke into a series of plugins inside the framework came out of wanting to get small pieces of tech in the hands of other developers faster to battle-test that functionality whilst the larger overall goal was continued to be chipped away at.

The framework does not try to replace provided Unreal Engine functionality when present, only augment and improve on.

### What’s the deal with all the plugins having the same Version/Number?

The `UPlugin` definitions for all plugins are automatically updated when the `N_VERSION_NUMBER`, `N_VERSION_MAJOR`, `N_VERSION_MINOR`, and `N_VERSION_PATCH` are updated inside of `NCoreMinimal.h`.

:::info[Mix & Match Versions]

Testing is done against the current state of the repository, not bespoke versions of plugins. This doesn't mean you can't assemble a Frankenstein of plugin versions on your own. We just can't be sure that they will function correctly together.

:::

### What does `(User)` indicate when found at the end of a preference category?

This indicates that these options are saved locally to the developer's machine and are not pushed upon other team members. While default values are set up and spread in the project, the local developer overrides them however they please.

### What is the deal with the Blueprint functions whose DisplayName ends with `?`

These are Blueprint functions that return a `bool` value, but instead of treating it as a traditional return value, the Blueprint node is modified to have two output pins (`true`/`false`). These are often direct clones of an existing function, but with their return context altered.

### Why doesn’t NEXUS have &lt;insert feature here&gt;?

Let’s pivot that question — why haven’t you [added that feature](/community/contributing/) to **NEXUS**?

### Is the documentation complete and fully discoverable?

**No.** We wish it were, but without the skills of a dedicated technical writing team, we are going to drop the ball. We aim to cover general topics, but developers will need to take some responsibility for discovering additional functionality throughout the framework.

### Types vs Editor Types vs Developer Types

We will often refer to **Types**, instead of using the definitive **Runtime Types**. Whereas, we clearly indicate **Editor Types** to demonstrate something as only available in the Unreal Editor. Callouts for **Developer Types** indicate that they are restricted to the development environment (Editor/Development builds).

