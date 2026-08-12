---
name: unreal-environment
description: Locate the NEXUS framework source, the TestProject, and the installed Unreal Engine from this docs repo, and launch the editor. Invoke whenever a task needs the plugin source beyond reading headers, needs a running editor (screenshots, MCP), or reports that an engine/project path could not be found.
---

# Unreal Environment (finding the source, project, and engine)

This is a **documentation** repository. It contains no Unreal project and no engine. Anything beyond reading headers — launching the editor, taking a screenshot, driving [MCP](../unreal-mcp/SKILL.md) — needs three paths resolved first.

Resolve them in this order; each is cheap and cached.

## The three paths

| Placeholder | What it is | How to resolve |
|---|---|---|
| `___NEXUSROOT___` | The framework repo (plugins, samples, test project) | `../NEXUS` relative to this repo. Already granted in `.claude/settings.json` via `additionalDirectories`. |
| `___PROJECTROOT___` | The UE project that hosts the plugins | `___NEXUSROOT___/TestProject` — contains `NEXUS.uproject` |
| `___UEROOT___` | The installed engine | Cache file first, then probe — see below |

`___NEXUSROOT___` needs no discovery: CLAUDE.md already names it as the source of truth for type pages, and the working tree is beside it. Only fall back to `https://github.com/dotBunny/NEXUS` if the local checkout is genuinely absent.

## Resolving `___UEROOT___`

**Cache file first.** Read `.claude/local-memory/ueroot` in this repo. If it names a directory containing `Engine/Build/BatchFiles/Build.bat`, use it and stop.

If absent or stale, probe in this order and save the first hit:

```
C:\UE\UE_5.8
D:\UE\UE_5.8
E:\UE\UE_5.8
D:\EGS\UE_5.8
```

```bash
mkdir -p .claude/local-memory && echo "E:/UE/UE_5.8" > .claude/local-memory/ueroot
```

The file is gitignored — it is a per-machine fact, not a repo fact.

:::note[Why probe rather than hardcode]

More than one engine is usually installed. This machine has `E:/UE/UE_5.8`, `E:/UE/UE_5.7`, and `C:/Program Files/Epic Games/UE_5.6`. `TestProject/NEXUS.uproject` declares `"EngineAssociation": "5.8"`, so **only 5.8 is correct** — an older root will fail to open the project or, worse, silently upgrade assets.

:::

This mirrors `___NEXUSROOT___/TestProject/.claude/local-memory/ueroot`, which the framework repo's own skills use. If that file exists and this one does not, copy the value across rather than re-probing.

Derived paths, once resolved:

| Need | Path |
|---|---|
| Editor | `___UEROOT___\Engine\Binaries\Win64\UnrealEditor.exe` |
| Editor (commandlets) | `___UEROOT___\Engine\Binaries\Win64\UnrealEditor-Cmd.exe` |
| Build | `___UEROOT___\Engine\Build\BatchFiles\Build.bat` |

## Launching the editor

Screenshot and MCP work both need a **running editor with the project open**:

```powershell
& "___UEROOT___\Engine\Binaries\Win64\UnrealEditor.exe" `
    "___PROJECTROOT___\NEXUS.uproject" -ModelContextProtocolStartServer
```

`-ModelContextProtocolStartServer` starts the in-editor MCP server at launch. It is belt-and-braces: this project already sets `bAutoStartServer=True` in its per-user config, but that is a *per-user* file (`EditorPerProjectUserSettings`) that no one else inherits, so the flag is what makes the command work on a fresh machine.

Startup takes a while. Do not conclude the server is broken until the editor window is actually up — [unreal-mcp](../unreal-mcp/SKILL.md) covers how to check.

## Do not build from here

Building the framework is the **framework repo's** job, and it has its own `build` skill at `___NEXUSROOT___/TestProject/.claude/skills/build/`. Compiling plugins in service of a docs change is almost always the wrong move: type pages are written from headers, which are read, not built.

The exception is a screenshot of behaviour that only exists in unbuilt source. If you hit that, say so and let the user build — do not kick off a compile from the docs repo.

### Check the binaries before capturing, not after

That exception is common enough to test for rather than discover in a finished screenshot. Compare the built editor DLL's timestamp against the commits that should be in it:

```bash
stat -c '%y' ../NEXUS/TestProject/Binaries/Win64/UnrealEditor-<Plugin>Editor.dll
cd ../NEXUS && git log --format='%h %ci %s' -10
```

A DLL older than the newest commit touching that module means the editor renders the *previous* UI, and every screenshot taken from it is wrong the moment the user next builds — the expensive kind of wrong, because it looks right.

Three things make this easy to get wrong:

- **Plugin DLLs live in `TestProject/Binaries/Win64/`**, not under the plugin's own folder.
- **An editor-UI change usually spans two modules** — the plugin's own editor module and shared widgets in `NexusUIEditor` — so check both; they are often built at different times.
- **Source file mtimes are worthless here.** They reflect checkout time, not edit time. Compare against commit dates.

Report the gap and name the commits the build is missing. Building is the user's call, and if they ask for it, the recipe is `Build.bat NEXUSEditor Win64 Development` from the framework's `build` skill — invoked through PowerShell, since `cmd //c` from Git Bash mangles the quoting and `| tee` will then hide the failure behind exit code 0.
