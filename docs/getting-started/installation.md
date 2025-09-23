---
sidebar_position: 1
description: It has got to go somewhere, and that somewhere is entirely up to you!
---

# Installation

## Acquiring The Framework

There are numerous ways to include the framework into your Unreal project; ultimately, you control where you place your plugins. How and where you acquire **NEXUS** really is entirely dependent on you.

### GitHub
The most straightforward approach to getting **NEXUS** is to check it out into your plugins folder. You can do this by running the command below (from within your plugins folder):

````bash
git clone https://github.com/dotBunny/NEXUS.git
````

### Fab

While there are aspirations of distributing the framework via [Fab](https://www.fab.com/), a significant amount of work is necessary before it will be ready for such a high-profile distribution. It is on the roadmap for when we hit **v0.5.0**.

## Placement

The framework has been tested to work when placed inside of a Project's `Plugins` folder, as well as referenced via External Plugins references.


:::tip[Rocket Build Support]

One of the design pillars for this framework is to ensure that it is functionally equivalent for **both** the rocket (downloaded from Epic Games Launcher) and source builds of the Unreal Engine/Editor. Adding some complexity to the development of the framework, in exchange for opening its use up to a significantly larger number of developers.

:::

## Upgrading

While we do our best to minimize the impact of API changes, there are times when an API may change in definition between versions.  We will do our best to call out those changes in the [CHANGELOG](/community/changelog/), as well as provide a set of [Core Redirects](https://dev.epicgames.com/documentation/en-us/unreal-engine/core-redirects-in-unreal-engine) that can be implemented to resolve any content remapping.