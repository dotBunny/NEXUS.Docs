#!/usr/bin/env node
/**
 * audit-coverage.mjs — checks the docs in this repo against the plugin source they describe.
 *
 *   npm run audit:coverage                 report, exit non-zero on findings new since the baseline
 *   npm run audit:coverage -- --all        list every finding, including baselined ones
 *   npm run audit:coverage -- --update     rewrite the baseline from the current state
 *
 * The source tree defaults to ../NEXUS/Plugins; override with NEXUS_PLUGINS=<path>.
 *
 * Checks, most valuable first:
 *   doc-code-mismatch  code quoted in a page vs the header it cites (enumerators, enum kind,
 *                      underlying type, function names). This is the class of error that
 *                      name-level checks cannot see -- a page can cite a real type and real
 *                      header and still describe neither correctly.
 *   broken-link        @see backlinks, UFUNCTION DocsURL meta, and page-to-page links, all
 *                      validated including #anchors.
 *   stale-param        @param naming a parameter the signature does not have.
 *   void-return        @return documented on a void function.
 *   unknown-symbol     a doc comment naming an N* symbol or header that does not exist.
 *   missing-page       a public header with no documentation.
 *   missing-typedoc    a declared type with no doc comment.
 *   missing-backlink   a documented header with no @see link back to its page.
 *   stale-typedetails  TypeDetails type=/headerFile= that no longer resolves.
 *
 * Parser notes -- each of these produced false positives while this was being written, so
 * don't "simplify" them away:
 *   1. _API follows the keyword: `class NEXUSPICKER_API FNArcPicker`.
 *   2. A declaration line ending in `;` is a forward declaration, not a definition.
 *   3. Type prefixes include A (actors) and H (hit proxies), not just U/F/I/E/S.
 *   4. Find the `)` that closes the parameter list. `lastIndexOf(')')` reaches into inline
 *      bodies and member-init lists, e.g. `: Seed(TaskSeed), Name(MoveTemp(TaskName)) {}`.
 *   5. Strip inline JSX before slugifying a heading: `#### Get PlayerIdentifier<VersionBadge …/>`
 *      resolves to `get-playeridentifier`.
 *   6. A `#if` can sit between a doc comment and the `#define` it documents.
 *   7. Build the known-symbol set from code with comments stripped. Including comment text makes
 *      the check circular -- a symbol mentioned only in comments validates itself.
 *   8. Skip Intermediate/ -- it holds UHT-generated copies of every comment.
 *   9. A reflection macro can wrap across lines, e.g. `UCLASS(… HideCategories=(Tags, Activation,\n
 *      AssetUserData))`. Any walk-up that assumes one intervening line under-reports doc comments.
 *  10. Match github-slugger exactly: each space becomes its own '-', runs are NOT collapsed. A
 *      heading `## Data Object — UNFoo` yields `data-object--unfoo`, with a DOUBLE hyphen. Collapsing
 *      here is a false NEGATIVE -- it silently accepts a wrong anchor.
 *  11. Extension-less relative page links resolve URL-relative, not file-relative. See the note at
 *      the check itself; index vs non-index pages need different `../` depth for the same target.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const SRC = process.env.NEXUS_PLUGINS
  ? path.resolve(process.env.NEXUS_PLUGINS)
  : path.resolve(ROOT, '..', 'NEXUS', 'Plugins');
const BASELINE = path.join(ROOT, 'scripts', 'coverage-baseline.json');

const args = new Set(process.argv.slice(2));
const SHOW_ALL = args.has('--all');
const UPDATE = args.has('--update') || args.has('--update-baseline');

if (!fs.existsSync(SRC)) {
  console.error(`Plugin source not found at ${SRC}\nSet NEXUS_PLUGINS to the Plugins folder.`);
  process.exit(2);
}

/* ---------------------------------------------------------------- helpers */

const SKIP_DIRS = /^(Intermediate|Binaries|Saved|DerivedDataCache|\.git|node_modules|build)$/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.test(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else out.push(path.join(dir, e.name));
  }
  return out;
}

const rel = (base, f) => path.relative(base, f).replace(/\\/g, '/');
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');

