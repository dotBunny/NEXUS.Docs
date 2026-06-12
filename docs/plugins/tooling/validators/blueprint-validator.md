---
tags: [0.1.0]
description: An opinionated set of validation for UBlueprints.
---

import ContributorLink from '../../../../src/components/ContributorLink'

# Blueprint Validator

An opinionated set of validation for `UBlueprints`.

## IsEmptyTick

The _hidden_ performance killer, the **empty tick**. This function of the `UNBlueprintValidator` evaluates a `UBlueprint` for any Tick events that are not disabled, and have no actual logic following them.

![Empty Tick](blueprint-empty-tick.webp)

### Severity

By default, the severity of this validation is set to `Error` due to its direct performance impact and relative ease of resolution. Should you wish to change the level (or disable) of this validation, it can be found in the 
project-wide in `Editor Preferences > NEXUS > Tooling > Blueprint: Empty Tick`


![Empty Tick Severity](validator-settings.webp)

## IsMultiPinPureNode

One of the older traps of development is accessing properties, and the hidden cost of accessing the output value. Often, developers will not evaluate the underlying backing of the property and reason whether that property should be cached locally in that frame instead of accessing it repeatedly. 

This problem gets exacerbated by the multi-pin pure node accessing that can happen with a `UBlueprint`. Each access of a pin **can** reevaluate the logic to produce its output. 

This function of the `UNBlueprintValidator` looks for occurrences where this occurs.

:::tip

The quick solution is to convert any blueprint pure nodes where this occurs into an execution-based node which can be  reliably cached. At the bottom of the context-menu for pure nodes there is an option **Show Exec pins**. This will then allow you to place the node in your blueprint graph and ensure it’s sequential place. 

<ContributorLink id="reapazor" /> wrote a [blog](https://reapazor.com/2025/06/25/multipin-pure-nodes-validator-woes/) post explaining why this is an important validator to pay attention too, and how to easily solve the raised concerns.

:::

### Example Trigger

A general rule of thumb is that pure nodes are green. That means things like the **Break** utility nodes also exhibit this problem and can be resolved the same way.

![Break Pin](blueprint-multi-pin-pure-node-break.webp)

![Break Exec Pin](blueprint-multi-pin-pure-node-break-exec.webp)


### Severity

![Multi-Pin Pure Node Severity](validator-settings.webp)

By default, the severity of this validation is set to `Warning`, as it will not break your project, and resolving it requires some cognitive load.

:::info

Anecdotally, we have heard of developers getting actual FPS boosts from refactoring their `UBlueprints` with this knowledge in hand.

:::