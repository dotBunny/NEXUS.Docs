---
name: doc-screenshot
description: Capture, convert, and file a documentation screenshot from the running Unreal editor, or re-capture existing ones after a UI change. Use when asked to add a screenshot to a page, replace a stale image, or refresh a plugin's shots after an editor-UI change.
---

# Documentation Screenshots

Getting a picture into a page is four steps — **capture, convert, place, reference** — and every one of them has a convention that is easy to get wrong. The image pipeline is validated; the conventions are where mistakes happen.

Prerequisites: a running editor ([unreal-environment](../unreal-environment/SKILL.md)) and a reachable MCP server ([unreal-mcp](../unreal-mcp/SKILL.md)).

## 1. Capture

**Screenshot the widget, not the screen.** This repo's images are tight crops — a toolbar strip is `1538x59`, a settings panel `1572x1306`. `SlateInspectorToolset.Screenshot {ref}` returns exactly one widget, already framed, so cropping is usually unnecessary.

```bash
npm run mcp -- call_tool '{"toolset_name":"SlateInspectorToolset.SlateInspectorToolset","tool_name":"Windows","arguments":{"action":"list"}}'
npm run mcp -- call_tool '{"toolset_name":"SlateInspectorToolset.SlateInspectorToolset","tool_name":"Observe","arguments":{"ref":"w1","maxDepth":12}}'
npm run mcp -- call_tool '{"toolset_name":"SlateInspectorToolset.SlateInspectorToolset","tool_name":"Snapshot","arguments":{"ref":"sp1","maxDepth":12}}'
```

Then capture the ref you want, **redirecting to a file** — a capture is millions of base64 characters and must never be printed:

```bash
npm run mcp -- call_tool '{"toolset_name":"SlateInspectorToolset.SlateInspectorToolset","tool_name":"Screenshot","arguments":{"ref":"t3"}}' > "$SCRATCH/shot.json"
```

Extract `.returnValue.data` to a `.b64` file. For viewport imagery use `EditorAppToolset.CaptureViewport` instead — `bShowUI:false` hides gizmos and selection outlines, which is what you want for a demo shot.

Call `Unobserve` when done.

:::warning[`CaptureViewport` has its own calling convention]

Three ways it differs from `Screenshot`, each of which costs a round trip to rediscover:

- **`captureTransform` and `annotations` have no defaults** and must both be passed explicitly, even to accept current behaviour. It rejects the call one missing param at a time. To disable the overlay entirely: `{"gridSpacing":0,"gridExtent":0,"gridHeight":0,"maxLabelDistance":0,"classFilter":{"refPath":""},"maxLabels":0}`.
- **The image is at `returnValue.image.data`**, not `returnValue.data`. Write one extractor that accepts `rv.data ?? rv.image?.data` so it works for every capture tool.
- **`bShowUI:false` does not suppress component visualizers.** It hides transform gizmos and selection outlines, but a `FComponentVisualizer` still draws — which is exactly what you want for a gizmo shot, since the visualizer only draws for a *selected* component and you want the selection without the selection outline.

And the reason the extractor matters: a failing parse that prints the raw payload dumps **millions of base64 characters** into the transcript. Make the error path print a message, never the response.

:::

:::warning[`CaptureEditorImage` is not a source for docs images]

It composites the whole editor at **0.75× logical** — 1280x764 on a 2560x1600 display, well under half the true pixels. `Screenshot {ref}` returns **1.5×** (full physical) for the same widget, so anything cropped out of a full-window capture lands at roughly a third of the resolution a by-ref shot would have given.

Use it to *verify state* — did the mode actually activate? — and never to produce an image. When several widgets must share one frame, screenshot their nearest common ancestor by ref and crop that: `sp4`, the viewport splitter, is the usual one and covers the whole level viewport including the edit-mode overlay.

A native Windows screen grab is not a fallback. `BitBlt` and `Graphics.CopyFromScreen` from this session return a **black frame** (the latter throws "The handle is invalid"), so there is no route to the desktop composite outside MCP.

:::

### World Assembly: the level decides which categories appear

Each category is gated on its own predicate, and one with nothing to act on is **hidden rather than greyed out**, so capturing from the wrong level silently leaves a category off the strip entirely. Two sample levels cover all five:

