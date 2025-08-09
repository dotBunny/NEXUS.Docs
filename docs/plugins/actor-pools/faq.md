---
sidebar_position: 10
sidebar_label: FAQ
---

# Frequently Asked Questions

## Why isn't this an Object Pool?

When you start to dig into different areas of the engine, you quickly realize, where applicable, functionally specific pooling mechanisms are present. For example, how Niagara particle systems have their instance reuse system. `CommonUI` instances widgets for reuse as well. In most cases, the best solution is bespoke and and most narrow one. 

`NActorPools` are geared towards providing a pattern for reuse for the common usage of Actors: they come into being, they move around and interact via some control mechanism, and then they disappear. `UObjects` are a few levels up in the abstraction chain and do not have such a clear lifecycle.
