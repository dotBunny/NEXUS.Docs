---
sidebar_class_name: type ue-object
description: PCG node that groups a point cloud into rows along one axis and shifts every other row along another.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Stagger Rows

<TypeDetails icon="ue-object" base="UPCGSettings" type="UNStaggerRowsSettings" typeExtra=" + ENRowDetection, ENRowParity" headerFile="NexusCore/Public/PCG/Elements/NStaggerRowsElement.h" />

**`NEXUS | Stagger Rows`** — groups points into rows along one axis and offsets every other row along another, producing a running-bond layout.

Brickwork is the obvious use, and the one the defaults are named for. It applies anywhere a regular grid reads as too regular: floor tiles, fence posts, crowd placement, a field of props that should not line up into visible columns.

## Settings

### Rows

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Row Axis` | `ENAxis` | Axis whose position decides which row a point belongs to. Rows run **perpendicular** to it. | `X` |
| `Row Detection` | `ENRowDetection` | How a position along the row axis resolves to a row. See [Two Ways To Find A Row](#two-ways-to-find-a-row). | `Tolerance` |
| `Row Tolerance` | `double` | Widest spread along the row axis allowed within one row; a larger gap opens the next. Zero groups exactly-matching positions only. Shown for `Tolerance`. | `1.0` |
| `Row Size` | `double` | Width of each row band along the row axis, measured out from the world origin. Shown for `Fixed Size`. | `100.0` |

### Offset

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Offset Axis` | `ENAxis` | Axis the offset is applied along. | `Y` |
| `Row Parity` | `ENRowParity` | Which half of the rows receives the offset. | `Even` |
| `Row Offset` | `double` | Amount added along the offset axis for every point in a matching row. | `0.0` |

### Metadata

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Write Row Index?` | `bool` | Write each point's resolved row index out as an attribute. | `true` |
| `Row Index` | `FName` | Name of that attribute. | `RowIndex` |

Every property is `PCG_Overridable`.

:::warning[Keep the offset axis different from the row axis]

Shifting along the **row** axis slides points into neighbouring rows instead of staggering them — the rows themselves move, which is not a stagger at all. The defaults (`X` rows, `Y` offset) are already a valid pair.

:::

## Pins

| Direction | Pin | Carries |
| :-- | :-- | :-- |
| In | `In` | Points to stagger. |
| Out | `Out` | The same points, in the same order, with alternate rows shifted. |

## Two Ways To Find A Row

| `Row Detection` | How a row is decided | Reach for it when |
| :-- | :-- | :-- |
| **`Tolerance (Derived)`** | Rows come out of the data: points within `Row Tolerance` of one another share a row, numbered along the row axis from the negative side up. | The input is one self-contained set and you want rows regardless of where it sits in the world. |
| **`Fixed Size`** | The row axis is bucketed into `Row Size` bands anchored at the **world origin**. | The input arrives in separately generated partitions — the anchor keeps row numbering consistent across them, where a derived grouping would restart at zero in each chunk. |

Fixed-size row indices are **negative** on the negative side of the origin, which the parity test accounts for. Derived indices always start at zero.

## Parity

| `Row Parity` | Offsets rows | Effect |
| :-- | :-- | :-- |
| `Even (0, 2, 4 ...)` | The first row and every second one after it | The first row moves. |
| `Odd (1, 3, 5 ...)` | The second row and every second one after it | The first row stays put — the classic running-bond look. |

For an evenly staggered bond, set `Row Offset` to **half the point spacing** along the offset axis.

## Point Order Is Preserved

The row grouping is internal bookkeeping used only to decide which points move. The output keeps the **input's point order**, so anything downstream that indexes into the data is unaffected — a stagger can be dropped into an existing chain without renumbering anything after it.

`Write Row Index?` is on by default because the row is the one piece of information the node computes that you cannot recover from the output: two staggered rows are indistinguishable from an irregular grid once the offset is applied. Downstream nodes use it to vary material, height, or mesh per row.

## Testable Helpers

The grouping maths is exposed as pure statics on the element, PCG-free so it can be unit-tested directly:

```cpp
/** Maps an axis onto the FVector component index it addresses; INDEX_NONE for ENAxis::None. */
static NEXUSCORE_API int32 GetAxisIndex(ENAxis Axis);

/** Groups positions along the row axis into rows, numbering them from the negative side up from zero. */
static NEXUSCORE_API void AssignRowIndices(TConstArrayView<double> Positions, double Tolerance, TArray<int32>& OutRowIndices);

/** Resolves a position on the row axis to a fixed-width band anchored at the world origin. */
static NEXUSCORE_API int32 GetFixedRowIndex(double Position, double RowSize);

/** Tests whether a row index matches the parity selected for offsetting. */
static NEXUSCORE_API bool ShouldOffsetRow(int32 RowIndex, ENRowParity Parity);
```

A `RowSize` at or below zero collapses everything into row zero rather than dividing by it.
