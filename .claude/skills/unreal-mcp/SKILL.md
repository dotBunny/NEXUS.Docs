---
name: unreal-mcp
description: Drive the running NEXUS editor via Unreal's in-editor MCP server (ModelContextProtocol plugin + Toolset Registry) to inspect editor state or capture UI. Invoke whenever using, enabling, or deciding whether to use the unreal-mcp tools from this docs repo.
---

# Unreal MCP (driving the live editor)

Unreal's **ModelContextProtocol** plugin runs an MCP server *inside a running editor* and exposes editor capability as "toolsets". It talks to an editor process that is already open — it is not a way to edit assets or code on disk.

In this repository it exists for one reason: **capturing documentation screenshots**. See [doc-screenshot](../doc-screenshot/SKILL.md) for that workflow; this skill is the transport underneath it.

Paths (`___UEROOT___`, `___PROJECTROOT___`) resolve per [unreal-environment](../unreal-environment/SKILL.md).

## Wiring in this repo

- **Client config is committed.** `.mcp.json` points at `http://127.0.0.1:8010/mcp`.
- **Port 8010, not the engine default 8000.** `TestProject` sets `ServerPortNumber=8010` and `bAutoStartServer=True` in its per-user `EditorPerProjectUserSettings`. Do not "fix" 8010 to 8000.
- **Plugins enabled in `TestProject/NEXUS.uproject`:** `ModelContextProtocol`, `EditorToolset`, `SlateInspectorToolset`. `ToolsetRegistry` arrives transitively as a dependency of `ModelContextProtocol`.
- **Deliberately *not* `AllToolsets`.** This project enables the minimum that screenshots need. Anything else is a durable change to the framework repo — get the user's OK, do not enable a toolset on a hunch.

### The server only responds while an editor is open

If the tools error or `list_toolsets` returns nothing, the editor almost certainly is not running. Launch it (see [unreal-environment](../unreal-environment/SKILL.md)) rather than assuming the config is broken.

Toolsets register at editor startup (`PostEngineInit`). A running editor will not pick up newly-enabled toolset plugins — after any `.uproject` change, **restart the editor**.

## Calling it

The `mcp__unreal-mcp__*` tools only register if the editor was running when the Claude Code session started. When they are missing — the common case, since the editor is usually launched mid-session — use the committed helper:

```bash
npm run mcp -- list_toolsets
npm run mcp -- describe_toolset '{"toolset_name":"SlateInspectorToolset.SlateInspectorToolset"}'
npm run mcp -- call_tool '{"toolset_name":"...","tool_name":"...","arguments":{...}}'
```

`scripts/mcp.mjs` performs the full handshake (initialize → session id → `notifications/initialized` → `tools/call`), unwraps SSE framing, prints the tool payload, and **exits 1 when the editor is not reachable** — so it doubles as the liveness check. It only ever talks to `127.0.0.1`.

Prefer `npm run mcp --` over `node scripts/mcp.mjs`: `Bash(npm run *)` is already allowlisted, so it does not prompt.

### Discovery first

Tool names and schemas drift between engine builds. Introspect rather than trusting a cached list:

1. `list_toolsets` — what is registered right now
2. `describe_toolset` — tool names + input schemas
3. `call_tool` — invoke one

In `call_tool`, `tool_name` is the **short name with no toolset prefix** (`Screenshot`, not `SlateInspectorToolset.SlateInspectorToolset.Screenshot`).

## Field notes (verified 2026-08-05, UE 5.8)

Exercised against the live NEXUS editor. Reliable starting points, not gospel — re-discover on failure.

### Registered toolsets

The minimal set registers ~20 tool groups, of which these matter here:

| Toolset | Use |
|---|---|
| `SlateInspectorToolset.SlateInspectorToolset` | Editor UI: snapshot the widget tree, screenshot a widget, click/hover/type |
| `EditorToolset.EditorAppToolset` | Whole-window capture, viewport capture, asset thumbnails, PIE control, camera |
| `EditorToolset.LogsToolset` | Read the output log, set category verbosity |
| `editor_toolset.toolsets.scene.SceneTools` | Level contents, actor placement, level camera |
| `editor_toolset.toolsets.object.ObjectTools` | Read/write object and CDO properties |

