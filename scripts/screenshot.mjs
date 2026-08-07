#!/usr/bin/env node
/**
 * Turn a captured editor screenshot into a docs-ready .webp.
 *
 * The MCP toolsets hand back base64 PNG; `static/assets/images/docs/` holds .webp.
 * This bridges the two, and optionally crops, because a whole-window capture
 * usually contains far more than the page needs.
 *
 * Usage:
 *   node scripts/screenshot.mjs --in shot.png            --out <path.webp>
 *   node scripts/screenshot.mjs --in - --base64          --out <path.webp>   # stdin
 *   node scripts/screenshot.mjs --in shot.png --crop x,y,w,h --out <path.webp>
 *   node scripts/screenshot.mjs --probe shot.png                             # size only, no write
 *
 * Options:
 *   --quality N    1-100, default 90. UI text needs a high value; photographic
 *                  viewport captures look fine much lower.
 *   --lossless     Ignore --quality and encode losslessly. Larger files; reach
 *                  for it only when lossy artefacts show on fine UI text.
 *   --max-width N  Downscale if wider. Never upscales.
 *   --force        Overwrite an existing file (refuses by default, because
 *                  static/ is shared by every docs version — see below). Any
 *                  archived version referencing the outgoing image is preserved
 *                  automatically: its pixels are copied to _archive/<version>/
 *                  and that version's pages are repointed at the copy.
 *   --no-archive   Skip that preservation, because the new image is the same
 *                  subject shot better and every version should get it. Only
 *                  correct when the UI itself did not change.
 *
 * Provenance (scripts/screenshot-manifest.json):
 *   --subject S    What the image shows. Presence of this flag is what records an entry.
 *   --level P      Package path of the level it was captured in.
 *   --setup S      How to get the editor back into this state.
 *   --watch A,B    Source paths whose change invalidates the image. `npm run audit:coverage`
 *                  diffs these since the capture commit and reports the image as possibly stale.
 *   --pages A,B    Doc pages that reference it.
 *
 * Recording is a side effect of capturing rather than a separate step, because a
 * provenance file nobody remembers to update is worse than none: it looks authoritative
 * while being wrong. The capture commit is read from the plugin source at write time.
 *
 * Replacing an existing image is retroactive: `static/` is one pool shared by
 * every version, so overwriting would change archived versions too. --force is
 * still opt-in, but the archiving it used to require by hand now happens here —
 * see archiveForVersions.
 */
