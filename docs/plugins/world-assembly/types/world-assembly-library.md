---
description: A utility class providing functionality to support World Assembly operations.
sidebar_class_name: type ue-blueprint-function-library
---

import TypeDetails from '@site/src/components/TypeDetails';

# World Assembly Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNWorldAssemblyLibrary" typeExtra="" headerFile="NexusWorldAssembly/Public/NWorldAssemblyLibrary.h" />

A utility class providing functionality to support World Assembly operations. Static helpers callable from both C++ and Blueprint contexts for seeding generation passes and reading the gameplay tags a placed cell contributes.

## Two Scopes of Tag State

Most of this library is tag access, and it comes in **two independent scopes** that share a vocabulary but not a lifetime. Getting them mixed up is the single easiest mistake to make here.

| Scope | Keyed by | Lives as long as | Covered under |
| :-- | :-- | :-- | :-- |
| **Per-cell** | an `ANCellLevelInstance*` | the placed cell | [Cell Tag State](#cell-tag-state) |
| **Per-operation** | an `int32` operation ticket | the entry in the [context cache](#operation-context-cache) | [Operation Context Cache](#operation-context-cache) |

Per-cell state is what a spawned cell ended up with. Per-operation state is the *running* total the generation pass accumulated, held in `FNWorldAssemblyContextCache` and reachable only while that operation's entry survives. [Get Operation Ticket](#reading-cell-state) is the bridge — it takes a cell and gives you the ticket for the operation that placed it.

:::warning[Reads are copies; mutate through the dedicated nodes]

Every `Get …Tags` / `Get Tag Counter` node hands Blueprint a **copy**. Editing that copy changes nothing. To persist a change, use the matching `Append` / `Remove` / `Add` / `Subtract` node, which writes through to the live state.

This applies to both scopes and is the reason those mutator nodes exist at all.

:::

## UFunctions

### Get New Friendly Seed

Produces a human-friendly non-deterministic seed string that can be fed straight into a generation pass via the [World Assembly Subsystem](world-assembly-subsystem.md)'s `Generate()` call.

```cpp
/**
 * @return A freshly generated human-friendly seed string suitable for use as FNAssemblyOperationSettings::Seed.
 */
UFUNCTION(BlueprintPure, Category = "NEXUS|WorldAssembly", DisplayName="Get New Friendly Seed")
static FString GetNewFriendlySeed();
```

Internally this delegates to `FNSeedGenerator::RandomFriendlySeed()`, so the result is a readable token rather than an opaque number — handy for surfacing in UI or logs where a player or designer might want to share or re-enter the seed.

### Get Context Tags

Returns the final context `FGameplayTagContainer` carried by the supplied `ANCellLevelInstance`.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return The final context tags associated with the world assembly.
 * @note Returns a copy; edits made to it are not written back to the cell. Use Append/Remove Context Tags to persist changes.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Context Tags")
static FGameplayTagContainer GetContextTags(ANCellLevelInstance* LevelInstance);
```

:::warning

The container is returned **by value**. Mutating the result does nothing to the cell — use the `Append Context Tags` / `Remove Context Tags` nodes to persist a change.

:::

An invalid `LevelInstance` yields an empty container rather than failing.

### Get Assembly Tags

Returns the assembly `FGameplayTagContainer` used by the cell itself, as opposed to the surrounding context tags above.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return The assembly tags used by the cell itself.
 * @note Returns a copy; edits made to it are not written back to the cell.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Assembly Tags")
static FGameplayTagContainer GetAssemblyTags(ANCellLevelInstance* LevelInstance);
```

Like the context tags, this is a copy and an invalid `LevelInstance` yields an empty container.

### Get Hex Seed

Returns the cell's seed formatted as a human-readable hexadecimal string, handy for surfacing in UI or logs alongside the friendly seed produced by [Get New Friendly Seed](#get-new-friendly-seed).

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return The cell's seed formatted as a human-readable hexadecimal string.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Hex Seed")
static FString GetHexSeed(ANCellLevelInstance* LevelInstance);
```

Internally this delegates to `FNSeedGenerator::HexFromSeed()` using the value returned by the level instance's `GetSeed()`. An invalid `LevelInstance` yields an empty string.

### Get Node Identifier

Returns the identifier of the graph node this cell was assembled from, letting gameplay code trace a placed cell back to its position in the assembly graph.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return The identifier of the graph node this cell was assembled from.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName="Get Node Identifier")
static int32 GetNodeIdentifier(ANCellLevelInstance* LevelInstance);
```

An invalid `LevelInstance` returns `INDEX_NONE`.

### Is HotPath

Returns whether the supplied cell lies on the assembly's hot path — that is, on *either* the shortest or sequential variant routed through the `NEXUS.WorldAssembly.Flag.Hotpath`-flagged cells. See [Tagging](../tagging.md#nexusworldassemblyflaghotpath) for how the hot path is resolved.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return true if this cell lies on the assembly's hot path.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Is HotPath")
static bool IsHotPath(ANCellLevelInstance* LevelInstance);
```

A companion `Is HotPath ?` node (`IsHotPathExec`) carries `meta = (ExpandBoolAsExecs="ReturnValue")`, so in Blueprint the result drives **True**/**False** execution pins directly instead of returning a bool to branch on.

### Is HotPath (Shortest)

Returns whether the cell lies specifically on the **shortest** hot-path variant — the spokes formed by the shortest path from the start cell to each goal.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return true if this cell lies on the shortest-path hot path (spokes from the start cell).
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Is HotPath (Shortest)")
static bool IsHotPathShortest(ANCellLevelInstance* LevelInstance);
```

As above, an `Is HotPath (Shortest) ?` exec-pin variant (`IsHotPathShortestExec`) is provided for branching directly in Blueprint.

### Is HotPath (Sequential)

Returns whether the cell lies specifically on the **sequential** hot-path variant — the nearest-first visiting chain that threads the goals in turn.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return true if this cell lies on the sequential hot path (nearest-first visiting chain).
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Is HotPath (Sequential)")
static bool IsHotPathSequential(ANCellLevelInstance* LevelInstance);
```

Likewise, an `Is HotPath (Sequential) ?` exec-pin variant (`IsHotPathSequentialExec`) is provided for branching directly in Blueprint.

### Get HotPath Score

How many cells separate the supplied cell from the hot path, taking whichever variant runs nearer. `0` means the cell is on the hot path — this is the numeric counterpart of `Is HotPath`, true exactly when this returns `0`. See [Cell Assembly Data](cell-assembly-data.md#proximity) for how the distance is counted.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return How many cells separate this one from the hot path, taking whichever variant runs nearer.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get HotPath Score")
static int32 GetHotPathScore(ANCellLevelInstance* LevelInstance);
```

`Get HotPath Score (Shortest)` and `Get HotPath Score (Sequential)` return the same measurement against one variant only, for when the two disagree and you care which.

:::note

The scores are stored as bytes but returned as `int32`, because Blueprint's `Byte` type wraps on arithmetic and these values are usually compared against a threshold or scaled into a falloff. An invalid `LevelInstance` returns `UnreachableScore` (`255`) rather than `0`, so a null cell reads as "nowhere near" instead of "on the route".

:::

### Get Importance Score

How many cells separate the supplied cell from the nearest one tagged `NEXUS.WorldAssembly.Flag.Important`. `0` means the cell carries the tag itself. See [Tagging](../tagging.md#nexusworldassemblyflagimportant).

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @return How many cells separate this one from the nearest Important-flagged cell.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Importance Score")
static int32 GetImportanceScore(ANCellLevelInstance* LevelInstance);
```

### Is Near HotPath

Thresholded form of `Get HotPath Score`, for the common case of asking "am I within a couple of rooms of the route" without wiring up a comparison node. `MaximumScore` is how many cells away still counts as near; pass `0` and this is `Is HotPath`.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @param MaximumScore How many cells away still counts as near.
 * @return true if this cell is within MaximumScore cells of the hot path.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Is Near HotPath")
static bool IsNearHotPath(ANCellLevelInstance* LevelInstance, const int32 MaximumScore = 1);
```

An `Is Near HotPath ?` exec-pin variant (`IsNearHotPathExec`) is provided for branching directly in Blueprint.

### Is Near Important

The same threshold applied to `Get Importance Score`. Pass `0` to ask whether the cell is itself flagged `Important`.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @param MaximumScore How many cells away still counts as near.
 * @return true if this cell is within MaximumScore cells of an Important-flagged cell.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Is Near Important")
static bool IsNearImportant(ANCellLevelInstance* LevelInstance, const int32 MaximumScore = 1);
```

An `Is Near Important ?` exec-pin variant (`IsNearImportantExec`) is provided for branching directly in Blueprint.

### Does Junction Lead Toward HotPath

Whether the cell across a given junction sits **nearer** the hot path than the cell you are asking from — the doorway to take when heading for the route. Answered from the score baked onto the [link details](junction-component.md#link-details), so it works before the far cell has streamed in.

```cpp
/**
 * @param LevelInstance The cell level instance to query.
 * @param JunctionIdentifier The junction to test.
 * @return true when the cell across that junction sits nearer the hot path than this one.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Does Junction Lead Toward HotPath")
static bool DoesJunctionLeadTowardHotPath(ANCellLevelInstance* LevelInstance, const int32 JunctionIdentifier);
```

`Does Junction Lead Toward Important` is the same test against the nearest `Important`-flagged cell. Both ship the usual exec-pin twins.

:::note

The comparison is strict, so a cell **already on** the route reports false in every direction rather than pointing at whichever neighbour happens to also be on it. An unconnected junction carries `UnreachableScore` and can only ever be false — which is what an opening onto nothing should report.

:::

### Get Junction World Size

Converts a [junction](junction-component.md)'s grid socket size into world units using the project's `Socket Size` / `Socket Depth` settings (see [Project Settings](../project-settings.md)).

```cpp
/**
 * @param JunctionComponent The junction whose socket size to convert.
 * @param bWithDepth When true, fills Z with the configured SocketDepth; otherwise Z stays 1.
 * @return The junction's world-space size (X,Y scaled from the socket grid; Z = depth when requested).
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Junction World Size")
static FVector GetJunctionWorldSize(UNCellJunctionComponent* JunctionComponent, bool bWithDepth = false);
```

### Get Junction World Size (Shifted)

A variant of [Get Junction World Size](#get-junction-world-size) that packs the result as `(Depth, X, Y)` — useful when the depth axis must lead — and applies a uniform `Scale` to all three components.

```cpp
/**
 * @param JunctionComponent The junction whose socket size to convert.
 * @param Scale Uniform multiplier applied to all three components.
 * @return A vector packed as (SocketDepth, world X, world Y), each scaled by Scale.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Junction World Size (Shifted)", meta=(ToolTip="Depth, X, Y"))
static FVector GetJunctionWorldSizeShifted(UNCellJunctionComponent* JunctionComponent, float Scale = 1.f);
```

### Get Junction Fill Depth Anchor

The signed distance, along the junction's forward axis, at which a filler should anchor its fill volume before it extrudes forward by the fill depth. This encodes the direction of the junction's [fill-depth mode](junction-component.md#fill-depth): `0` for the forward modes, `-depth` for the backward modes, and `-depth / 2` for the centered modes.

```cpp
/**
 * @param JunctionComponent The junction whose fill-depth anchor to read.
 * @return The anchor distance in world units; negative values shift the volume toward the junction's backward direction.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Junction Fill Depth Anchor")
static float GetJunctionFillDepthAnchor(UNCellJunctionComponent* JunctionComponent);
```

### Get Junction Fill Depth Offset

The world-space form of [Get Junction Fill Depth Anchor](#get-junction-fill-depth-anchor) — the anchor distance projected along the junction's forward direction. Add this to a filler's placement location so it extrudes forward from the anchored near edge, which realizes the Forward / Backward / Centered fill-depth modes without moving the junction's spawn transform.

```cpp
/**
 * @param JunctionComponent The junction whose fill-depth anchor to read.
 * @return The world-space anchor offset (junction forward direction scaled by the signed anchor distance).
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Junction Fill Depth Offset")
static FVector GetJunctionFillDepthOffset(UNCellJunctionComponent* JunctionComponent);
```

### Get Junction World Corner Points

Returns the junction's four corner points in world space for a given socket size — handy for projecting PCG volumes, debug draws, or gameplay markers onto the opening.

```cpp
/**
 * @param JunctionComponent The junction to query.
 * @param SocketSize Socket size (in grid units) to project the corners for.
 * @return The junction's four corner points in world space for the given socket size.
 */
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Get Junction World Corner Points")
static TArray<FVector> GetJunctionWorldCornerPoints(UNCellJunctionComponent* JunctionComponent, const FVector2D& SocketSize);
```

### Draw Junction Connector Path

Draws the [route](cell-junction-connection.md#path) a [junction connector](cell-junction-connector.md) was given, as debug lines — the payload handed to `OnConnectJunctions`.

```cpp
UFUNCTION(BlueprintCallable, Category = "NEXUS|WorldAssembly", DisplayName = "Draw Junction Connector Path",
	meta=(WorldContext = "WorldContextObject", ClampMin="0", UIMax="16"))
static void DrawJunctionConnectorPath(const UObject* WorldContextObject, const FNCellJunctionConnectorPath& Path,
	const FLinearColor CenterColor = FLinearColor::Green, const FLinearColor CornerColor = FLinearColor::Yellow,
	const bool bDrawCorners = true, const int32 Subdivisions = 0, const bool bPersistentLines = false,
	const float LifeTime = -1.f, const uint8 DepthPriority = 0, const float Thickness = 2.f);
```

| Pin | Description | Default |
| :-- | :-- | :-- |
| `Path` | The cached route, as handed to a connector through `OnConnectJunctions`. | |
| `Center Color` | Color to draw the center curve with. | `Green` |
| `Corner Color` | Color to draw the four socket-corner curves with. | `Yellow` |
| `Draw Corners` | Draw the corner curves alongside the center? They bound the volume a connector's geometry may occupy, so they are usually the more useful view of the two. | `true` |
| `Subdivisions` | Extra points to evaluate between each stored sample of the center curve, smoothing out the faceting. Zero draws the stored samples untouched. | `0` |
| `Persistent Lines` | Should the drawn lines be permanent? | `false` |
| `Life Time` | How long the lines last if not permanent; `-1` for a single frame. | `-1.f` |
| `Depth Priority` | Scene depth priority group to draw into. | `0` |
| `Thickness` | Thickness of the drawn lines. | `2.f` |

By default this draws the path's **stored samples** — the exact points the connector pass swept for collisions — so what appears is the geometry that was proven clear rather than a re-approximation of it. Those samples are spaced by the pass's `Sample Step` and taken uniformly in curve *parameter* rather than by arc length, so a sharply-bending route reads as a run of flat facets.

:::note[What Subdivisions Does and Does Not Smooth]

`Subdivisions` smooths **only the center curve** — the one stored as a curve definition (control points plus tangents) that can be re-evaluated at any resolution.

The corner curves are generated by sweeping a frame along the center and have no such definition, so they keep their sampled resolution. Smoothing them would mean inventing geometry the pass never tested.

Subdividing also never moves the line **off** the stored samples: it evaluates the same curve at a whole multiple of the stored step, so the drawn path still passes through every point that was collision-tested. A smoothed view and the validated one can never disagree about where the path goes.

A path that was default-constructed, or predates the stored curve definition, still draws — just at its stored resolution.

:::

## Cell Tag State

Everything in this section takes an `ANCellLevelInstance*` and reads or writes the tag state of **that one placed cell**. An invalid instance is always safe: readers return an empty/`INDEX_NONE` result and writers do nothing.

### Reading Cell State

| Node | Returns | Notes |
| :-- | :-- | :-- |
| `Get Context Tags` | `FGameplayTagContainer` | The cell's final context tags. See [above](#get-context-tags). |
| `Get Context Tags Added` | `FGameplayTagContainer` | Only the tags **this cell contributed** to the overall state, rather than everything it ended up carrying. |
| `Get Assembly Tags` | `FGameplayTagContainer` | The cell's own assembly tags. See [above](#get-assembly-tags). |
| `Get Tag Counter (Map)` | `TMap<FGameplayTag, int32>` | The final tag counter as a map. |
| `Get Tag Counter (Array)` | `TArray<FNGameplayTagCount>` | The same counter as tag/count pairs. |
| `Get Operation Ticket` | `int32` | The ticket of the operation that placed this cell — the key for everything in [Operation Context Cache](#operation-context-cache). `INDEX_NONE` if invalid. |

`Get Context Tags` and `Get Context Tags Added` answer different questions. The first is "what does this cell know?", the second is "what did this cell teach the pass?" — useful when you need to attribute an accumulated tag to the cell that introduced it.

:::note[Map vs Array is not just a formatting choice]

The **array** is the live backing store; the map is derived from it. That is why the `Add`/`Subtract Tag Counter` mutators below operate on the array form, and why a `TMap` read cannot be written through even in C++ — the level instance returns the map by value and the array by reference.

Prefer the map for lookups and the array when you care about ordering or are working alongside the mutators.

:::

### Testing Cell State

| Node | Tests |
| :-- | :-- |
| `Has Tag Counter` | Whether the cell's counter has an entry for a tag. |
| `Has Context Tag(s)` | Whether the cell's context tags contain **every** tag in a container. |

:::warning[Containment is an exact match]

`Has Context Tag(s)` uses `HasAllExact`, so tag hierarchy does **not** apply. A cell carrying `NEXUS.WorldAssembly.Foo.Bar` does not satisfy a query for `NEXUS.WorldAssembly.Foo`. Query for the exact tags you expect, not their parents.

The same is true of the per-operation equivalent.

:::

### Mutating Cell State

| Node | Effect |
| :-- | :-- |
| `Append Context Tags` | Adds tags to the cell's context set as a union — duplicates are ignored. |
| `Remove Context Tags` | Removes tags from the cell's context set. |
| `Add Tag Counter` | Increases the counter for a tag by `Value` (default `1`), creating the entry if absent. |
| `Subtract Tag Counter` | Decreases the counter for a tag by `Value` (default `1`), creating the entry if absent. |

:::warning[`Subtract Tag Counter` on an unknown tag creates a negative entry]

Both mutators go through a find-or-add helper that appends a **zero-initialized** entry when the tag is absent. So subtracting from a tag the cell never counted does not no-op — it creates that tag with a count of `-Value`.

Guard with `Has Tag Counter` first if a negative count would be meaningless to your logic. There is no clamping.

:::

## Operation Context Cache

These take an **operation ticket** (`int32`) rather than a cell, and read or write `FNWorldAssemblyContextCache` — the thread-safe store holding each in-flight operation's running tag counter and context tags. Get a ticket from [Get Operation Ticket](#reading-cell-state).

Every call locks the cache for its full duration, so each one is atomic with respect to entries being added or removed. No reference into the cache is ever handed out, so a caller cannot observe a dangling entry.

| Node | Purpose |
| :-- | :-- |
| `Has Operation Context Cache` | Whether cached state still exists for a ticket. **The guard for everything else here.** |
| `Get Operation Tag Counter` | Reads one tag's running counter. Returns `-1` when the operation *or* the tag is absent. |
| `TryGet Operation Tag Counter` | Same read, but returns success separately so absent is distinguishable from a real value. |
| `Has Operation Tag Counter` | Whether the operation has a counter entry for a tag. |
| `Add Operation Tag Counter` | Increases a tag's running counter by `Value` (default `1`). |
| `Subtract Operation Tag Counter` | Decreases a tag's running counter by `Value` (default `1`). |
| `Has Operation Context Tag(s)` | Whether the operation's context tags contain every tag in a container (exact match). |
| `Append Operation Context Tag(s)` | Adds tags to the operation's context set as a union. |
| `Remove Operation Context Tag(s)` | Removes tags from the operation's context set. |

:::info[`Get` collapses two different failures into `-1`]

`Get Operation Tag Counter` returns `-1` both when the ticket is unknown and when the tag simply is not counted — and `-1` is also a perfectly legal counter value, since nothing clamps counters at zero.

Use `TryGet Operation Tag Counter` whenever that distinction matters. It reports presence through its return value and **leaves your output variable unchanged** when the entry is absent, rather than zeroing it — so seed the variable with a sensible fallback before the call.

:::

:::warning[Mutating an expired operation silently does nothing]

Unlike the per-cell mutators, the cache mutators are **no-ops for an unregistered ticket** — they look the operation up and return without creating it. Since the cache entry is dropped when its operation is cleaned up, a ticket held past that point will accept writes that go nowhere and report no error.

Check `Has Operation Context Cache` before a write you care about.

:::

## Exec-Pin Variants

Every boolean predicate in this library ships a twin node whose name gains a trailing `?`, carrying `meta = (ExpandBoolAsExecs="ReturnValue")`. Instead of returning a bool for you to branch on, these drive **True** / **False** execution pins directly — one node instead of two.

| Predicate | Exec-pin twin |
| :-- | :-- |
| `Is HotPath` | `Is HotPath ?` |
| `Is HotPath (Shortest)` | `Is HotPath (Shortest) ?` |
| `Is HotPath (Sequential)` | `Is HotPath (Sequential) ?` |
| `Is Near HotPath` | `Is Near HotPath ?` |
| `Is Near Important` | `Is Near Important ?` |
| `Does Junction Lead Toward HotPath` | `Does Junction Lead Toward HotPath ?` |
| `Does Junction Lead Toward Important` | `Does Junction Lead Toward Important ?` |
| `Has Tag Counter` | `Has Tag Counter ?` |
| `Has Context Tag(s)` | `Has Context Tag(s) ?` |
| `Has Operation Context Cache` | `Has Operation Context Cache ?` |
| `Has Operation Context Tag(s)` | `Has Operation Context Tag(s) ?` |

The two forms are behaviourally identical — the twin is not a cheaper or stricter check, just a different pin layout. Note `Has Operation Tag Counter` has **no** exec twin, so branch on its return value.

## Not Blueprint-Exposed

`GetProxyMesh` is a plain `static` C++ function with no `UFUNCTION`, so it does not appear in Blueprint:

```cpp
/**
 * Only the owner / creator of the ANCellProxy will be able to reach the DynamicMesh through their ANCellLevelInstance.
 * @param LevelInstance The cell level instance to query.
 * @return The cell's proxy dynamic mesh, or nullptr if the instance is invalid or has no proxy mesh set.
 */
static UDynamicMesh* GetProxyMesh(ANCellLevelInstance* LevelInstance);
```

That is deliberate: the [proxy](cell-proxy.md) mesh is reachable only by whoever owns the `ANCellProxy`, and exposing it as a Blueprint node would invite reads from code that has no such claim.
