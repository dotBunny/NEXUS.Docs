---
description: TBD
sidebar_label: Bone
title: Bone
---

# Bone

A bone functions as a connection point outside of a [Cell](../cell/index.md) that is used as a start or finish target during World Assembly. A [Cell](../cell/index.md)'s [Junction](../junction/index.md) will attempt to match to the Bone by `Socket Size`, and other constraints.

:::warning

Currently, only the Bone built-in to the Organ is used as a starting point for World Assembly. Multi-bone support is targeted for the `0.4.0` release. Explicitly, cell placement between bones is not functional, nor is bone-to-bone between Organs.

:::