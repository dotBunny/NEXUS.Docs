---
sidebar_position: 10
sidebar_label: FAQ
description: Frequently Asked Questions.
---

# Frequently Asked Questions

## Do all of the UMG elements broadcast events when setting values?

Outside of the `UCheckBox`, all of our tests have shown that they all have some form of callback called when setting a value. This can be seen in **Lyra** when you open the settings screen. **Lyra** loads and sets the value of each setting but also triggers the actual change logic.