---
sidebar_position: 22
sidebar_label: Report Content Block
sidebar_class_name: type native-struct
description: Report block that holds a sequence of free-form text lines.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Report Content Block

<TypeDetails icon="native-struct" base="struct" type="FNReportContentBlock" typeExtra=": FNReportBlock" headerFile="NexusCore/Public/Developer/NReportContentBlock.h" />

[`Report Block`](report-block.md) that holds a sequence of free-form text lines. Lines are emitted verbatim for both plain text and Markdown output, separated by a blank line each. Created through [`FNReport::CreateContentBlock`](report.md#create-content-block) and retrieved with [`FNReport::GetContentBlock`](report.md#get-content-block).

## Methods

### Add Line

Appends a literal line to the block. Three overloads accept either a raw string, an ordered-argument format string, or a named-argument format string.

```cpp
void AddLine(const FString& Line);
void AddLine(const FString& Format, const FStringFormatOrderedArguments& Arguments);
void AddLine(const FString& Format, const FStringFormatNamedArguments& NamedArguments);
```

### Render

Renders the heading, header, body lines, child blocks, and footer into `Output`. Override of [`FNReportBlock::Render`](report-block.md#render).

```cpp
virtual void Render(FNReport& Report, TArray<FString>& Output,
    const ENReportOutputFormat OutputFormat = ENReportOutputFormat::PlainText) override;
```

## See Also

- [Report](report.md) — Owning container; constructs and stores content blocks.
- [Report Block](report-block.md) — Base type; heading, header, footer, level, priority.
- [Report Table Block](report-table-block.md) — Tabular variant.
