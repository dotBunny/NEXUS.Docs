---
description: TBD
sidebar_label: FAQ
---

# FAQ

## What is the goal here?

The long-term plan is to develop generation that can create stitched together gameplay spaces similar in complexity to the interconnected world of Dark Souls. This means being able to connect defined areas of generation reliably, as well as the idea of if you can see it in the distance, you should be able to get to it. 

Another way of thinking of this is that this should be able to generate the Forest, the Castle, and the rooms in the Castle in a dependent manner with fixed junctions.

## Why the Anatomy naming?

The age old developer problem of naming; it went through many iterations as complexity increased and it just became easier to explain to people using basic anatomy concepts. The faster someone was able to understand the concepts, the faster they were able to start making content. 

## Why not use PCG to do this? 

While PCG is great at many things, building out gameplay spaces it is not (as of the point of writing this). The concept of stitching together levels is not novel in any sense of the word. There are many great examples of it out in the wild ([Dead Cells](https://dead-cells.com/), [Windblown](https://windblown.game/), [Returnal](https://housemarque.com/games/returnal), [Saros](https://housemarque.com/games/saros), etc.). Where it doesn’t fit well with the current PCG plugin state is that there is a lot of context that goes into a placed piece and how it interacts with those around it and the world it is being placed in.

Often resulting in an operation that is not exactly linear-described, but iterative and destructive at the same time. Context thrashing becomes a problem as well, and more specifically how the actual pieces are placed and consumed.
World Assembly, for example, implements streaming in level instances (Cells) in a manner which supports dynamic lighting models (like Lumen) but also baked options as well like Lighting Scenarios. It _just works_ in Multiplayer, and plays nicely with World Partition. Not something, at the time, PCG was going to be able to provide.

As an added decision point - the bulk of the work (outside of spawning cells) is done off of the Game Thread, that wasn’t something PCG was going to be able to achieve at the time.