import {readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, copyFileSync} from 'node:fs';
import {dirname, relative, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import process from 'node:process';
import sharp from 'sharp';

const REPO_ROOT = resolve(import.meta.dirname, '..');
const MANIFEST = resolve(REPO_ROOT, 'scripts', 'screenshot-manifest.json');
const SRC = process.env.NEXUS_PLUGINS
  ? resolve(process.env.NEXUS_PLUGINS)
  : resolve(REPO_ROOT, '..', 'NEXUS', 'Plugins');

/**
 * Copy an image about to be overwritten into a version-scoped archive, and repoint the archived
 * versions that reference it.
 *
 * `static/` is one pool shared by every docs version, so overwriting a file rewrites history: a
 * shipped page keeps its old prose beside a new picture. This runs on replacement and touches only
 * the versions that actually reference the image — the live path never changes, so pages on `docs/`
 * are untouched and no image is duplicated until the moment it would otherwise become wrong.
 *
 * @param outPath Absolute path of the live image being replaced.
 * @returns Human-readable lines describing what was archived.
 */
function archiveForVersions(outPath) {
  const versionsDir = resolve(REPO_ROOT, 'versioned_docs');
  if (!existsSync(versionsDir)) return [];

  // The reference as it appears in a page: absolute, rooted at /assets/.
  const docsRef = outPath.slice(outPath.indexOf('static') + 'static'.length).replace(/\\/g, '/');
  const relFromImages = docsRef.replace(/^\/assets\/images\/docs\//, '');
  const log = [];

  for (const versionDir of readdirSync(versionsDir).filter((d) => d.startsWith('version-'))) {
    const version = versionDir.slice('version-'.length);
    const pages = [];
    const walk = (dir) => {
      for (const entry of readdirSync(dir, {withFileTypes: true})) {
        const p = resolve(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (/\.mdx?$/.test(entry.name) && readFileSync(p, 'utf8').includes(docsRef)) pages.push(p);
      }
    };
    walk(resolve(versionsDir, versionDir));
    if (!pages.length) continue;

    const archiveRef = `/assets/images/docs/_archive/${version}/${relFromImages}`;
    const archivePath = resolve(REPO_ROOT, 'static', archiveRef.slice(1));

    // Already archived means this version was pinned by an earlier replacement; that copy is the
    // period-accurate one, so leave it and only fix any reference still pointing at the live file.
    if (!existsSync(archivePath)) {
      mkdirSync(dirname(archivePath), {recursive: true});
      copyFileSync(outPath, archivePath);
    }
    for (const page of pages) {
      writeFileSync(page, readFileSync(page, 'utf8').split(docsRef).join(archiveRef));
    }
    log.push(
      `archived for ${version}: ${archiveRef} (${pages.length} page${pages.length === 1 ? '' : 's'} repointed)`,
    );
  }
  return log;
}

/** Best-effort git against the plugin source; a missing checkout must not fail a capture. */
function sourceSha() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: SRC, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
  } catch { return null; }
}

/**
 * Upsert one image's provenance entry.
 *
 * Keyed by the docs reference path (`/assets/...`), which is what a page actually contains — so the
 * audit can match manifest entries against page references without a second path convention.
 */
function recordProvenance(docsRef, args) {
  const list = (s) => (s ? s.split(',').map((v) => v.trim()).filter(Boolean) : []);
  const manifest = existsSync(MANIFEST)
    ? JSON.parse(readFileSync(MANIFEST, 'utf8'))
    : {
        note:
          'Provenance for documentation screenshots, written by `npm run screenshot` when it is ' +
          'given --subject. Deliberately partial: images captured before this file existed have no ' +
          'entry, and gain one when they are next retaken rather than being backfilled from ' +
          'guesswork. "watch" lists the source paths whose change invalidates the image; ' +
          '`npm run audit:coverage` diffs them since "captured.sha" and reports possible staleness.',
        images: {},
      };

  manifest.images[docsRef] = {
    subject: args.subject,
    ...(args.pages ? {pages: list(args.pages)} : {}),
    ...(args.level ? {level: args.level} : {}),
    ...(args.setup ? {setup: args.setup} : {}),
    ...(args.watch ? {watch: list(args.watch)} : {}),
    captured: {sha: sourceSha(), date: new Date().toISOString().slice(0, 10)},
  };

  const sorted = Object.fromEntries(Object.entries(manifest.images).sort(([a], [b]) => a.localeCompare(b)));
  manifest.images = sorted;
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
}

function parseArgs(argv) {
  const args = {quality: 90};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i];
    switch (arg) {
      case '--in': args.in = next(); break;
      case '--out': args.out = next(); break;
      case '--crop': args.crop = next(); break;
      case '--quality': args.quality = Number(next()); break;
      case '--max-width': args.maxWidth = Number(next()); break;
      case '--probe': args.probe = next(); break;
      case '--base64': args.base64 = true; break;
      case '--lossless': args.lossless = true; break;
      case '--force': args.force = true; break;
      case '--no-archive': args.noArchive = true; break;
      case '--subject': args.subject = next(); break;
      case '--level': args.level = next(); break;
      case '--setup': args.setup = next(); break;
      case '--watch': args.watch = next(); break;
      case '--pages': args.pages = next(); break;
      default:
        fail(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

async function readInput(args) {
  const raw =
    args.in === '-'
      ? readFileSync(0)
      : readFileSync(resolve(args.in));
  // Base64 from a tool response may arrive with a data: prefix or embedded newlines.
  if (!args.base64) return raw;
  const text = raw.toString('utf8').replace(/^data:image\/\w+;base64,/, '').replace(/\s/g, '');
  return Buffer.from(text, 'base64');
}

const args = parseArgs(process.argv.slice(2));

// Probe mode exists so a caller can read the capture's dimensions before deciding
// on a crop box, rather than guessing and re-capturing.
if (args.probe) {
  const {width, height, format} = await sharp(resolve(args.probe)).metadata();
  console.log(JSON.stringify({width, height, format}));
  process.exit(0);
}

if (!args.in) fail('--in is required (use "-" to read stdin)');
if (!args.out) fail('--out is required');
if (!Number.isFinite(args.quality) || args.quality < 1 || args.quality > 100) {
  fail('--quality must be between 1 and 100');
}

const outPath = resolve(args.out);
if (!outPath.endsWith('.webp')) {
  fail(`--out must end in .webp (docs images are webp): ${args.out}`);
}
if (existsSync(outPath) && !args.force) {
  fail(
    `${relative(REPO_ROOT, outPath)} already exists.\n` +
      '       static/ is shared by every docs version, so overwriting is retroactive.\n' +
      '       Pass --force: any archived version referencing it is preserved automatically.',
  );
}

// Preserve the outgoing pixels for any shipped version that still describes them. Done here, on the
// replacement itself, rather than by duplicating the whole pool at each version cut: an image that
// never changes is already correct for every version, so only a replacement can make one wrong.
if (existsSync(outPath) && args.force && !args.noArchive) {
  for (const line of archiveForVersions(outPath)) console.log(line);
}

let pipeline = sharp(await readInput(args));

if (args.crop) {
  const [left, top, width, height] = args.crop.split(',').map(Number);
  if ([left, top, width, height].some((n) => !Number.isFinite(n))) {
    fail('--crop must be four numbers: x,y,w,h');
  }
  const meta = await pipeline.metadata();
  if (left + width > meta.width || top + height > meta.height) {
    fail(
      `crop ${args.crop} falls outside the ${meta.width}x${meta.height} capture. ` +
        'Re-probe the source before cropping.',
    );
  }
  pipeline = pipeline.extract({left, top, width, height});
}

if (args.maxWidth) {
  pipeline = pipeline.resize({width: args.maxWidth, withoutEnlargement: true});
}

mkdirSync(dirname(outPath), {recursive: true});
const info = await pipeline
  .webp(args.lossless ? {lossless: true} : {quality: args.quality})
  .toFile(outPath);

const docsRef = outPath.includes('static')
  ? outPath.slice(outPath.indexOf('static') + 'static'.length).replace(/\\/g, '/')
  : null;

console.log(
  `wrote ${relative(REPO_ROOT, outPath).replace(/\\/g, '/')} ` +
    `(${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}KB)`,
);
if (docsRef) console.log(`reference as: ${docsRef}`);

if (args.subject) {
  if (!docsRef) {
    fail('--subject records provenance, which only makes sense for an image written under static/');
  }
  recordProvenance(docsRef, args);
  console.log(`recorded in ${relative(REPO_ROOT, MANIFEST).replace(/\\/g, '/')}`);
}
