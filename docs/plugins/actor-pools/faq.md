---
sidebar_position: 10
sidebar_label: FAQ
---

# Frequently Asked Questions

## Why isn't this an Object Pool?

When you start to dig into different areas of the engine, you quickly realize, where applicable, functionally specific pooling mechanisms are present. For example, how Niagara particle systems have their instance reuse system. `CommonUI` instances widgets for reuse as well. In most cases, the best solution is bespoke and and most narrow one. 

`NActorPools` is geared towards providing a pattern for reuse for the common usage of `AActors`: they come into being, they move around and interact via some control mechanism, and then they disappear. `UObjects` are a few levels up in the abstraction chain and do not have such a clear lifecycle.

## How do I network these things?

The basic premise of making pooling work in a networked environment is to ensure only the host creates, spawns, and returns `AActors` from the pooling system. On the host, the `AActors` will be associated with the appropriate pools. On clients, they will be `AActors` in the world, sleeping, until activated via replication/etc.

:::warning
If your clients are getting warnings about `AActors` being returned to pools that don't exist and are being destroyed, this is usually because your clients are executing the `ReturnToActorPool()` method.
:::