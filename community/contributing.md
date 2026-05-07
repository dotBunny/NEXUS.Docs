---
title: Contributing
description: We feel the love already.
hide_table_of_contents: false
sidebar_position: 2
---

# Contributing

Thank you for your interest in contributing to the **NEXUS** Framework! ♥️ We appreciate all forms of contributions, big and small — every little bit helps move the needle forward.

Bug reports, bug fixes, documentation additions, features, code, coffee, etc., benefit everyone.

While items on the [Roadmap](roadmap.md) correspond to our own needs and ambitions, that doesn’t mean that contributions should be limited to just those things. If you want to drop in a feature that you think would benefit others, *make a Pull Request!* (against `main`). We track open work and "good first issue"-shaped tasks on the [GitHub Project board](https://github.com/orgs/dotBunny/projects/6/views/1) — it's a good place to look before starting something larger.

:::tip[Not sure where to start?]

If you want to talk through an idea before opening an issue or PR, drop by [Discord](discord.md) — it's the fastest way to get a sanity check.

:::

## Reporting Bugs

Bugs are tracked as [GitHub Issues](https://github.com/dotBunny/NEXUS/issues) on the main framework repository. A good report includes:

- The **NEXUS** Framework version (commit hash if you're on `main`).
- The Unreal Engine version.
- A minimal reproduction — steps, a code snippet, or a small project if the issue is non-obvious.
- Relevant log output (`Saved/Logs/`) and, where applicable, a callstack.

If you're unsure whether something is a bug or expected behavior, ask in [Discord](discord.md) first.

## Pull Requests

Pull requests should target `main` from a fork or feature branch. Before opening one, please make sure your change:

- Follows the project's [Coding Standard](coding-standard.md).
- Passes the smoke tests described in [Automation](automation.md) — these run automatically on every PR.
- Includes or updates tests where it makes sense to. New plugins or subsystems should land with at least basic coverage.
- Updates documentation in [NEXUS.Docs](https://github.com/dotBunny/NEXUS.Docs) when public API or behavior changes.
- Complies with the [AI Policy](ai-policy.md) if any part of the change was AI-assisted.

Keep PRs focused — one logical change per PR makes review (and reverts, if it comes to that) much easier.

## Licensing

The **NEXUS** Framework is released under the [Boost Software License 1.0](https://github.com/dotBunny/NEXUS/blob/main/LICENSE). By submitting a contribution, you agree that it will be distributed under the same license. Contributors retain copyright on their work — there is no CLA to sign.

## Assisting With Documentation

The documentation is meant to be a living document that allows for easy additions and corrections. The documentation is statically generated from a GitHub repository that can be easily edited. Each page of the documentation has a corresponding **Edit this page** link at the bottom. 

*Let's not kid ourselves...* We are all a little lacking in documenting our work area, so this is our best bet at creating a spot to collate formalized documentation. Code documentation should still be present to mark up methods and other elements.

For more information about how to work with the documentation, please see its [repository](https://github.com/dotBunny/NEXUS.Docs).

## Source Assets

All of the [source assets](https://github.com/dotBunny/NEXUS/tree/main/SourceAssets) used by the **NEXUS** Framework are included in the repository. We elected to use [Affinity Designer](https://affinity.serif.com/en-us/designer/), [Affinity Photo](https://affinity.serif.com/en-us/photo/), and [Blender](https://www.blender.org/) as our tools of choice. This should allow for easier access for other developers who are tired of Adobe. 