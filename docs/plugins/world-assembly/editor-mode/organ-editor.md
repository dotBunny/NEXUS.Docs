---
tags: [0.3.0]
---

# Organ Editor


### Organ Selected

![Organ Editing Toolbar](mode-toolbar-organ.webp)

| Group | Commands |
| :-- | :-- |
| **Proxies** | Generate proxies for the selected organ, or for every organ in the level (Generate All / Clear / Clear All). |
| **Levels** | Load or unload the streaming proxy levels for the selected organ, or for every organ in the level. |

Only one generation pass runs at a time — repeatedly clicking **Generate** is debounced into a single in-flight operation so the editor cannot pile up overlapping passes.

![Organ Menu](organ-menu.webp)

![Phase Labels](organ-phase-labels.webp)

![Generate Proxies](organ-generate-proxies.webp)

![Load Instances](organ-load-instances.webp)