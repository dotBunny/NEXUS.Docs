# Findings Log — Docs Catch-up to NEXUS 0.4.0

Defects found while reconciling the docs against the NEXUS source (`dotBunny/NEXUS` at `7d4c16c`). Each
entry has a claim, the evidence, a way to reproduce it, and a status. **Nothing here has been independently
validated.** It is written so another agent can check each entry against the code without this session's
context.

Status values:

- **Open**: found and not fixed. It needs a decision or a behaviour change.
- **Fixed (comment)**: only a comment or metadata was wrong, and it has been corrected on branch
  `claude/gallant-gauss-j485dt`.
- **Documented**: the behaviour is left as-is and the docs now describe it accurately.

Severity is a first guess: **High** means data loss or wrong output, **Medium** a feature that doesn't work
as designed, **Low** a papercut or inconsistency.

## Source (dotBunny/NEXUS)

### S1. Texture Packer: composite suffixes are never decoded, so the decode branch in `DetectLayout` can't be reached

- **Severity:** Medium. **Status:** Open (docs describe the current behaviour).
- **Files:**
  - `Plugins/Tooling/Source/NexusToolingEditor/Private/TexturePacker/NTexturePackerUtils.cpp`: `SplitAssetName` (about lines 32–55) and `DetectLayout` (about lines 166–200).
  - `Plugins/Tooling/Source/NexusToolingEditor/Public/TexturePacker/NTexturePackerUtils.h`: the `DetectLayout` doc comment.
- **Claim:**
  - `DetectLayout` tries three things: a known layout suffix, then a single role suffix, then `DecomposeSuffixToRoles`. The header says `OutLayout` "Receives the matched layout, or one synthesized from a decomposed suffix".
  - The name is first split with `SplitAssetName`. That function only accepts the last token as a suffix if `FindRoleBySuffix` or `FindLayoutBySuffix` recognizes it. Otherwise it returns an empty `Suffix`, and `DetectLayout` returns `false` at `if (Parts.Suffix.IsEmpty()) return false;`.
  - So a composite suffix like `RMH` never reaches the decompose step. The only suffixes that get that far are already caught by the first two steps.
- **Consequence:**
  - `BuildAutoPackRequest` builds exactly these suffixes when no layout fits (`ComposeSuffixForRoles`). Pack roughness, metallic and height and you get `T_X_RMH`.
  - One-click **Unpack** can't read that texture back: it is skipped with *"Nothing in 'T_X_RMH' says what it holds"*. The window opens it on the custom layout.
  - The unit tests cover `DecomposeSuffixToRoles` directly (`NTexturePackerUtilsTests.cpp`, `…DecomposeSuffixToRoles_LongestFirst`), but there is no `DetectLayout` test for a composite name, so this path is untested.
- **Repro, as a test to add:**
  - `DetectLayout(*NewObject<UNTexturePackerSettings>(), TEXT("T_Rock_RMH"), Layout, Base)`
  - Expected: `true`, with R=Roughness, G=Metallic, B=Height.
  - Actual: `false`.
- **Suggested fix:**
  - In `SplitAssetName`, also accept a trailing token that `DecomposeSuffixToRoles` fully consumes.
  - Take care that `T_Rock_01`, a known-good negative, still comes back whole. `01` doesn't decompose, so it stays safe.

### S2. Texture Packer: unpacking a single-role texture proposes its own name, and overwriting it can throw data away

- **Severity:** Medium (High if someone ticks *Overwrite existing*). **Status:** Open (the docs warn about it).
- **Files:**
  - `NTexturePackerUtils.cpp`: `DetectLayout`, the single-role branch (about lines 180–189).
  - `NTexturePackerJob.cpp`: `BuildAutoUnpackRequest`, `ApplyRoleToOutput` and `Unpack`.
