---
sidebar_position: 5
description: Some console commands for developers to use provided by UNWorldAssemblySubsystem.
tags: [0.3.0]
---

# Console Commands

Some console commands for developers to use provided by `UNWorldAssemblySubsystem`.

| Command | Description | Flag(s) | Shippable|
|:--|:--|:--|:--|
|`N.WorldAssembly.Regenerate`| Tears down the existing worlds `ANCellProxy`, attempts to clear all registered AActor with the [UNWorldAssemblySubsystem](types/world-assembly-subsystem.md) for cleanup, and starts a new `UNAssemblyOperation` for all of the [Organ](types/organ-volume.md) in the world. | `ECVF_Default` | `Yes` |