| Level | Package path | On the strip |
|---|---|---|
| `DEMO_NWorldAssembly` | `/NexusWorldAssemblySamples/DEMO_NWorldAssembly` | **World**, **Organ**, and the Quick Assembly toolbar controls |
| `CELL_Simple_00` | `/NexusWorldAssemblySamples/Cells/CELL_Simple_00` | **World**, **Cell**, **Cell Data**, **Junction** |

Open one with `EditorAppToolset.OpenEditorForAsset`. **Loading a map drops the edit mode**, so re-activate it after every level change.

Quick Assembly needs an *organ* specifically — it collapses in a cell-only level, which is why its capture comes from the demo level.

The mode **auto-selects a category** from world content (Cell in a cell level, Organ in an organ level), so the first capture after activating is whatever the level implied, not the World rail.

:::warning[The toolbar mode button does not activate the mode]

`Click` on the `Switch To WorldAssembly Editor Mode` button returns `true` and does nothing. Go through the level-editor **mode dropdown** instead. It opens as a *second top-level window*, whose entries only get refs from an all-window observe:

```bash
npm run mcp -- call_tool '{…,"tool_name":"Click","arguments":{"ref":"<mode combobox>"}}'
npm run mcp -- call_tool '{…,"tool_name":"Observe","arguments":{"ref":"","maxDepth":25}}'
npm run mcp -- call_tool '{…,"tool_name":"Snapshot","arguments":{"ref":"","maxDepth":25}}'  # find generic "World Assembly"
npm run mcp -- call_tool '{…,"tool_name":"Click","arguments":{"ref":"<that ref>"}}'
```

Confirm it took rather than trusting the return value: **the mode button disappears from the toolbar** once the mode is active.

:::

