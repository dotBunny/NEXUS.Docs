---
name: doc-audit
description: Verify NEXUS documentation against the plugin source it describes, and fix what has drifted. Use when asked to audit doc coverage or accuracy, check whether pages still match the headers, investigate a suspected stale page, or after a release that changed public API. Also covers the housekeeping every doc edit needs (versioned snapshot sync, @see backlinks, DocsURL meta, audit baseline).
---

# doc-audit

Checking that the docs still describe the code, and repairing them where they don't.

Run `npm run audit:coverage` first. It automates every mechanically checkable claim and is the
fastest way to see where you stand.

```bash
npm run audit:coverage              # report; exits non-zero on findings new since the baseline
npm run audit:coverage -- --all     # include baselined findings
npm run audit:coverage -- --update  # re-snapshot the baseline after clearing work
```

The script lives at [scripts/audit-coverage.mjs](../../../scripts/audit-coverage.mjs) with its
accepted-state file at `scripts/coverage-baseline.json`. Plain Node ESM, zero dependencies. It needs
no build exclusion — Docusaurus only scans `docs/`, `community/`, and `versioned_docs/`, and `tsc`
ignores `.mjs`.

## The central lesson

**Name-level verification is worthless on its own.** A page can cite a real type, reference a real
header, and still describe neither correctly. The original audit of this repo gave every page a clean
bill of health because `TypeDetails type=` and `headerFile=` all resolved — while `toggle.md`
contradicted its header on five counts and `world-assembly-library.md` documented four functions that
did not exist.

So the checks that earn their keep compare **quoted code against the header**: enumerator names,
`enum` vs `enum class`, underlying type, function signatures. That is what the script does, and it is
the check that found every one of those defects.

## What actually goes wrong

Ranked by how much damage it does, from auditing all 163 pages of this repo:

1. **Behavioural inversions** — the page states the opposite of what the code does. Every instance
   found here was documentation that was *correct when written* and became wrong when the code
   improved: a gate narrowed, a guard was added, a default flipped back. This is the argument for
   `@see` backlinks — a header linking to its page gives whoever changes the behaviour a reason to
   open it.
2. **Absent families** — a whole coherent group of functions documented nowhere. Picker's containment
   predicates across 7 pages, Mersenne Twister state save/restore, ActorPools' default-settings
   registry, `UNDeveloperOverlay`'s entire world-binding contract.
3. **Editor-label mismatches** — docs say `Unbounded`, the property is `bUnbound` with no
   `DisplayName`, so the checkbox reads "Unbound" and nobody can find it.

**Property tables and defaults are reliable.** Across 163 pages, not one wrong default value. Do not
spend time re-verifying them; spend it on prose that asserts behaviour.

## False positives: assume the tool is wrong first

Roughly two-thirds of raw "missing function" hits are noise. Six distinct classes, all seen here:

| Class | Example |
| :-- | :-- |
| Locals inside inline bodies | `NonDeterministic`, `ReducedBounds`, `CenterCalc`, `RandomStream` |
| Cross-class calls | `FApp::GetBuildVersion`, `FPlatformMisc::BeginNamedEvent` |
| Display-name headings | `HasRemotePlayersExec` documented as "Has Remote Players ?" |
| `####`-level headings | `GetObjectSnapshotSummary` under `#### Get UObject Snapshot Summary` |
| Engine overrides | `OnRegister`, `Tick`, `GetPaletteCategory`, `Update`, `GetMouseCursor` |
| Macros | `TEXT`, `Printf` |

Engine-contract overrides are **correctly** undocumented — their meaning comes from the base class.
Documenting them is noise, not coverage.

Read every hit against the page before acting on it. Two mistakes made here from not doing that: a
`@param` "fix" applied to a comment that already existed (creating a duplicate), and an inflated
"23 types missing a comment" figure that was really 9.

## Parser pitfalls

Each of these produced false positives while the script was written. Do not "simplify" them away:

1. `_API` follows the keyword — `class NEXUSPICKER_API FNArcPicker`.
2. A declaration line ending in `;` is a forward declaration, not a definition.
3. Type prefixes include `A` (actors) and `H` (hit proxies), not just `U/F/I/E/S`.
4. Find the `)` that closes the parameter list. `lastIndexOf(')')` reaches into inline bodies and
   member-init lists — `: Seed(TaskSeed), Name(MoveTemp(TaskName)) {}`.
5. Strip inline JSX before slugifying a heading. `#### Get PlayerIdentifier<VersionBadge …/>`
   resolves to `get-playeridentifier`. This alone caused 6 false "broken anchor" reports.
6. A `#if` **and** a `//` comment can sit between a doc comment and the `#define` it documents.
7. **A reflection macro can wrap across lines.** `UCLASS(… HideCategories=(Tags, Activation,\n
   AssetUserData))` breaks any walk-up that assumes one intervening line. This bug inflated
   `missing-typedoc` from 9 to 23.
