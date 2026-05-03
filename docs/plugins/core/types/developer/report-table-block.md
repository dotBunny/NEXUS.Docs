---
sidebar_position: 24
sidebar_label: Report Table Block
sidebar_class_name: type native-struct
description: Report block that holds tabular data, rendered as a column-aligned grid in plain text or a pipe-separated table in Markdown.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Report Table Block

<TypeDetails icon="native-struct" base="struct" type="FNReportTableBlock" typeExtra=": FNReportBlock" headerFile="NexusCore/Public/Developer/NReportTableBlock.h" />

[`Report Block`](report-block.md) that holds tabular data. Must be initialized with either a fixed column count or a header row before rows are added. Plain-text rendering left-aligns each cell to the widest entry in its column; Markdown rendering emits a standard pipe-separated table. Created through [`FNReport::CreateTableBlock`](report.md#create-table-block) and retrieved with [`FNReport::GetTableBlock`](report.md#get-table-block).

## Methods

### Initialize

Initializes the table either with a fixed number of columns and no header row, or with a header row that derives the column count and seeds per-column widths. One of the two overloads must be called before [Add Row](#add-row); rows added before initialization are rejected with a `LogNexusCore` error.

```cpp
/**
 * @param Columns Number of columns the table will have; rows exceeding this are truncated.
 */
void Initialize(const int32 Columns);

/**
 * @param HeaderRow Header cells, one per column.
 */
void Initialize(const TArray<FString>& HeaderRow);
```

### Add Row

Appends a row of cells, updating per-column maximum widths as needed. Trailing cells beyond the column count are dropped.

```cpp
void AddRow(const TArray<FString>& Row);
```

### Render

Renders the heading, header, table body, child blocks, and footer into `Output`. Plain text emits a column-aligned grid; Markdown emits a pipe-separated table. Override of [`FNReportBlock::Render`](report-block.md#render).

```cpp
virtual void Render(FNReport& Report, TArray<FString>& Output,
    const ENReportOutputFormat OutputFormat = ENReportOutputFormat::PlainText) override;
```

## See Also

- [Report](report.md) — Owning container; constructs and stores table blocks.
- [Report Block](report-block.md) — Base type; heading, header, footer, level, priority.
- [Report Content Block](report-content-block.md) — Free-form line variant.
