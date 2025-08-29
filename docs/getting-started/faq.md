---
sidebar_position: 5
sidebar_label: FAQ
description: Some of the more common questions that come to mind are answered.
---

# Frequently Asked Questions

## What’s the deal with all the modules having the same Version/Number?

The UPlugin files for all modules are automatically updated when the `N_VERSION_NUMBER`, `N_VERSION_MAJOR`, `N_VERSION_MINOR`, and `N_VERSION_PATCH` are updated inside of `NCoreMinimal.h`.

:::info[Mix & Match Versions]

Testing is done against the current state of the repository, not bespoke versions of plugins. This doesn't mean you can't assemble a Frankenstein of plugin versions on your own. We just can't be sure that they will function correctly together.

:::

## What does `(User)` indicate when found at the end of preference category?

This indicates that these options are saved locally to the developers machine and are not pushed upon other team members. While default values are setup and spread in the project, the local developer overrides them however they please.

## Why doesn’t NEXUS have &lt;insert feature here&gt;?

Let’s pivot that question — why haven’t you [added that feature](/community/contributing/) to **NEXUS**?