- **Claim:**
  - For a name ending in one role suffix (`T_Rock_BC`, `T_Rock_R`), `DetectLayout` builds a layout with **only `RedRole`** set to that role.
  - `BuildChannelRuns` then gives a single run of length **1** on red. `ApplyRoleToOutput` names it `BaseName + canonical suffix`, which is the source's own name when the source used the canonical suffix.
  - The comment in that branch says "an unpack of it is a no-op". It isn't. Two things happen:
    1. Without overwrite, the run errors with *"'T_Rock_BC' already exists"*. The one-click **Unpack** turns that into a skipped warning.
    2. With **Overwrite existing** ticked in the window, the source is overwritten with **only its red channel**. For an RGB base-color map that throws away G and B. The package is left dirty, so it can still be reverted, but it is a trap.
  - A related case is when the source used a *non-canonical* suffix (`T_Rock_Albedo`). Unpacking then writes `T_Rock_BC`, a one-channel copy of just the red channel, which is probably not what anyone wanted either.
- **Repro:**
  - Create an RGB texture `T_Test_BC`. Open it in the Texture Packer (Unpack), tick *Overwrite existing*, and click **Unpack**.
  - Its green and blue channels are now black.
- **Suggested fix:**
  - A texture with a single role suffix should either be refused ("holds one map already, nothing to unpack"), or be read as that role spanning **all** of its source channels (a run of `Length = channel count`).
  - Refusing is simpler and matches the comment's intent.

### S3. Texture Packer: `FNTexturePackerResult` says a failed run "leaves nothing behind", but an unpack can fail partway through

- **Severity:** Low. **Status:** Open (comment accuracy; the docs word it narrowly).
- **File:** `Plugins/Tooling/Source/NexusToolingEditor/Public/TexturePacker/NTexturePackerJob.h`, the doc comment on `FNTexturePackerResult::bSucceeded`.
- **Claim:**
  - `FNTexturePackerJob::Unpack` checks names and collisions **before** writing anything. That part is correct.
  - But it writes the outputs one after another, and returns on the first `CreateOrUpdateTexture` failure: a read-only file that can't be checked out, an invalid package path, or an existing non-texture asset under a later output's name.
  - Any outputs already written stay behind, created and dirty. The run still reports `bSucceeded = false`, and `Textures` is incomplete, so the caller doesn't learn about them.
- **Repro:**
  - Unpack a `_ORM` texture where `T_X_R` already exists as a *non-texture* asset (a material, say), with *Overwrite existing* on.
  - `T_X_AO` is written, then the run fails on `T_X_R`.
- **Suggested fix:** either roll back the outputs already written, or keep them in `OutResult.Textures` and correct the comment.

### S4. Texture Packer: the one-click actions ignore `Select Results`, and only report failures to the log

- **Severity:** Low. **Status:** Documented (it may be intentional).
- **File:** `Plugins/Tooling/Source/NexusToolingEditor/Private/TexturePacker/NTexturePackerAssetActions.cpp`, `ReportResult`.
- **Claim:**
  - `ReportResult` always selects the results, whatever `UNTexturePackerSettings::bSelectResults` says. The window panels do check the setting (`SNTexturePackerPackPanel.cpp` about line 726, `SNTexturePackerUnpackPanel.cpp` about line 822).
  - On failure it returns without doing anything, so the only sign of the error is `LogNexusToolingEditor`.
  - The setting's tooltip says "when a pack or unpack finishes", which reads as covering both paths.
- **Suggested fix:** respect the setting, or reword its tooltip to say it applies to the window only. Show an editor notification when a one-click action fails.

### S5. Texture Packer: the class comment on `UNTexturePackerLibrary` said any name-less run fails

- **Severity:** Low. **Status:** Fixed (comment).
- **File:** `Plugins/Tooling/Source/NexusToolingEditor/Public/TexturePacker/NTexturePackerLibrary.h`.
- **Claim:** It read "Where a name says nothing the run fails rather than guessing". That is true for unpack. `PackTextures` falls back to the order the textures were given in, with a warning (`BuildAutoPackRequest`, the `Chosen == nullptr` branch). The comment has been reworded.

### S6. Texture Packer: `@return` on a `void` function

- **Severity:** Low. **Status:** Fixed (comment).
- **File:** `NTexturePackerSettings.h`, `GetAllSuffixes`. Found by `npm run audit:coverage` (`void-return`).

### S7. `NBoneComponent.h` refers to a type that no longer exists

