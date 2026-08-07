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

### World Assembly: the level decides which rails are live

Each toolkit rail is gated on its own predicate (`FNWorldAssemblyEdModeRail::GetEnabled`), so capturing from the wrong level yields greyed-out buttons. Two sample levels cover all four:

| Level | Package path | Live |
|---|---|---|
| `DEMO_NWorldAssembly` | `/NexusWorldAssemblySamples/DEMO_NWorldAssembly` | **World**, **Organ**, and the Quick Assembly toolbar controls |
| `CELL_Simple_00` | `/NexusWorldAssemblySamples/Cells/CELL_Simple_00` | **World**, **Cell**, **Junction** |

Open one with `EditorAppToolset.OpenEditorForAsset`. **Loading a map drops the edit mode**, so re-activate it (the toolbar button) after every level change.

Quick Assembly needs an *organ* specifically — it collapses in a cell-only level, which is why its capture comes from the demo level.

:::warning[The mode panel is not walkable]

`FCategoryDrivenContentBuilderBase` wraps the panel in an `SInvalidationPanel`, and the inspector cannot see inside it: `Snapshot` on the panel returns the splitter and nothing else, so **there are no refs for the rail buttons or their commands**.

Screenshotting the panel *by ref* works fine — it is only the tree walk that comes back empty. To change rails you therefore need a real mouse click at screen coordinates. Calibrate against a click you can verify rather than deriving from snapshot geometry (see the DPI warning below): click, re-capture the panel, see which rail lit up, adjust.

:::

## 2. Convert

```bash
npm run screenshot -- --in "$SCRATCH/shot.b64" --base64 --out static/assets/images/docs/<mirrored-path>/<name>.webp
```

`scripts/screenshot.mjs` decodes, optionally crops (`--crop x,y,w,h`), optionally downscales (`--max-width`), and writes `.webp`. Quality defaults to 90 because UI text shows lossy artefacts long before photographic content does; drop it for viewport shots, or pass `--lossless` if fine text still smears.

`--probe <file>` reports dimensions without writing, for when you do need to compute a crop.

### Settings panels

Both `Edit > Editor Preferences` and `Project Settings` render **every section into one long scrolling pane**. Two consequences, both of which produce a bad screenshot if you miss them:

**Selecting in the left tree neither filters nor scrolls the pane.** Clicking `Tooling` leaves the pane exactly where it was, still showing `Core` at the top. The tree is navigation for a human eye, not a state change you can capture. Scroll the pane itself — mouse wheel over it, since it has no ref-driven scroll:

```powershell
# The pane belongs to a secondary window, so get that window's rect first.
# Get-Process ... MainWindowHandle is unreliable here — it can return a popup.
# Enumerate instead and match on title, then wheel over a point inside the pane.
[S]::SetCursorPos($x, $y); [S]::mouse_event(0x0800, 0, 0, -120, [IntPtr]::Zero)   # one notch down
```

**Frame the section with its header at the top of the pane.** Scroll until the whole section fits below its own title. A capture that starts halfway down a section, or that trails into the next one, reads as an accident — and the reader cannot tell where the section they came for begins and ends.

**Expand every collapsed sub-category first.** Settings groups default to collapsed, so an untouched panel shows a stack of group *names* — `Editor Icon`, `Project`, `Validators`, `Severity` — and none of the values the page documents. That screenshot is worse than none: it looks like the settings, while showing nothing a reader can act on. Expand the groups, then scroll to frame, then capture.

The pane captures cleanly by ref (the `generic "List"` node), at exactly `size × 1.5`.

### Record what you captured

Pass `--subject` and the image gets an entry in `scripts/screenshot-manifest.json`, stamped with the plugin-source commit at capture time:

```bash
npm run screenshot -- --in "$SCRATCH/shot.b64" --base64 --out static/assets/images/docs/<path>.webp \
  --subject "Cell rail: Tools, Calculate, Tagging, Actions and Quick Options sections" \
  --pages plugins/world-assembly/editor-mode/cell \
  --level /NexusWorldAssemblySamples/Cells/CELL_Simple_00 \
  --setup "Activate World Assembly mode; select the Cell rail." \
  --watch "WorldAssembly/Source/NexusWorldAssemblyEditor/Private/Rails/NWorldAssemblyEdModeCellRail.cpp"
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
