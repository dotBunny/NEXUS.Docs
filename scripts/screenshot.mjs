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
 *                  static/ is shared by every docs version — see below).
 *
 * Replacing an existing image is retroactive: `static/` is one pool shared by
 * every version, so overwriting changes archived versions too. That is why
 * --force is opt-in. When a snapshot needs its period-accurate image, archive
 * the outgoing file first (see the doc-screenshot skill).
 */
import {readFileSync, existsSync, mkdirSync} from 'node:fs';
import {dirname, relative, resolve} from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const REPO_ROOT = resolve(import.meta.dirname, '..');

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
      '       Archive the outgoing file first if a version needs it, then pass --force.',
  );
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
