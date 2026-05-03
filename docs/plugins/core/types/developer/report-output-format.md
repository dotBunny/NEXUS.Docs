---
sidebar_position: 23
sidebar_label: Report Output Format
sidebar_class_name: type native-enum
description: Output format selector used by FNReport's emit methods to choose between plain text and Markdown.
tags: [0.3.0]
---

import TypeDetails from '../../../../../src/components/TypeDetails';

# Report Output Format

<TypeDetails icon="native-enum" base="enum" type="ENReportOutputFormat" typeExtra="" headerFile="NexusCore/Public/Developer/NReportOutputFormat.h" />

Output format selector used by [`FNReport::GetReportLines`](report.md#get-report-lines) and [`FNReport::OutputToFile`](report.md#output-to-file) to choose between human-readable plain text and Markdown.

```cpp
enum class ENReportOutputFormat : uint8
{
    /** Plain text formatted for the output log or a console window. */
    PlainText,
    /** Markdown-formatted text suitable for documentation, gists, or ticket attachments. */
    Markdown
};
```

## See Also

- [Report](report.md) — Consumes this enum on its emit methods.