- **Severity:** Low. **Status:** Open (it will be fixed during the World Assembly pass).
- **File:** `Plugins/WorldAssembly/Source/NexusWorldAssembly/Public/Organ/NBoneComponent.h`, about line 103.
- **Claim:** The doc comment names `FNWorldCollisionCache`. The world-collision rework deleted that type (it was replaced by `FNWorldCollisionPool` and `FNOrganCollisionCache`). Found by the audit (`unknown-symbol`).

### S8. `ANNullGameMode` still describes itself as DETHOL's bootstrap

- **Severity:** Low. **Status:** Open (it will be fixed during the Core pass).
- **File:** `Plugins/Core/Source/NexusCore/Public/Framework/NNullGameMode.h`.
- **Claim:** The header comment says "DETHOL Bootstrap GameMode", which is left over from a game project, on a framework type.

### S9. Samples: `NexusMultiplayerSamples.uplugin` was out of date

- **Severity:** Low. **Status:** Fixed (metadata).
- **File:** `Samples/Multiplayer/NexusMultiplayerSamples.uplugin`.
- **Claim:**
  - It was on version `12` / `0.3.0`, while every other plugin is on `15` / `0.3.5`.
  - Its description named a "NEXUS: Multiplayer plugin" that doesn't exist.
  - Its `DocsURL` pointed at `/docs/ui/#samples`.
  - It has been realigned. The new description is based on the map's contents: `BP_NMultiplayer_TextRenderComponent` (replicated elapsed server time and ping) and `BP_NSamples_BouncyBall`.

### S10. World Assembly: empty `SupportURL`

- **Severity:** Low. **Status:** Fixed (metadata).
- **Files:** `Plugins/WorldAssembly/NexusWorldAssembly.uplugin` and `Samples/WorldAssembly/NexusWorldAssemblySamples.uplugin`. Both now use the issues URL that every other plugin uses.

### S11. Samples: possible duplicate DynamicRef maps

- **Severity:** Low. **Status:** Open. Not yet verified. Reported by an exploration pass, and not checked in this session.
- **Folder:** `Samples/DynamicRefs/`.
- **Claim:** Both `DEMO_NDynamicRef` and `DEMO_NDynamicRefs` exist, and so do `TESTS_NDynamicRef` and `TESTS_NDynamicRefs`. They may be leftovers from a rename.
- **To validate:** list the folder, and check what references each map (functional-test registration, docs, `DocsURL`s).

## Docs Tooling (dotBunny/NEXUS.Docs)

### D1. `audit:coverage` under-reports missing pages: its plugin-slug map is empty

- **Severity:** Medium: it hides coverage gaps. **Status:** Open (a fix is planned in this branch).
- **File:** `scripts/audit-coverage.mjs`, `pluginSlugs` (about line 179) and the `missing-page` fallback (about line 575).
- **Claim:**
  - `pluginSlugs` parses `src/components/PluginDetails/index.tsx` with a regex that expects `link: "/docs/plugins/<slug>/"`. Since the docs were flattened, the links read `link: "/docs/<slug>/"`, so the regex matches **nothing** and the map is empty.
  - In the missing-page fallback, `(!slug || pg.p.startsWith('plugins/${slug}/'))` then collapses to `true`. As a result, a header counts as documented if **any page in any plugin** mentions its primary type name.
  - The `startsWith('plugins/…')` prefix is also out of date. Even with the map fixed, it would need to be `${slug}/`.
- **Repro:**
  - `node -e` with the old regex over `index.tsx` gives 0 matches.
  - The same regex without `plugins/` gives all 9 plugins.
- **Expected effect of the fix:** some headers currently treated as covered will start showing up as `missing-page`. That is the tool working as designed.

### D2. Existing lint errors in `whats-new/world-assembly.md`

- **Severity:** Low. **Status:** Open (it will be fixed while that file is edited).
- **Claim:** There are two issues: MD012 (a double blank line at about line 22) and MD047 (no trailing newline). `whats-new/` is not in the default `lint:md` globs, so this only shows up when the file is linted explicitly. `whats-new/tooling.md` had the same MD047 problem, now fixed.
