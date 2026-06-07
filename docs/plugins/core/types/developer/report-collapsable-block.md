---
sidebar_class_name: type native-struct
description: Report block that renders like a base block but contributes nothing when it has no child blocks, so empty groupings vanish from the output.
tags: [0.3.1]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Report Collapsable Block

<TypeDetails icon="native-struct" base="struct" type="FNReportCollapsableBlock" typeExtra=": FNReportBlock" headerFile="NexusCore/Public/Developer/NReportCollapsableBlock.h" />

[`Report Block`](report-block.md) that acts as a collapsing section. It renders its heading, header, child blocks, and footer exactly like a base block — but contributes nothing at all when it has no child blocks. Use it to wrap optional groupings whose heading should only appear once something is nested under them; empty sections vanish from the output rather than leaving a dangling heading. Created through [`FNReport::CreateCollapsableBlock`](report.md#create-collapsable-block) and retrieved with [`FNReport::GetCollapsableBlock`](report.md#get-collapsable-block).

A collapsable block has no body of its own — give it a heading via [`FNReportBlock::SetHeading`](report-block.md#set-heading) and nest the content you want grouped under its ticket.

## Methods

### Render

Renders the block only when it has child blocks; otherwise emits nothing. When it does render, it emits the heading, header, child blocks, and footer like any other block. Override of [`FNReportBlock::Render`](report-block.md#render).

```cpp
virtual void Render(FNReport& Report, TArray<FString>& Output,
    const ENReportOutputFormat OutputFormat = ENReportOutputFormat::PlainText) override;
```

## See Also

- [Report](report.md) — Owning container; constructs and stores collapsable blocks.
- [Report Block](report-block.md) — Base type; heading, header, footer, level, priority.
- [Report Content Block](report-content-block.md) — Free-form line variant.
- [Report List Block](report-list-block.md) — Bulleted list variant.
