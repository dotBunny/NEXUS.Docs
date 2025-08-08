---
sidebar_position: 1
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