8. Build a known-symbol set from code with comments **stripped**. Including comment text makes the
   check circular — a symbol mentioned only in comments validates itself.
9. Exclude `Intermediate/` — it holds UHT-generated copies of every comment.
10. **Match `github-slugger` exactly: each space becomes its own `-`, runs are not collapsed.** A heading
    like `## Data Object — UNFoo` loses the em dash and keeps both surrounding spaces, so the real anchor
    is `data-object--unfoo` with a **double** hyphen. Collapsing whitespace here is worse than the other
    pitfalls because it produces a **false negative** — it silently accepts a wrong anchor. Fixing this
    one immediately surfaced two shipped `DocsURL` links that had been passing.

11. **An extension-less relative page link resolves URL-relative, not file-relative.** A non-index page
    `a/b.md` is served at `a/b/`, so `../c/` written on it means `a/c/` — one level shallower than a
    file-path reading gives. On its sibling `a/index.mdx` the identical text is correct. This means the
    same link text is right on an index page and wrong on a normal one, which is why it survives review.
    Prefer writing the explicit `.md`/`.mdx` extension, which Docusaurus resolves as a file path.

Pitfall 10 also found the cause: three headings on `dynamic-ref-subsystem.md` contained a literal **tab**
(`#### Remove Object\t(By Name)`). A tab is not a space, so no slugifier converts it — the anchor was
unreachable from any spelling. Strip tabs from headings; if the checker flags an anchor you are sure of,
run the heading through `cat -A` before assuming the tool is wrong.

## Do not rebuild member-comment coverage

An earlier version measured "% of public members with a doc comment" and reported ~79% with a list of
worst offenders. **The metric was withdrawn as unfit.** It undercounted badly — flagging a file with
20 doxygen blocks for 19 `UFUNCTION`s as 25% — and it counted framework overrides as gaps, so acting
on it would have produced dozens of pointless comments on engine contracts. It is deliberately absent
from the script.

## Three link mechanisms, not one

All three are validated by the script, anchors included:

| Mechanism | Where | Purpose |
| :-- | :-- | :-- |
| `@see <a href="…">Type</a>` | Header doc comment | Type → its page. Required by [coding-standard](../../../community/coding-standard.md). |
| `meta=(DocsURL="…#anchor")` | `UFUNCTION` | Blueprint node → its page section. Surfaces in-editor. |
| Relative markdown links | Pages | Page → page. |

`DocsURL` anchors are the slug of the `UFUNCTION`'s `DisplayName` — `"Add Object"` → `#add-object`.
Only add one when the anchor genuinely exists, or you ship a dead in-editor link. A page that
documents its API inside one code fence has no anchors to point at; give it per-function headings
first if you want those links.

## Housekeeping every doc edit needs

Miss any of these and the audit will tell you, but it is faster to just do them:

1. **Mirror into the versioned snapshot.** `docs/` only serves `/docs/dev/`. `versioned_docs/version-<x>/`
   is a separate copy and does not inherit fixes. Correcting a page means editing both — `cp` is fine
   when they were identical.
   - **Check whether the snapshot is period-accurate first.** Here it was cut *after* the code changed,
     so it had inherited the same errors and both needed the fix. If a snapshot correctly describes an
     older release, leave it alone.
   - Documenting a type that already shipped in the released version belongs in the snapshot too — that
     is filling a gap, not backdating.
2. **Add the `@see` backlink** for any header that gains a page.
3. **Add `DocsURL`** for any `UFUNCTION` whose page gained a matching section.
4. **Re-run the audit, then `--update` the baseline** once findings are genuinely cleared.

## Verifying a behavioural claim

The rule that caught the most: **trace it to the implementation, don't infer it from names.**

Cases where inference would have been wrong:
- `bForceSave` — read as "skip the no-change check?" Confirmed via `if (UpdateCell(...) || bForceSave)`.
- Tissue duplicate-merge — assumed "resolves to one entry"; the code merges only `AssemblyTags` and
  **discards** the duplicate's other constraints.
- Soft tissue pointers — assumed cells stay unloaded; `BuildTissueMap` calls `LoadSynchronous()` on
  the cell assets (their *levels* stay unloaded).
- `GetRemainingStatus` — component order and the meaning of zero both needed the relay's `.cpp`.
- Picker shell semantics — parameter names suggested it; confirmed via `insideOrOn(Max) && !inside(Min)`.

When a page and a header disagree, **the code decides** — but check which is wrong. Once here the page
was right and the header comment was wrong (`NDynamicRef.h` claimed slots held one object; they are
buckets).

## Related

- [doc-new-type](../doc-new-type/SKILL.md) — scaffolding a new type page.
- [doc-new-plugin](../doc-new-plugin/SKILL.md) — scaffolding a plugin folder.
- [CLAUDE.md](../../../CLAUDE.md) — conventions, versioning, static-asset rules.