// Docusaurus heading -> anchor. Note pitfall 5.
function slugify(h) {
  const explicit = h.match(/\{#([^}]+)\}\s*$/);
  if (explicit) return explicit[1];
  return h
    .replace(/<[^>]*\/>/g, '').replace(/<[^>]+>/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim().toLowerCase()
    .replace(/[^\w\s-]/g, '')
    // Pitfall 10: github-slugger maps each space to its own '-'; it does NOT collapse runs. A heading
    // like "Data Object — UNFoo" loses the dash and keeps both surrounding spaces, so the real anchor is
    // "data-object--unfoo" with a DOUBLE hyphen. Collapsing here silently accepts the wrong anchor.
    .replace(/ /g, '-');
}

function splitTopLevel(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if ('<([{'.includes(ch)) depth++;
    else if ('>)]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}

// Pitfall 4.
function closingParen(s, open) {
  let d = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '(') d++;
    else if (s[i] === ')' && --d === 0) return i;
  }
  return -1;
}

function paramName(frag) {
  let s = frag.replace(/=[\s\S]*$/, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  if (!s || s === 'void' || s === '...') return null;
  s = s.replace(/\[\s*\d*\s*\]$/, '').trim();
  const m = s.match(/([A-Za-z_][A-Za-z0-9_]*)\s*$/);
  if (!m) return null;
  if (!s.slice(0, m.index).trim()) return null;  // type with no name
  return m[1];
}

/* ------------------------------------------------------------- docs index */

const docFiles = walk(DOCS).filter(f => /\.mdx?$/.test(f));

/** slug -> docs folder, parsed from the canonical Plugins map so a new plugin needs no edit here. */
const pluginSlugs = (() => {
  const map = new Map();
  const tsx = path.join(ROOT, 'src', 'components', 'PluginDetails', 'index.tsx');
  if (!fs.existsSync(tsx)) return map;
  const t = fs.readFileSync(tsx, 'utf8');
  for (const m of t.matchAll(/moduleName:\s*"([^"]+)"[\s\S]*?link:\s*"\/docs\/plugins\/([^/"]+)\//g)) {
    map.set(m[1], m[2]);
  }
  return map;
})();

const pages = docFiles.map(f => {
  const p = rel(DOCS, f);
  const text = fs.readFileSync(f, 'utf8');
  const body = text.replace(/^---[\s\S]*?\n---\n/, '');
  const anchors = new Set();
  for (const m of body.matchAll(/^#{1,6}\s+(.+)$/gm)) anchors.add(slugify(m[1]));
  const typeDetails = [...text.matchAll(/<TypeDetails\b([^>]*)>/gs)].map(m => {
    const attrs = {};
    for (const a of m[1].matchAll(/(\w+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    return attrs;
  });
  const fences = [...text.matchAll(/```cpp[^\n]*\n([\s\S]*?)```/g)].map(m => m[1]);
  return { p, text, body, anchors, typeDetails, fences, urlPath: p.replace(/\.mdx?$/, '').replace(/\/index$/, '') };
});

const pageByUrl = new Map(pages.map(pg => [pg.urlPath, pg]));
const pageByFile = new Map(pages.map(pg => [pg.p, pg]));

/** module-relative header path -> pages that document it */
const pagesForHeader = new Map();
for (const pg of pages) {
  for (const td of pg.typeDetails) {
    if (!td.headerFile) continue;
    if (!pagesForHeader.has(td.headerFile)) pagesForHeader.set(td.headerFile, []);
    pagesForHeader.get(td.headerFile).push(pg);
  }
}
const typesInTypeDetails = new Set();
for (const pg of pages) {
  for (const td of pg.typeDetails) {
    for (const n of (td.type || '').split(/[,\s|/]+/).filter(Boolean)) typesInTypeDetails.add(n);
    for (const n of (td.typeExtra || '').split(/[,\s|/]+/).filter(Boolean)) typesInTypeDetails.add(n);
  }
}

/* ----------------------------------------------------------- source index */

const srcFiles = walk(SRC).filter(f => /\.(h|cpp)$/.test(f));
const headerFiles = srcFiles.filter(f => f.endsWith('.h') && rel(SRC, f).includes('/Public/'));

const codeBlob = srcFiles.map(f => stripComments(fs.readFileSync(f, 'utf8'))).join('\n'); // pitfall 7
const knownSymbols = new Set();
for (const m of codeBlob.matchAll(/\b([A-Z][A-Za-z0-9_]{2,})\b/g)) knownSymbols.add(m[1]);
const srcBasenames = new Set(srcFiles.map(f => path.basename(f)));
const functionsInSource = new Set();
for (const m of codeBlob.matchAll(/\b([A-Za-z_]\w*)\s*\(/g)) functionsInSource.add(m[1]);

const DECL_RE = /^(class|struct|enum class|enum)\s+(?:[A-Z0-9_]+_API\s+)?([A-Z][A-Za-z0-9_]+)/; // pitfalls 1,3
const MACRO_LEAD = /^\s*(UFUNCTION|UPROPERTY|UDELEGATE|UENUM|USTRUCT|UCLASS|UINTERFACE|UE_DEPRECATED|UE_NODISCARD|N_[A-Z_]+)\s*\(/;

/** Advance past blank lines and complete reflection-macro invocations. Pitfall 6 handled by caller. */
function skipToDeclaration(lines, from) {
  let j = from;
  for (;;) {
    while (j < lines.length && lines[j].trim() === '') j++;
    if (j < lines.length && MACRO_LEAD.test(lines[j])) {
      let d = 0, seen = false;
      while (j < lines.length) {
        for (const ch of lines[j]) { if (ch === '(') { d++; seen = true; } else if (ch === ')') d--; }
        j++;
        if (seen && d <= 0) break;
      }
      continue;
    }
    return j;
  }
}

const headers = headerFiles.map(f => {
  const r = rel(SRC, f);
  const [pluginDir, , moduleName] = r.split('/');
  const modulePath = r.replace(/^[^/]+\/Source\//, '');
  const raw = fs.readFileSync(f, 'utf8').replace(/^﻿/, '');
  const lines = raw.split(/\r?\n/);

  const decls = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(DECL_RE);
    if (!m) continue;
    if (/;\s*$/.test(lines[i])) continue;                     // pitfall 2
    // Walk upward for the doc comment. A reflection macro sits between it and the declaration and can
    // wrap across lines (HideCategories=(...)), and a // pragma comment can sit in between too — so
    // scan rather than assuming a single intervening line.
    let macro = null, hasDoc = false;
    for (let k = i - 1; k >= 0 && k > i - 16; k--) {
      const t = lines[k].trim();
      if (t === '') continue;
      const mm = t.match(/^(UCLASS|USTRUCT|UENUM|UINTERFACE)\s*\(/);
      if (mm) { macro = mm[1]; continue; }
      if (/\*\/$/.test(t) || /^\/\/\//.test(t)) { hasDoc = true; break; }
      if (/^\/\//.test(t)) continue;                       // pragma / ReSharper line
      if (/[,(]$/.test(t) || /^[A-Za-z_]\w*\s*=/.test(t) || /\)\)?$/.test(t)) continue; // macro continuation
      break;                                                // unrelated code
    }
    // Base class, if declared. The declaration can wrap, so read forward to the opening brace.
    let head = '';
    for (let k = i; k < lines.length && k < i + 6; k++) {
      head += (head ? ' ' : '') + lines[k];
      if (/[{]/.test(lines[k])) break;
    }
    const bm = head.match(/:\s*public\s+([A-Za-z_][\w:<>,\s]*)/);
    const base = bm ? bm[1].split(/[,{]/)[0].trim() : null;
    decls.push({ name: m[2], kind: macro || m[1], hasDoc, base, line: i + 1 });
  }

  const isTestModule = /Tests$/.test(moduleName || '');
  const isMacroHeader = /Macros\.h$/.test(r) || (decls.length === 0 && /^\s*#\s*define\s+N_/m.test(raw));
  const skip = isTestModule || isMacroHeader || /Minimal\.h$/.test(r) || /Module\.h$/.test(r);

  return { file: f, rel: r, pluginDir, moduleName, modulePath, raw, lines, decls, skip, isMacroHeader };
});

const headerByModulePath = new Map(headers.map(h => [h.modulePath, h]));

/* ------------------------------------------------------------- findings */

const findings = [];
const add = (check, file, key, message, line) => findings.push({ check, file, key: `${check}|${file}|${key}`, message, line });

/* 1. code quoted in a page vs the header it cites */
const CPP_NOISE = new Set(['if', 'else', 'for', 'while', 'return', 'switch', 'case', 'default', 'break',
  'const', 'static', 'virtual', 'override', 'final', 'class', 'struct', 'enum', 'public', 'private',
  'protected', 'void', 'bool', 'true', 'false', 'nullptr', 'template', 'typename', 'using', 'namespace',
  'inline', 'constexpr', 'explicit', 'friend', 'operator', 'this', 'sizeof', 'auto', 'UMETA', 'UENUM',
  'USTRUCT', 'UCLASS', 'UINTERFACE', 'UFUNCTION', 'UPROPERTY', 'GENERATED_BODY', 'TEXT']);

for (const pg of pages) {
  for (const td of pg.typeDetails) {
    if (!td.headerFile) continue;
    const h = headerByModulePath.get(td.headerFile);
    if (!h) { add('stale-typedetails', pg.p, `headerFile:${td.headerFile}`, `headerFile="${td.headerFile}" does not exist on disk`); continue; }
    for (const n of (td.type || '').split(/[,\s|/]+/).filter(Boolean)) {
      if (!knownSymbols.has(n)) add('stale-typedetails', pg.p, `type:${n}`, `TypeDetails type="${n}" not found in source`);
    }

    // base= against the real base class. Pages use generic words (struct/enum/interface/class) for
    // types with no engine base, so only compare when the header actually declares one.
    const GENERIC = new Set(['struct', 'enum', 'interface', 'class', 'namespace', 'native', '']);
    const primary = (td.type || '').split(/[,\s|/]+/).filter(Boolean)[0];
    const decl = primary && h.decls.find(d => d.name === primary);
    if (decl && decl.base && td.base && !GENERIC.has(td.base.toLowerCase()) && td.base !== decl.base) {
      add('base-mismatch', pg.p, `base:${primary}`,
        `${primary}: page says base="${td.base}", header declares ": public ${decl.base}"`);
    }
    // No explicit base means the page should use the generic word for the declaration's kind.
    // `UEnum` / `UStruct` are reflection metaclasses, never base classes.
    if (decl && !decl.base && td.base) {
      // An IN* class is the implementation half of a UINTERFACE pair: it declares no base, but the
      // UN* companion in the same header carries the UINTERFACE macro. Those pages are interfaces.
      const isInterfaceHalf = /^IN/.test(primary) && h.decls.some(d => /UINTERFACE/.test(d.kind));
      const expected = isInterfaceHalf ? 'interface'
        : /USTRUCT|^struct$/.test(decl.kind) ? 'struct'
        : /UENUM|^enum/.test(decl.kind) ? 'enum'
        : /UINTERFACE/.test(decl.kind) ? 'interface'
        : 'class';
      if (td.base.toLowerCase() !== expected) {
        add('base-mismatch', pg.p, `base:${primary}`,
          `${primary} is declared as ${decl.kind} with no base class, so base should be "${expected}", not "${td.base}"`);
      }
    }

    for (const code of pg.fences) {
      // enum kind + underlying type
      for (const dm of code.matchAll(/\benum\s+(class\s+)?([A-Za-z_]\w*)\s*:\s*(\w+)/g)) {
        const [, isClass, name, under] = dm;
        const hm = h.raw.match(new RegExp(`enum\\s+(class\\s+)?${name}\\s*:\\s*(\\w+)`));
        if (!hm) continue;
        if (!!isClass !== !!hm[1]) {
          add('doc-code-mismatch', pg.p, `enumkind:${name}`,
            `${name}: page says "${isClass ? 'enum class' : 'enum'}", header says "${hm[1] ? 'enum class' : 'enum'}"`);
        }
        if (under !== hm[2]) {
          add('doc-code-mismatch', pg.p, `enumtype:${name}`, `${name}: page says ":${under}", header says ":${hm[2]}"`);
        }
      }
      // enumerators
      for (const line of code.split('\n')) {
        const em = line.match(/^\s*([A-Za-z_]\w*)\s*(?:=\s*[-\w]+)?\s*(?:UMETA|,|$)/);
        if (!em || !/=|UMETA/.test(line) || CPP_NOISE.has(em[1])) continue;
        if (!new RegExp(`\\b${em[1]}\\b`).test(h.raw)) {
          add('doc-code-mismatch', pg.p, `enumerator:${em[1]}`, `enumerator \`${em[1]}\` is not in ${td.headerFile}`);
        }
      }
      // quoted function declarations
      for (const fm of code.matchAll(/^\s*(?:static\s+|virtual\s+|FORCEINLINE\s+|inline\s+)*[A-Za-z_][\w:<>,*&\s]*?\b([A-Za-z_]\w*)\s*\([^)]*\)\s*(?:const)?\s*;/gm)) {
        const fn = fm[1];
        if (CPP_NOISE.has(fn)) continue;
        if (new RegExp(`\\b${fn}\\s*\\(`).test(h.raw)) continue;
        // Cross-module references are legitimate (a page may document a helper that lives
        // elsewhere), so only flag a name that exists nowhere in the source tree.
        if (!functionsInSource.has(fn)) {
          add('doc-code-mismatch', pg.p, `function:${fn}`, `\`${fn}()\` is not in ${td.headerFile} or anywhere in the source`);
        }
      }
    }
  }
}

/* 2a. links from source: @see and DocsURL */
function checkSourceUrl(fileRel, kind, url, line) {
  const [p, frag] = url.split('#');
  const key = p.replace(/^https?:\/\/nexus-framework\.com\/docs\/?/, '').replace(/\/+$/, '').replace(/^dev\//, '');
  const pg = pageByUrl.get(key);
  if (!pg) { add('broken-link', fileRel, `${kind}:${url}`, `${kind} target page not found: ${url}`, line); return; }
  if (frag && !pg.anchors.has(frag)) add('broken-link', fileRel, `${kind}:${url}`, `${kind} anchor #${frag} not on ${key}`, line);
}
for (const f of srcFiles) {
  const r = rel(SRC, f);
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((L, i) => {
    for (const m of L.matchAll(/@see\s*<a href="(https:\/\/nexus-framework\.com[^"]+)"/g)) checkSourceUrl(r, '@see', m[1], i + 1);
    for (const m of L.matchAll(/DocsURL\s*=\s*"([^"]+)"/g)) checkSourceUrl(r, 'DocsURL', m[1], i + 1);
  });
}

/* 2b. page-to-page links and anchors, plus static asset references.
 *
 * onBrokenLinks:'throw' already covers page links at build time, but onBrokenAnchors only warns
 * and image sources are not validated at all -- a bad image path fails silently and only shows up
 * as a missing image in the browser. Both are worth catching here. */
const STATIC = path.join(ROOT, 'static');
const ASSET_RE = /\.(webp|png|jpe?g|gif|svg|mp4|webm|pdf)$/i;

/** Resolve a docs link target to a page, or null. */
function resolvePage(pg, rawPath) {
  let base;
  if (rawPath.startsWith('/docs/')) base = rawPath.slice('/docs/'.length);
  else if (rawPath.startsWith('/')) return undefined;       // /community/, site root, etc.
  else base = path.posix.normalize(path.posix.join(path.posix.dirname(pg.p), rawPath));
  base = base.replace(/\/+$/, '');
  const noExt = base.replace(/\.mdx?$/, '');
  return pageByFile.get(base)
    || pageByUrl.get(noExt)
    || pageByUrl.get(`${noExt}/index`)
    || pageByFile.get(`${noExt}.md`)
    || pageByFile.get(`${noExt}.mdx`)
    || pageByFile.get(`${noExt}/index.md`)
    || pageByFile.get(`${noExt}/index.mdx`)
    || null;
}

for (const pg of pages) {
  for (const m of pg.body.matchAll(/(!?)\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const isImage = m[1] === '!';
    const target = m[2];
    if (/^(https?:|mailto:)/.test(target)) continue;

    if (isImage || ASSET_RE.test(target)) {
      if (!target.startsWith('/')) {
        // CLAUDE.md: page assets are absolute into static/ so they survive docs:version snapshots.
        add('relative-asset', pg.p, `asset:${target}`, `relative asset reference \`${target}\` — must be absolute into static/`);
      } else if (!fs.existsSync(path.join(STATIC, target.replace(/^\//, '')))) {
        add('missing-asset', pg.p, `asset:${target}`, `asset not on disk: static${target}`);
      }
      continue;
    }

    if (target.startsWith('#')) {
      if (!pg.anchors.has(target.slice(1))) {
        add('broken-link', pg.p, `self:${target}`, `same-page anchor ${target} has no matching heading`);
      }
      continue;
    }

    const [rp, frag] = target.split('#');
    if (!rp) continue;

    // Pitfall 11: an extension-less relative link is resolved by Docusaurus as a URL relative to the
    // page's OWN url, not as a file path. A non-index page a/b.md is served at a/b/, so `../c/` from it
    // means a/c/ -- one level shallower than file-path logic gives. Index pages don't have the extra
    // segment, so the same text is correct there and wrong on its sibling. Resolve it their way.
    if (/^\.\.?\//.test(rp) && !/\.mdx?$/.test(rp)) {
      const urlTarget = path.posix.normalize(path.posix.join(pg.urlPath, rp)).replace(/\/+$/, '');
      if (!pageByUrl.get(urlTarget) && !pageByUrl.get(`${urlTarget}/index`)) {
        add('broken-link', pg.p, `page:${target}`,
          `extension-less link \`${target}\` resolves to /${urlTarget} (url-relative), which is not a page — add the .md/.mdx extension`);
        continue;
      }
    }

    const tp = resolvePage(pg, rp);
    if (tp === undefined) continue;                          // deliberately out of scope
    if (!tp) { add('broken-link', pg.p, `page:${target}`, `link target not found: ${target}`); continue; }
    if (frag && !tp.anchors.has(frag)) add('broken-link', pg.p, `page:${target}`, `anchor #${frag} not on ${tp.p}`);
  }
}

/* 3+4. @param / @return against the declaration that follows */
for (const h of headers.concat(
  srcFiles.filter(f => f.endsWith('.cpp')).map(f => {
    const raw = fs.readFileSync(f, 'utf8');
    return { rel: rel(SRC, f), raw, lines: raw.split(/\r?\n/), decls: [], skip: true, cppOnly: true };
  }))) {
  const { lines } = h;
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*\/\*\*/.test(lines[i])) continue;
    let end = i;
    while (end < lines.length && !/\*\//.test(lines[end])) end++;
    const block = lines.slice(i, end + 1).join('\n');
    const docParams = [...block.matchAll(/@param\s+(?:\[[^\]]*\]\s*)?([A-Za-z_]\w*)/g)].map(m => m[1]);
    const hasReturn = /@return\b/.test(block);
    if (!docParams.length && !hasReturn) { i = end; continue; }

    let j = skipToDeclaration(lines, end + 1);
    // Pitfall 6, plus line comments: a `// note` and an `#if WITH_EDITOR` commonly sit between a
    // doc block and the `#define` it documents.
    while (j < lines.length && /^\s*(#\s*(if|ifdef|ifndef|else|elif|endif)\b|\/\/)/.test(lines[j])) j++;
    if (j >= lines.length) { i = end; continue; }

    let actual = null, fnName = null, retType = null;
    if (/^\s*#\s*define/.test(lines[j])) {
      const dm = lines[j].match(/#\s*define\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/);
      if (!dm) { i = end; continue; }
      fnName = dm[1];
      actual = splitTopLevel(dm[2]);
    } else {
      let decl = '', d = 0, seen = false;
      for (let k = j; k < lines.length && k < j + 30; k++) {
        decl += (decl ? ' ' : '') + lines[k].trim();
        for (const ch of lines[k]) { if (ch === '(') { d++; seen = true; } else if (ch === ')') d--; }
        if (seen && d === 0) break;
        if (!seen && /[;{]/.test(lines[k])) break;
      }
      if (!seen) { i = end; continue; }
      const open = decl.indexOf('('), close = closingParen(decl, open);
      if (close < 0) { i = end; continue; }
      const head = decl.slice(0, open).trim();
      const nm = head.match(/([A-Za-z_~]\w*)\s*$/);
      if (!nm) { i = end; continue; }
      fnName = nm[1];
      actual = splitTopLevel(decl.slice(open + 1, close)).map(paramName).filter(Boolean);
      retType = head.slice(0, nm.index).replace(/\b(static|virtual|explicit|inline|FORCEINLINE|constexpr|friend)\b/g, '').trim();
    }

    // A variadic dispatch macro (`#define N_TEST_TIMER_SCOPE(...)`) documents the arguments its
    // concrete variants take; there is nothing in `...` to match them against.
    const variadic = actual.length === 1 && actual[0] === '...';
    for (const p of variadic ? [] : docParams) {
      if (!actual.includes(p)) {
        add('stale-param', h.rel, `${fnName}:${p}`, `@param ${p} is not a parameter of ${fnName}() [${actual.join(', ') || 'none'}]`, i + 1);
      }
    }
    if (hasReturn && retType !== null && /(^|\s)void$/.test(retType)) {
      add('void-return', h.rel, `${fnName}`, `@return documented on void ${fnName}()`, i + 1);
    }
    i = end;
  }
}

/* 5. doc comments naming symbols or headers that do not exist */
for (const f of srcFiles) {
  const r = rel(SRC, f);
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*\/\*\*/.test(lines[i])) continue;
    let end = i;
    while (end < lines.length && !/\*\//.test(lines[end])) end++;
    const body = lines.slice(i, end + 1).join('\n')
      .replace(/@see\s*<a href="[^"]*">/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ');
    for (const m of body.matchAll(/\b((?:FN|UN|EN|AN|IN|SN|HN)[A-Z]\w*)\b/g)) {
      const n = m[1];
      // Prose legitimately pluralises a type name ("diffing two FNObjectSnapshots").
      if (knownSymbols.has(n) || (n.endsWith('s') && knownSymbols.has(n.slice(0, -1)))) continue;
      add('unknown-symbol', r, n, `doc comment names \`${n}\`, which is not in the source`, i + 1);
    }
    for (const m of body.matchAll(/\b(N_[A-Z][A-Z0-9_]{2,})\b/g)) {
      // A trailing underscore means the prose is naming a family (`N_WORLD_ICON_*`), not a macro.
      if (m[1].endsWith('_')) continue;
      if (!knownSymbols.has(m[1])) add('unknown-symbol', r, m[1], `doc comment names macro \`${m[1]}\`, which is not defined`, i + 1);
    }
    for (const m of body.matchAll(/\b([A-Z]\w*\.h)\b/g)) {
      if (!srcBasenames.has(m[1])) add('unknown-symbol', r, m[1], `doc comment names header \`${m[1]}\`, which is not on disk`, i + 1);
    }
    i = end;
  }
}

/* 6. headers with no documentation, honouring editorial coverage */
for (const h of headers) {
  if (h.skip) continue;
  if (pagesForHeader.has(h.modulePath)) continue;
  // A plugin documented feature-first (Picker's distributions, Tooling's validators) covers its
  // headers in prose without a TypeDetails block, so accept a page in the same plugin that names
  // the primary type.
  const slug = pluginSlugs.get(`Nexus${h.pluginDir}`);
  const named = h.decls.length && pages.some(pg =>
    (!slug || pg.p.startsWith(`plugins/${slug}/`)) &&
    h.decls.some(d => new RegExp(`\\b${d.name}\\b`).test(pg.text)));
  if (named) continue;
  add('missing-page', h.modulePath, 'nopage',
    `no page documents ${h.modulePath}${h.decls.length ? ` (${h.decls.map(d => d.name).join(', ')})` : ''}`);
}

/* 7. declared types with no doc comment */
for (const h of headers) {
  if (h.skip) continue;
  for (const d of h.decls) {
    if (!d.hasDoc) add('missing-typedoc', h.modulePath, d.name, `${d.name} has no /** */ doc comment`, d.line);
  }
}

/* 8. documented headers with no @see backlink */
for (const [modulePath, pgs] of pagesForHeader) {
  const h = headerByModulePath.get(modulePath);
  if (!h) continue;
  if (/@see\s*<a href="https:\/\/nexus-framework\.com/.test(h.raw)) continue;
  add('missing-backlink', modulePath, 'nobacklink',
    `no @see backlink to ${pgs[0].urlPath}`);
}

/* ------------------------------------------------------- baseline + report */

/* Two buckets, deliberately distinct:
 *   exclusions — hand-written, permanent. The finding is wrong or the code is correct as-is.
 *                Each entry carries the reason. --update never touches these.
 *   accepted   — a snapshot of known outstanding work. Regenerated by --update; entries leave
 *                as the backlog is worked off. */
const baseline = fs.existsSync(BASELINE)
  ? JSON.parse(fs.readFileSync(BASELINE, 'utf8'))
  : { note: '', exclusions: {}, accepted: {} };
const exclusions = baseline.exclusions || {};
const acceptedKeys = new Set([...Object.keys(exclusions), ...Object.keys(baseline.accepted || {})]);

const currentKeys = new Set(findings.map(f => f.key));
const isNew = f => !acceptedKeys.has(f.key);
const newFindings = findings.filter(isNew);
const fixed = [...acceptedKeys].filter(k => !currentKeys.has(k));

const byCheck = list => {
  const g = new Map();
  for (const f of list) { if (!g.has(f.check)) g.set(f.check, []); g.get(f.check).push(f); }
  return g;
};

const ORDER = ['doc-code-mismatch', 'base-mismatch', 'broken-link', 'missing-asset', 'relative-asset', 'stale-param',
  'void-return', 'unknown-symbol', 'stale-typedetails', 'missing-page', 'missing-typedoc', 'missing-backlink'];
const sortChecks = g => ORDER.filter(c => g.has(c)).concat([...g.keys()].filter(c => !ORDER.includes(c)));

if (UPDATE) {
  const accepted = {};
  for (const f of findings) if (!(f.key in exclusions)) accepted[f.key] = f.message;
  fs.writeFileSync(BASELINE, JSON.stringify({
    note: 'Baseline for `npm run audit:coverage`. Keys are stable and carry no line numbers, so ' +
          'unrelated edits do not invalidate them. "exclusions" are permanent and hand-written — ' +
          'the finding is a false positive or the source is correct as-is — and are never rewritten ' +
          'by --update; always give a reason. "accepted" is a snapshot of outstanding work and is ' +
          'regenerated by --update, so entries disappear as the backlog is cleared.',
    generated: new Date().toISOString().slice(0, 10),
    counts: Object.fromEntries([...byCheck(findings)].map(([c, l]) => [c, l.length])),
    exclusions,
    accepted,
  }, null, 2) + '\n');
  console.log(`Baseline written -> ${rel(ROOT, BASELINE)}`);
  console.log(`  exclusions kept   ${Object.keys(exclusions).length}`);
  console.log(`  accepted (backlog) ${Object.keys(accepted).length}`);
  process.exit(0);
}

const shown = SHOW_ALL ? findings : newFindings;
const groups = byCheck(shown);

console.log(`\nNEXUS docs coverage audit`);
console.log(`  docs pages        ${pages.length}`);
console.log(`  public headers    ${headers.filter(h => !h.skip).length} in scope (${headers.length} total)`);
console.log(`  declared types    ${headers.filter(h => !h.skip).reduce((a, h) => a + h.decls.length, 0)}`);
console.log(`  findings          ${findings.length} total, ${newFindings.length} new since baseline`);
if (fixed.length) console.log(`  resolved          ${fixed.length} baselined findings no longer reproduce`);

for (const check of sortChecks(groups)) {
  const list = groups.get(check);
  console.log(`\n=== ${check} (${list.length})`);
  for (const f of list.slice(0, SHOW_ALL ? 1e9 : 60)) {
    console.log(`  ${f.file}${f.line ? ':' + f.line : ''}\n      ${f.message}`);
  }
  if (!SHOW_ALL && list.length > 60) console.log(`  … ${list.length - 60} more (--all to list)`);
}

if (!shown.length) console.log('\nNo new findings.');
if (fixed.length) {
  console.log(`\n=== resolved since baseline (${fixed.length}) — run --update to drop them`);
  for (const k of fixed.slice(0, 40)) console.log(`  ${k}`);
}

console.log('');
process.exit(newFindings.length ? 1 : 0);