:::note[The strip is walkable; the panel's commands are not]

This corrects an earlier note claiming the whole panel was unreachable and that changing rails needed screen-coordinate clicks. That described the Mode Toolbox UI, which the viewport-overlay rework replaced.

`Observe {ref:"sp4"}` — the viewport splitter, **after the mode is active** — enumerates the strip as one checkbox per category: `checkbox "World"`, `"Cell"`, `"Cell Data"`, `"Junction"`, `"Organ"`. Switching category is therefore an ordinary `Click` on a ref, with no calibration.

The panel resolves only as far as its `scrollable` and the group separator texts; **its command buttons still have no refs**. That is enough — the scrollable's `pos`/`size` is what a crop needs, and the commands are only ever read off the picture.

Two ordering traps: `Snapshot {ref:"w1"}` returns a shallow tree, so observe the *subtree* you mean to walk; and the overlay does not exist before the mode is active, so re-observe after activating rather than reusing an earlier walk.

:::

## 2. Convert

```bash
npm run screenshot -- --in "$SCRATCH/shot.b64" --base64 --out static/assets/images/docs/<mirrored-path>/<name>.webp
```

`scripts/screenshot.mjs` decodes, optionally crops (`--crop x,y,w,h`), optionally downscales (`--max-width`), and writes `.webp`. Quality defaults to 90 because UI text shows lossy artefacts long before photographic content does; drop it for viewport shots, or pass `--lossless` if fine text still smears.

`--probe <file>` reports dimensions without writing, for when you do need to compute a crop.

### Settings panels

**Open them by shortcut** — `Ctrl+Alt+E` for Editor Preferences, `Ctrl+Alt+P` for Project Settings. The menu-bar items are not reliably addressable by ref (the ref-to-position mapping shifts, and clicking what looks like `Edit` can open `File`), so do not drive the menus.

The two windows then behave **differently**, and the difference decides how you frame:

| Window | Pane contents | Reaching a category |
| :-- | :-- | :-- |
| Editor Preferences | **Scoped** to the selected category — its first row is that category's header, nothing above it | Tree selection (below) |
| Project Settings | **One continuous list** of every NEXUS category — Guardian follows Actor Pools directly | Selecting a category scrolls the pane to it |

So in Project Settings always crop to the section *before the next category's header*; in Editor Preferences the pane already ends where the category does.

(An earlier version of this note applied the one-long-list behaviour to both windows and claimed the tree neither filtered nor scrolled. Verified in 5.8: it is per-window, as above. What misleads you in Editor Preferences is that the window reopens on the last category viewed, so a tree click that did nothing can look like it worked.)

**Switch category with focus + arrow keys, not clicks.** `Click` on a tree row returns `true` and does not move the selection — on the row *or* its inner text. The row does take **focus**, though, so this works:

```bash
npm run mcp -- call_tool '{…,"tool_name":"Click","arguments":{"ref":"<currently selected row>"}}'   # focus the tree
npm run mcp -- call_tool '{…,"tool_name":"PressKey","arguments":{"key":"Up"}}'                      # move the selection
```

Verify by re-snapshotting the pane and reading its header row. Expanding a group moves focus into the pane, so **re-click a tree row before the next arrow key**. A PowerShell `mouse_event` wheel over the pane does nothing — do not reach for it.

**Expand every collapsed sub-category first**, and note which ones ship collapsed: `Network Simulation`, `Server` and `Setup` under Tooling (User); `Editor Icon`, `Project`, `Severity` and `Ignored` under Tooling; `Cell (Defaults)` and `World Context` under World Assembly. An untouched panel shows a stack of group *names* and none of the values the page documents — worse than no screenshot, because it looks like the settings. Leave array properties (`6 Array elements`) collapsed.

**Group headers and struct rows open differently**, and this is the one that silently costs you content:

| Row | Opens with | Example |
| :-- | :-- | :-- |
| Group header | single `Click` on the row | `Assembly`, `Debug`, `Severity` |
| **Struct property** | **`Click` with `doubleClick: true`** | `World Collisions`, `Rotation Constraints` |

A struct row ignores a single click **and** the `Right` arrow, and exposes no child ref for its expander — so it reads as "cannot be expanded" when it simply needs a double-click. Getting this wrong on World Assembly's `World Collisions` hides six properties the page documents, including the landscape and mesh-terrain flags.

**The panel's nesting need not match the page's headings.** World Assembly's `Junction Matching`, `Tagging`, `Spawning` and `Junction Connecting` are all children of `Assembly` in the panel, though the page gives them sibling `###` headings — so collapsing `Assembly` collapses all four, and lifting `Junction Connecting` to the top means collapsing its *siblings* rather than the groups above `Assembly`. Read the indentation in the snapshot rather than inferring hierarchy from the page.

:::warning[Rows below the fold do not exist]

The pane virtualizes: anything scrolled past its bottom edge is absent from the widget tree, so a by-ref capture returns a **shorter section than the settings actually contain** and looks complete while doing it. Expanding `Server` on Tooling (User) rendered its first property and silently dropped the rest.

Cross-check the row count against the page's own tables. When the section genuinely will not fit — Tooling (User) needs ~987 logical px against a ~1010 px window — **split it along the page's headings** rather than shipping a clipped shot: one image per `###` section, each framed from its own header with nothing trailing. To lift a lower section to the top of the pane, collapse the groups above it; that is deterministic where scrolling is not, and worth a sentence on the page saying those groups open by default.

Two properties may also be missing legitimately: `EditConditionHides` hides them until another property makes them relevant. Say so on the page rather than changing the setting to reveal them — a `Config` property writes to the project's ini.

:::

**Size the window before framing.** The details splitter puts values at a fixed proportion of pane width, so an over-wide window just adds dead space — 1680 px wide gave ~950 px of empty column. A window of ~1225x1015 yields a ~1390 px pane, matching the existing settings captures (1441–1572 px). Resize by enumerating top-level windows for the title and calling `MoveWindow`; that works from this session even though screen capture does not.

The pane captures cleanly by ref (the `generic "List"` node), at exactly `size × 1.5`. Crop to a section using row `y` positions read from the snapshot, remembering they are absolute screen coordinates — subtract the pane's own `pos.y`.

### Record what you captured

Pass `--subject` and the image gets an entry in `scripts/screenshot-manifest.json`, stamped with the plugin-source commit at capture time:

```bash
npm run screenshot -- --in "$SCRATCH/shot.b64" --base64 --out static/assets/images/docs/<path>.webp \
  --subject "Cell category: the strip with Organ hidden, and the panel's tile, list, SELECTED ACTOR and QUICK OPTIONS groups" \
  --pages plugins/world-assembly/editor-mode/cell \
  --level /NexusWorldAssemblySamples/Cells/CELL_Simple_00 \
  --setup "Activate World Assembly mode; select the Cell rail." \
  --watch "WorldAssembly/Source/NexusWorldAssemblyEditor/Private/EdMode/NCellEdModeRail.cpp"
```

`--watch` is the part that earns its keep: `npm run audit:coverage` diffs those paths since the capture commit and reports the image as possibly stale. **Watch the `.cpp`, not just the header** — a rail's sections and their contents live in its implementation, so that is what invalidates the picture.

`--subject` is what triggers recording, so a quick throwaway capture stays out of the manifest. The file is deliberately partial: pre-existing images have no entry and gain one when next retaken.

:::warning[Git Bash mangles a leading slash]

`--level /NexusWorldAssemblySamples/…` arrives as `C:/Program Files/Git/NexusWorldAssemblySamples/…` — MSYS path conversion rewrites any argument that looks like a Unix path. Prefix the command with `MSYS_NO_PATHCONV=1`, or fix the value in the manifest afterwards.

:::

:::warning[Snapshot `pos` and `size` are in *different* units]

Verified against the live editor: **`pos` is already physical capture pixels, but `size` is logical** — so a widget's real extent is `pos` to `pos + size * 1.5` on this machine. Cropping `pos`→`pos+size` silently clips the right and bottom edges of every widget, which reads as "the screenshot cut off the content".

Sanity-check against a child: a combobox at `pos=1030 size=142` whose chevron child sits at `pos=1204` cannot be 142 physical pixels wide — 1030+142 = 1172 is left of its own chevron. 1030 + 142×1.5 = 1243 is consistent.

Screenshot by ref and the problem disappears entirely; only reach for a crop when you need several widgets in one image.

:::

:::warning[Widget geometry is not the visual box — measure the crop, don't derive it]

`pos`/`size` describe a widget's *content*, not the container drawn around it. The edit-mode strip reports its category checkboxes at `x=44`, but the rounded box behind them starts at `x=24` — 14px of container padding the snapshot never mentions. Derive a crop from the reported geometry and it comes out flush on one edge and padded on the other, which is exactly what a reader notices.

For any multi-widget crop, **measure the rendered bounds** from the capture: scan for the first and last row/column that differ from the background, then add the margin you want to all four sides. A `luminance > 8` test finds the box exactly against a black viewport. Over scene content that test saturates — take the horizontal extent from the same UI shot against a dark background instead, since the strip is pinned and the panel's x is fixed, so only the height changes between categories.

Restrict the scan to the band the subject occupies. Scanning a full viewport capture from `y=0` picks up the viewport toolbar and reports the content as spanning the entire width.

:::

:::warning[Positions move when the mode activates]

The **mode button hides once its mode is active** (`FIsActionButtonVisible` → `WorldAssemblyEdMode_CanShow`), and everything to its right shifts left by its width — the Quick Assembly combo sits at `1050` with the mode off and `1030` with it on.

So a crop box is only valid for the editor state the snapshot was taken in. Re-snapshot after **any** state change (activating the mode, loading a map, resizing a panel) and re-read the positions; do not reuse coordinates across a capture taken in a different state.

:::

## 3. Place

**Screenshots are never co-located with the page.** They live under `static/assets/images/docs/`, mirroring the page's path inside `docs/`:

| Page | Image |
|---|---|
| `docs/plugins/world-assembly/types/junction-component.md` | `static/assets/images/docs/plugins/world-assembly/types/<name>.webp` |

Two neighbouring trees are *not* this one, and putting a page screenshot in either is a mistake:

- `static/assets/images/plugins/<slug>-icon.webp` — plugin landing-card icons, referenced from the `Plugins` map
- `static/assets/svg/<slug>/` — plugin-branded type/overlay SVGs

## 4. Reference

Always **absolute**, never relative:

```markdown
![Alt text](/assets/images/docs/plugins/world-assembly/types/<name>.webp)
```

The docs are versioned: `docusaurus docs:version` copies the whole `docs/` tree, so a co-located image would be duplicated into every snapshot (~13 MB each) and a relative path would shift depth. Absolute paths into `static/` are stable across snapshots and shared by every version. Docusaurus still webpack-processes them, so content-hashing, lazy-loading, and automatic `width`/`height` all still work.

## Replacing an existing image

This is the part that bites. **`static/` is a single pool shared by every version**, so overwriting an image changes it retroactively in every archived version — including snapshots that documented different behaviour.

`scripts/screenshot.mjs` therefore **refuses to overwrite** unless you pass `--force` — and when you do, it **preserves the outgoing image for you**. For every archived version whose pages reference it, the old pixels are copied to `static/assets/images/docs/_archive/<version>/<same relative path>` and that version's references are repointed at the copy. The live path never changes, so `docs/` is untouched.

```
archived for 0.3.2: /assets/images/docs/_archive/0.3.2/plugins/.../world-collision-visualizer.webp (1 page repointed)
wrote static/assets/images/docs/plugins/.../world-collision-visualizer.webp (502x600, 15KB)
```

Nothing is duplicated until the moment it would otherwise become wrong: an image that is never replaced is already correct for every version, which is why this happens on replacement rather than by copying the pool at each version cut.

**`--no-archive` opts out**, and is right only when the *subject* did not change — the same panel shot sharper, or recropped. Then every version should get the better picture. If the UI itself changed, let it archive.

**Decide it by diffing, not by memory.** For a settings page the archived version's own property table is the evidence: if the set of documented properties is identical, the panel is unchanged and the better shot belongs to every version; if the live page has rows the archived one does not, the archived page would end up describing a picture it never documented.

```bash
diff <(grep -o '^| `[^`]*`' versioned_docs/version-<x>/plugins/<page>.md) \
     <(grep -o '^| `[^`]*`' docs/plugins/<page>.md)
```

Across the six settings pages this ran on, four came back identical (`--no-archive`) and two had genuinely gained properties (`--force`, archived) — a split you would not have guessed from how old the images looked.

**A third option is often better than either.** When the UI changed enough that the pages are being rewritten anyway, give the new captures **new filenames** and leave the old files alone. The archived version keeps its images with no `_archive` indirection at all. That is what the EdMode rework did: `mode-toolbar-*.webp` still serves 0.3.2 untouched, while dev uses `rail-*.webp`.

## Re-capturing after a UI change

When an editor-UI change invalidates a batch of shots:

1. **List what a plugin actually references.** Grep the pages rather than the folder — an orphaned file on disk is not a screenshot anyone sees:
   ```bash
   grep -rho "/assets/images/docs/plugins/<slug>/[^)]*" docs/plugins/<slug>/ | sort -u
   ```
2. **Re-capture each**, reusing the widget ref where the panel still exists.
3. **Decide archive-vs-overwrite per image**, using the test above. A UI change that prompted the refresh is exactly the case where archiving may be warranted for shipped versions.
4. **Verify refs resolve**: `npm run audit:coverage` checks every static asset reference against disk and flags `missing-asset` and `relative-asset`.

:::warning[A broken image path fails silently]

`onBrokenLinks: 'throw'` does **not** validate image sources. A bad path builds green and shows up only as a missing image in the browser. After any bulk image work, run the audit — do not trust a successful build.

:::

## Checklist

- [ ] **Looked at the image before saving it.** Convert with `--max-width 620` and read it back. Every framing fault in this repo's history was visible at a glance and shipped anyway because the crop maths "looked right"
- [ ] Subject framed deliberately: collapsed groups expanded, the section starting at the top edge, nothing trailing into the next one
- [ ] Captured by widget ref, not a cropped full-window shot, where the subject is UI
- [ ] Written as `.webp` under `static/assets/images/docs/` mirroring the page path
- [ ] Referenced absolutely, starting `/assets/images/docs/`
- [ ] Alt text describes the content, not "screenshot"
- [ ] If replacing: archive-vs-overwrite decided deliberately
- [ ] `npm run audit:coverage` clean for `missing-asset` / `relative-asset`
- [ ] Observer released with `Unobserve`
