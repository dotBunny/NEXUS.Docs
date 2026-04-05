---
description: A procedural generation system focused on creating dynamic gameplay-focused spaces.
sidebar_position: 2
sidebar_label: Process Flow 🚧
title: Process Flow
---

# Pre-Generation

`UNProcGenOperation::CreateInstance()`

```mermaid
stateDiagram-v2

  state UNProcGenOperation::CreateInstance {
    
    Context : Create FNProcGenOperationContext   
    AddToRoot : Add To Root  
    Register : Register with FNProcGenRegistry 

    Context --> AddToRoot    
    AddToRoot --> Register
  }
  
  
```