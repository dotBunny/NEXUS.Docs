---
sidebar_class_name: type ue-object
description: PCG node that groups a point cloud into rows along one axis, then offsets and turns alternate rows.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Adjust Rows

<TypeDetails icon="ue-object" base="UPCGSettings" type="UNAdjustRowsSettings" typeExtra=" + ENRowDetection, ENRowParity" headerFile="NexusCore/Public/PCG/Elements/NAdjustRowsElement.h" />

**`NEXUS | Adjust Rows`** — groups points into rows along one axis, then applies two independent adjustments to alternate rows: an **offset** along another axis, and a **rotation** about one.

Brickwork is the obvious use of the offset, and the one the defaults are named for. It applies anywhere a regular grid reads as too regular: floor tiles, fence posts, crowd placement, a field of props that should not line up into visible columns. The rotation solves the other half of that problem — a run of one mesh reads as a repeat no matter how well it is staggered, and half a turn on alternate rows interlocks them instead.

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

### Rotation

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Rotation Axis` | `ENAxis` | Axis the row rotation is applied around: `X` rolls, `Y` pitches, `Z` yaws. `None` leaves every row unrotated. | `Z` |
| `Rotation Parity` | `ENRowParity` | Which half of the rows receives the rotation. | `Odd` |
| `Row Rotation` | `double` | Turn applied to every point in a matching row, in degrees. Clamped to ±360. | `0.0` |

### Metadata

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Write Row Index?` | `bool` | Write each point's resolved row index out as an attribute. | `true` |
| `Row Index` | `FName` | Name of that attribute. | `RowIndex` |

Every property is `PCG_Overridable`.

:::warning[Keep the offset axis different from the row axis]

Shifting along the **row** axis slides points into neighbouring rows instead of staggering them — the rows themselves move, which is not a stagger at all. The defaults (`X` rows, `Y` offset) are already a valid pair.

The **rotation** axis carries no such restriction, and is deliberately unconstrained: turning a mesh about the axis its rows run along is a perfectly reasonable thing to want.

:::

## Pins

| Direction | Pin | Carries |
| :-- | :-- | :-- |
| In | `In` | Points to adjust. |
| Out | `Out` | The same points, in the same order, with alternate rows offset and/or turned. |

## Two Adjustments, Two Parities

Offset and rotation are held apart on purpose. Each carries its **own** parity, so they can be aimed at the same rows or at opposite ones:

| Setup | Result |
| :-- | :-- |
| Same parity | One set of rows is both shifted and turned; the other is left alone. |
| Opposite parity (the default) | Alternate rows are shifted, and the rows *between* them are turned. |

Tying the two together would make the second layout impossible to express, and offsetting one set of rows while turning the other is a real layout rather than a curiosity.

Either adjustment can be switched off on its own by leaving its amount at zero — or, for the rotation, by setting `Rotation Axis` to `None`. With both off the node still resolves rows and writes the row index, so it remains useful purely as a classifier.

## Two Ways To Find A Row

| `Row Detection` | How a row is decided | Reach for it when |
| :-- | :-- | :-- |
| **`Tolerance (Derived)`** | Rows come out of the data: points within `Row Tolerance` of one another share a row, numbered along the row axis from the negative side up. | The input is one self-contained set and you want rows regardless of where it sits in the world. |
| **`Fixed Size`** | The row axis is bucketed into `Row Size` bands anchored at the **world origin**. | The input arrives in separately generated partitions — the anchor keeps row numbering consistent across them, where a derived grouping would restart at zero in each chunk. |

Fixed-size row indices are **negative** on the negative side of the origin, which the parity test accounts for. Derived indices always start at zero.

## Parity

| Parity | Adjusts rows | Effect |
| :-- | :-- | :-- |
| `Even (0, 2, 4 ...)` | The first row and every second one after it | The first row moves. |
| `Odd (1, 3, 5 ...)` | The second row and every second one after it | The first row stays put — the classic running-bond look. |

For an evenly staggered bond, set `Row Offset` to **half the point spacing** along the offset axis.

## Rotation Is In The Mesh's Own Space

The turn is composed onto the point's existing rotation **on the right**, which turns the mesh about its own axis rather than the world's. A point that arrived tilted then spins about the axis it was tilted to, which is what "base rotation" means everywhere else in NEXUS — [Random Step Rotation](random-step-rotation.md) uses the same convention.

`180` is the value that earns its keep: it flips alternate rows so meshes interlock rather than repeating. Smaller angles break up a run that reads as too regular without fully reversing it.

## Point Order Is Preserved

The row grouping is internal bookkeeping used only to decide which points are adjusted. The output keeps the **input's point order**, so anything downstream that indexes into the data is unaffected — this node can be dropped into an existing chain without renumbering anything after it.

`Write Row Index?` is on by default because the row is the one piece of information the node computes that you cannot recover from the output: two staggered rows are indistinguishable from an irregular grid once the offset is applied. Downstream nodes use it to vary material, height, or mesh per row.

## Testable Helpers

The grouping and rotation maths is exposed as pure statics on the element, PCG-free so it can be unit-tested directly:

```cpp
/** Maps an axis onto the FVector component index it addresses; INDEX_NONE for ENAxis::None. */
static NEXUSCORE_API int32 GetAxisIndex(ENAxis Axis);

/** Groups positions along the row axis into rows, numbering them from the negative side up from zero. */
static NEXUSCORE_API void AssignRowIndices(TConstArrayView<double> Positions, double Tolerance, TArray<int32>& OutRowIndices);

/** Resolves a position on the row axis to a fixed-width band anchored at the world origin. */
static NEXUSCORE_API int32 GetFixedRowIndex(double Position, double RowSize);

/** Tests whether a row index matches the parity selected for offsetting. */
static NEXUSCORE_API bool ShouldOffsetRow(int32 RowIndex, ENRowParity Parity);

/** Builds the turn applied to a row that matches the rotation parity. */
static NEXUSCORE_API FQuat GetRowRotation(double Degrees, ENAxis Axis);
```

A `RowSize` at or below zero collapses everything into row zero rather than dividing by it, and `GetRowRotation` returns identity for `ENAxis::None`.
