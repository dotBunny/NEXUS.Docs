---
description: Adds an External Documentation option to the context menu of graph nodes.
---

# External Documentation

Adds an `External Documentation` option to the context menu of _Call Function_ graph nodes.

![External Documentation Context Menu](external-documentation.webp)

Add a `DocsURL` value to a `UFUNCTION` and it will be detected and used with the context menu command.

```cpp
UFUNCTION(BlueprintCallable, DisplayName = "Set Baseline", Category = "NEXUS|Guardian",
  meta=(DocsURL="https://nexus-framework.com/docs/plugins/guardian/types/guardian-subsystem/#setting-a-baseline"))
void SetBaseline();
```

:::tip

If you would like to open multiple external links seperate them with a comma.

```cpp
meta=(DocsURL="https://address.one,https://address.two"))
```

:::

:::warning

Yes, we have hijacked the `DocsURL` option, but we feel like it is globally understood and should not conflict with anything.

:::