### Capturing

Three capture routes, and picking the wrong one wastes a round trip:

| Want | Call | Returns |
|---|---|---|
| A panel, toolbar, menu, tooltip | `SlateInspectorToolset.Screenshot {ref}` | Exactly that widget, pixel-tight |
| The whole editor as the user sees it | `EditorAppToolset.CaptureEditorImage {}` | All visible windows composited by screen position |
| The 3D viewport | `EditorAppToolset.CaptureViewport {CaptureTransform, Annotations, bShowUI}` | Viewport; `bShowUI:false` (default) hides gizmos and selection outlines |
| An asset thumbnail | `EditorAppToolset.CaptureAssetImage {AssetPath}` | Rendered thumbnail |

All return `{"returnValue":{"mimeType":"image/png","data":"<base64>"}}`.

:::warning[Never print the base64]

A full-window capture is ~4.3 million base64 characters. Always redirect it to a file and report only the size — echoing it into the transcript burns the context window for no benefit.

:::

### Finding a widget ref

```
Windows {action:"list"}          → top-level windows
Observe {ref:"w1", maxDepth:12}  → returns an observer id; deep-walks that subtree
Snapshot {ref:"sp1", maxDepth:12} → the tree with [ref=...] tags
Unobserve {identifier:"observer_2"} → when finished
```

Gotchas, all hit in practice:

- **`Snapshot` right after `Observe` returns a shallow tree.** Observers walk their subtree on a ~100ms tick, so the refs are not there yet. Snapshot a child ref (the splitter, the panel) rather than re-snapshotting the window, or simply call again.
- **`ref:""` means "active window", and returns an *empty* image when the editor is not focused** — `{"mimeType":"","data":""}` with no error. If a capture comes back empty, that is why: pass an explicit ref instead of relying on focus.
- **Screenshotting by ref does not require focus**, which is what makes this usable while you work in another window.
- Refs stay valid across calls. You do not need to re-snapshot before every action.

### DPI: snapshot coordinates are not capture pixels

`Snapshot` reports **logical** (DPI-scaled) coordinates; the returned PNG is in **physical** pixels. On this machine the editor window snapshots as `2614x1396` and captures as `3921x2094` — a scale of **1.5**.

That matters only when deriving a crop box from widget positions. Multiply by the scale, and get the scale by dividing a captured window's width by its snapshot width rather than assuming 1.5. Better still: **screenshot the widget by ref and skip cropping entirely.**

### Interaction

`Click`, `Hover`, `Type`, `PressKey`, `SelectOption`, `FillForm`, `Drag` all take refs and drive Slate directly. `Hover` is what produces tooltip screenshots. Input goes through Slate event APIs, not the AutomationDriver, because that deadlocks when called from the game thread — which is where MCP calls execute.

### Timing

Calls execute **serially on the game thread**. A heavy call stalls the editor, and under load a "quick" read can land seconds after it was issued. Keep calls small.

## When to use it — and when not to

MCP mutates a **running editor's in-memory state**. In this repository the editor is a *rendering surface*, not a target:

**Good fits:** capturing UI and viewport imagery; reading live editor state to confirm a page describes reality; checking which panels or settings actually exist before documenting them.

**Do not use it for durable changes.** Nothing a docs task does should ever need saving in the editor. If you find yourself wanting to save an asset, set a property that persists, or edit a level, stop — that belongs in the framework repo with the user driving.

Rule of thumb: **if it would dirty the project, don't.** Take the picture and leave.

## Two skill systems — don't conflate them

`ToolsetRegistry.AgentSkillToolset` manages **Unreal AgentSkills** — UE assets under `/Game/Skills/`, an engine-side mechanism entirely unrelated to the Claude Code skills in `.claude/skills/`. Do not create one to satisfy a request for the other. `CreateSkill`/`UpdateSkill` are mutating and, per their own descriptions, need explicit user permission.

## Caveats

- **Experimental** — every toolset here is `IsExperimentalVersion`; names and schemas change between engine builds.
- **Editor-only** — toolsets do not exist in cooked builds.
- **Loopback, no auth** — binds `127.0.0.1:8010` with no authentication. Fine locally; never expose it off the machine.
