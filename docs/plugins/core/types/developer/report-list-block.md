---
sidebar_class_name: type native-struct
description: Report block that holds a sequence of items, rendered as a bulleted list in plain text or Markdown.
tags: [0.3.1]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Report List Block

<TypeDetails icon="native-struct" base="struct" type="FNReportListBlock" typeExtra=": FNReportBlock" headerFile="NexusCore/Public/Developer/NReportListBlock.h" />

[`Report Block`](report-block.md) that holds a sequence of items, rendered as a bulleted list. Use it when you want a set of short, unordered entries rather than the free-form lines of a [`Report Content Block`](report-content-block.md). Created through [`FNReport::CreateListBlock`](report.md#create-list-block) and retrieved with [`FNReport::GetListBlock`](report.md#get-list-block).

## Methods

### Add Item

Appends a single item to the list.

```cpp
void AddItem(const FString& Item);
```

### Render

Renders the heading, header, list items, child blocks, and footer into `Output`. Override of [`FNReportBlock::Render`](report-block.md#render).

```cpp
virtual void Render(FNReport& Report, TArray<FString>& Output,
    const ENReportOutputFormat OutputFormat = ENReportOutputFormat::PlainText) override;
```

## See Also

- [Report](report.md) — Owning container; constructs and stores list blocks.
- [Report Block](report-block.md) — Base type; heading, header, footer, level, priority.
- [Report Content Block](report-content-block.md) — Free-form line variant.
- [Report Collapsable Block](report-collapsable-block.md) — Grouping that vanishes when empty.
