---
sidebar_position: 5
sidebar_label: FAQ
description: Some of the more common questions that come to mind are answered.
---

# Frequently Asked Questions

## Why another framework? Seriously!

As development began on the original procedural generation side of things (now called World Assembly) it became abundantly clear that there would be a non-trivial amount of supporting pieces of tech necessary for it to achieve its development goals. The decision to make them bespoke into a series of plugins inside the framework came out of wanting to get small pieces of tech in the hands of other developers faster to battle-test that functionality whilst the larger overall goal was continued to be chipped away at.

The framework does not try to replace provided Unreal Engine functionality when present, only augment and improve on. 

## What’s the deal with all the plugins having the same Version/Number?

The `UPlugin` definitions for all plugins are automatically updated when the `N_VERSION_NUMBER`, `N_VERSION_MAJOR`, `N_VERSION_MINOR`, and `N_VERSION_PATCH` are updated inside of `NCoreMinimal.h`.

:::info[Mix & Match Versions]

Testing is done against the current state of the repository, not bespoke versions of plugins. This doesn't mean you can't assemble a Frankenstein of plugin versions on your own. We just can't be sure that they will function correctly together.

:::

## What does `(User)` indicate when found at the end of a preference category?

This indicates that these options are saved locally to the developer's machine and are not pushed upon other team members. While default values are set up and spread in the project, the local developer overrides them however they please.

## What is the deal with the Blueprint functions whose DisplayName ends with `?`

These are Blueprint functions that return a `bool` value, but instead of treating it as a traditional return value, the Blueprint node is modified to have two output pins (`true`/`false`). These are often direct clones of an existing function, but with their return context altered.

## Why doesn’t NEXUS have &lt;insert feature here&gt;?

Let’s pivot that question — why haven’t you [added that feature](/community/contributing/) to **NEXUS**?

## Is the documentation complete and fully discoverable?

**No.** We wish it were, but without the skills of a dedicated technical writing team, we are going to drop the ball. We aim to cover general topics, but developers will need to take some responsibility for discovering additional functionality throughout the framework.

## Types vs Editor Types vs Developer Types

We will often refer to **Types**, instead of using the definitive **Runtime Types**. Whereas, we clearly indicate **Editor Types** to demonstrate something as only available in the Unreal Editor. Callouts for **Developer Types** indicate that they are restricted to the development environment (Editor/Development builds).