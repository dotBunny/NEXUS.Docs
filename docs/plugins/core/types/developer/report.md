---
sidebar_position: 20
sidebar_label: Report
sidebar_class_name: type native-struct
description: Composable, hierarchical report structure that can be emitted as plain text or Markdown.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Report

<TypeDetails icon="native-struct" base="struct" type="FNReport" typeExtra="" headerFile="NexusCore/Public/Developer/NReport.h" />

Composable, hierarchical report structure that can be emitted as plain text or Markdown. Reports own their child blocks by value, keyed by an integer ticket issued from a per-report counter; top-level blocks are parented to the implicit root ticket `0`. Use [`Report Content Block`](report-content-block.md) for free-form lines and [`Report Table Block`](report-table-block.md) for tabular data; nest them by passing a parent ticket when creating a child.

## Usage

```cpp
FNReport Report;

const int32 SummaryTicket = Report.CreateContentBlock();
FNReportContentBlock* Summary = Report.GetContentBlock(SummaryTicket);
Summary->SetHeading(TEXT("Summary"));
Summary->AddLine(TEXT("Captured 4287 objects."));

const int32 TableTicket = Report.CreateTableBlock(SummaryTicket);
FNReportTableBlock* Table = Report.GetTableBlock(TableTicket);
Table->Initialize({TEXT("Class"), TEXT("Count")});
Table->AddRow({TEXT("UStaticMeshComponent"), TEXT("128")});

Report.OutputToFile(TEXT("Saved/Reports/Snapshot.md"), ENReportOutputFormat::Markdown);
```

## Methods

### Create Content Block

Allocates a new [`Report Content Block`](report-content-block.md), attaches it to a parent, and returns its ticket. Pass the returned ticket to [Get Content Block](#get-content-block) to populate it, or as a `ParentTicket` when nesting children under it.

```cpp
/**
 * @param ParentTicket Ticket of the block this one is nested under; 0 attaches to the report root.
 * @param OrderPriority Sort priority among siblings; lower values render first.
 * @return The ticket assigned to the new block.
 */
int32 CreateContentBlock(const int32 ParentTicket = 0, const int32 OrderPriority = 0);
```

### Create Table Block

Allocates a new [`Report Table Block`](report-table-block.md), attaches it to a parent, and returns its ticket.

```cpp
/**
 * @param ParentTicket Ticket of the block this one is nested under; 0 attaches to the report root.
 * @param OrderPriority Sort priority among siblings; lower values render first.
 * @return The ticket assigned to the new block.
 */
int32 CreateTableBlock(const int32 ParentTicket = 0, const int32 OrderPriority = 0);
```

### Get Content Block

Looks up a previously created content block by ticket. The returned pointer is owned by the report and is invalidated when another block is created — fetch and use it within a single scope.

```cpp
FNReportContentBlock* GetContentBlock(const int32 Ticket);
```

### Get Table Block

Looks up a previously created table block by ticket. The returned pointer is owned by the report and is invalidated when another block is created.

```cpp
FNReportTableBlock* GetTableBlock(const int32 Ticket);
```

### Get Report Lines

Renders the entire report, walking blocks in priority order, into a flat array of lines.

```cpp
/**
 * @param OutputFormat Whether to emit plain text or Markdown.
 * @return The rendered report, one entry per line.
 */
TArray<FString> GetReportLines(ENReportOutputFormat OutputFormat);
```

### Output To File

Renders the report and writes it to disk, creating any missing intermediate directories. Logs an error via `LogNexusCore` on directory creation or file write failure.

```cpp
/**
 * @param FilePath Destination file path; the parent directory tree is created if it does not exist.
 * @param OutputFormat Whether to emit plain text or Markdown.
 */
void OutputToFile(const FString& FilePath, ENReportOutputFormat OutputFormat = ENReportOutputFormat::Markdown);
```

## See Also

- [Report Block](report-block.md) — Shared base type for content and table blocks.
- [Report Output Format](report-output-format.md) — Plain text vs. Markdown selector.
