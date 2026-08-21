---
sidebar_class_name: type ue-object
description: PCG node that adds a random whole number of fixed-size turns to each point's rotation.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Random Step Rotation

<TypeDetails icon="ue-object" base="UPCGSettings" type="UNRandomStepRotationSettings" typeExtra=" + ENRotationSpace" headerFile="NexusCore/Public/PCG/Elements/NRandomStepRotationElement.h" />

**`NEXUS | Random Step Rotation`** — turns each point by a random whole number of fixed-size steps.

The common case is a scatter of modular pieces that should face any of four directions but never land between them. A free random rotation gives you props at 37°; this gives you props at 0, 90, 180 or 270 and nothing else.

## Settings

| Property | Type | Purpose | Default |
| :-- | :-- | :-- | :-- |
| `Step Angle` | `double` | Size of a single turn, in degrees. Clamped `0`–`360`. | `90.0` |
| `Axis` | `ENAxis` | The axis the turn is applied around: X rolls, Y pitches, Z yaws. `None` leaves every point unrotated. | `Z` |
| `Rotation Space` | `ENRotationSpace` | Whether the turn follows the point's own axis or the world axis. | `Local` |

All three are `PCG_Overridable`.

## Pins

| Direction | Pin | Carries |
| :-- | :-- | :-- |
| In | `In` | Points to rotate. |
| Out | `Out` | The same points, rotated. |

## How Many Outcomes You Get

The number of distinct results is **how many whole steps fit in 360 degrees**, counting "no rotation" as one of them.

| `Step Angle` | Outcomes | Which |
| :-- | :-- | :-- |
| `90` | 4 | 0, 90, 180, 270 |
| `60` | 6 | 0, 60, 120, 180, 240, 300 |
| `120` | 3 | 0, 120, 240 |
| `360` | 1 | 0 — a full turn lands back where it started |

A step angle that does not divide 360 evenly drops the final partial step: `100` gives three outcomes (0, 100, 200), because a fourth would overshoot.

## Rotation Space

| Value | Turns around |
| :-- | :-- |
| `Local` | The point's **own** axis, so a tilted point spins about its tilted axis. |
| `World` | The **world** axis, so every point spins about the same direction regardless of its orientation. |

These only differ once a point is already tilted off the chosen axis. On a flat scatter of upright points rotating about Z, both produce identical results — the distinction starts mattering when the input has come off a slope or through a prior rotation node.

## Determinism

The node declares `UseSeed`, and the roll combines the node's `Seed` with **each point's own seed**. Points therefore keep their orientation across regenerations: re-running the graph does not reshuffle a layout you were happy with, and changing the node's seed reshuffles all of it at once.

## Testable Helpers

The step maths is exposed as pure statics on the element, PCG-free so it can be unit-tested directly:

```cpp
/**
 * Counts how many distinct orientations a step angle produces, including leaving the point unrotated.
 * @param StepAngle Size of a single turn, in degrees.
 * @return The number of outcomes; always at least one. A step angle that does not divide 360 evenly drops the final partial step.
 */
static NEXUSCORE_API int32 GetStepCount(double StepAngle);

/**
 * Builds the rotation applied for a given step.
 * @param StepIndex How many whole steps to turn; zero leaves the point unrotated.
 * @param StepAngle Size of a single turn, in degrees.
 * @param Axis The axis to turn around; ENAxis::None leaves the point unrotated.
 * @return The delta rotation to compose onto the point's existing rotation.
 */
static NEXUSCORE_API FQuat GetStepRotation(int32 StepIndex, double StepAngle, ENAxis Axis);
```

## Behavior

`FNRandomStepRotationElement` derives from `FPCGPointOperationElementBase` rather than implementing `IPCGElement` directly, which gives it the point-op fast paths: it allocates only `Transform`, copies points through, and supports base point data inputs. Everything but rotation passes through untouched.
