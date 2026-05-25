---
description: TBD
sidebar_label: Cell
title: Cell
---

# Cell

![Editing Convex Hull](cell-edit-hull-vertex.webp)

A cell represents a maps meta data allowing for it to be placed in a World Assembly operation. It is meant to disconnect the actual `UWorld` (Map) from this data allowing for generation to occur without having to load any of the actual map data itself until it is actually used (SpawnCellTask). 

This allows for an extremely efficient World Assembly operation, off of the Game Thread.