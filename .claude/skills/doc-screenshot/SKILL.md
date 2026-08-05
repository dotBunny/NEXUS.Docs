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

## 2. Convert

```bash
npm run screenshot -- --in "$SCRATCH/shot.b64" --base64 --out static/assets/images/docs/<mirrored-path>/<name>.webp
```

`scripts/screenshot.mjs` decodes, optionally crops (`--crop x,y,w,h`), optionally downscales (`--max-width`), and writes `.webp`. Quality defaults to 90 because UI text shows lossy artefacts long before photographic content does; drop it for viewport shots, or pass `--lossless` if fine text still smears.

`--probe <file>` reports dimensions without writing, for when you do need to compute a crop.

:::warning[Snapshot coordinates are not capture pixels]

`Snapshot` reports logical DPI-scaled coordinates; the PNG is physical pixels — a 1.5x difference on this machine. A crop box derived from a widget's reported `pos`/`size` will be wrong unless scaled. Screenshot by ref and avoid the problem.

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

`scripts/screenshot.mjs` therefore **refuses to overwrite** unless you pass `--force`. That refusal is a prompt to decide which case you are in:

**The image is simply better** (sharper, larger, same subject) — overwrite with `--force`. Every version benefits.

**The old version needs its period-accurate image** — archive first:

1. Copy the outgoing file to `static/assets/images/docs/_archive/<version>/<same relative path>`
2. Repoint that one reference inside `versioned_docs/version-<version>/` to the `_archive` path
3. Overwrite the live file with `--force`

Only archive when the difference is *semantic* — the UI genuinely changed and the old page describes the old UI. Archiving every cosmetic refresh bloats `static/` for no reader benefit.

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

- [ ] Captured by widget ref, not a cropped full-window shot, where the subject is UI
- [ ] Written as `.webp` under `static/assets/images/docs/` mirroring the page path
- [ ] Referenced absolutely, starting `/assets/images/docs/`
- [ ] Alt text describes the content, not "screenshot"
- [ ] If replacing: archive-vs-overwrite decided deliberately
- [ ] `npm run audit:coverage` clean for `missing-asset` / `relative-asset`
- [ ] Observer released with `Unobserve`
