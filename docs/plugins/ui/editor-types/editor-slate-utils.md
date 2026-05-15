---
sidebar_position: 5
sidebar_label: Editor Slate Utils
sidebar_class_name: type native-class
description: Editor-time Slate helpers for locating SDockTab instances in the editor's tab hierarchy.
tags: [0.2.7]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Editor Slate Utils

<TypeDetails icon="native-class" base="class" type="FNEditorSlateUtils" typeExtra="" headerFile="NexusUIEditor/Public/NEditorSlateUtils.h" />

Editor-time Slate helpers focused on locating `SDockTab` instances inside the editor's tab hierarchy so callers can reach tabs that were spawned by other systems. The runtime equivalent — [FNSlateUtils](../types/slate-utils.md) — covers generic widget-tree searches that apply outside the editor; this class adds editor-specific traversal that reaches into `FGlobalTabmanager`.

## Methods

### Find Dock Tab

Walks the widget tree rooted at `BaseWidget` searching for an `SDockTab` matching either `TargetLabel` or `TabIdentifier`. Used when only a known ancestor widget is available — typically a parent tab — and the target tab's pointer needs to be recovered.

```cpp
/**
 * @param BaseWidget Root of the search; typically the parent tab or a known ancestor widget.
 * @param TargetLabel Human-readable label to compare against the tab's displayed text.
 * @param TabIdentifier Tab manager identifier to match; preferred over label when unique.
 * @return The matching SDockTab, or an invalid shared pointer if nothing was found.
 */
static TSharedPtr<SDockTab> FindDockTab(const TSharedPtr<SWidget>& BaseWidget, const FText& TargetLabel, const FName TabIdentifier);
```

### Find Dock Tab By Identifier

Asks `FGlobalTabmanager` for a tab by registered identifier. Faster and more reliable than walking widget trees when the identifier was published by `FTabSpawnerEntry` at registration time.

```cpp
/**
 * @param TabIdentifier Tab manager identifier registered when the tab was spawned.
 * @return The matching SDockTab, or an invalid shared pointer if no such tab is live.
 */
static TSharedPtr<SDockTab> FindDockTabByIdentifier(const FName TabIdentifier);
```

## See Also

- [FNSlateUtils](../types/slate-utils.md) — runtime widget-tree walking that does not depend on the editor.
