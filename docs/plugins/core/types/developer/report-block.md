---
sidebar_position: 21
sidebar_label: Report Block
sidebar_class_name: type native-struct
description: Base type for all report blocks, carrying the heading, header, footer, level, and priority shared by every block.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Report Block

<TypeDetails icon="native-struct" base="struct" type="FNReportBlock" typeExtra="" headerFile="NexusCore/Public/Developer/NReportBlock.h" />

Base type for all [`Report`](report.md) blocks. Carries the rendering metadata (heading, header, footer, indentation level, sort priority) shared by every block, and tracks the block's ticket within its owning report. Concrete blocks — [`Report Content Block`](report-content-block.md) and [`Report Table Block`](report-table-block.md) — extend this type and override `Render` to emit their specific body.

Blocks are not constructed directly; they are allocated through [`FNReport::CreateContentBlock`](report.md#create-content-block) or [`FNReport::CreateTableBlock`](report.md#create-table-block), which assign the ticket and parent linkage.

## Methods

### Get Priority

Returns the order priority used by the parent to sort siblings. Lower values render first.

```cpp
int32 GetPriority() const;
```

### Get Level

Returns the nesting depth assigned when this block was created. `0` is the report root, `1` is a top-level block, and so on. Drives heading style selection during rendering — Markdown maps levels 1–5 to `#` through `#####`; plain text maps levels 1–3 to underline decorations and 4–5 to bracketed inline forms.

```cpp
int32 GetLevel() const;
```

### Get Ticket

Returns the ticket that uniquely identifies this block within its owning [`Report`](report.md).

```cpp
int32 GetTicket() const;
```

### Set Heading

Sets the heading line rendered above the block. Decoration is chosen automatically based on [Get Level](#get-level) and the output format.

```cpp
void SetHeading(const FString& BlockHeading);
```

### Set Header

Sets the header line emitted directly after the heading and before the block body. Markdown emits this as a blockquote (`> ...`); plain text emits it verbatim.

```cpp
void SetHeader(const FString& BlockHeader);
```

### Set Footer

Sets the footer line emitted after the block body and any child blocks. Markdown emits this as a blockquote; plain text emits it verbatim.

```cpp
void SetFooter(const FString& BlockFooter);
```

### Render

Renders this block — heading, header, children, footer — into `Output`. Concrete subclasses override this to insert their body between the header and the children.

```cpp
/**
 * @param Report The owning report, used to resolve and render this block's children.
 * @param Output Line buffer that this block appends to.
 * @param OutputFormat Whether to emit plain text or Markdown.
 */
virtual void Render(FNReport& Report, TArray<FString>& Output,
    const ENReportOutputFormat OutputFormat = ENReportOutputFormat::PlainText);
```

## See Also

- [Report](report.md) — Owning container that issues block tickets and walks the tree.
- [Report Content Block](report-content-block.md) — Free-form line block.
- [Report Table Block](report-table-block.md) — Tabular data block.
