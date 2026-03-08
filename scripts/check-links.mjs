#!/usr/bin/env node
/**
 * Link checker for Elecraft documentation site.
 *
 * Validates every internal link found in content source files against the
 * built output (dist/) and static assets (public/).
 *
 * Link categories checked:
 *   1. PDF download links   – resolved against public/contrib/
 *   2. Internal page links  – resolved against dist/ (requires build)
 *   3. Frontmatter links    – hero action links in .mdx files
 *   4. LinkCard hrefs       – JSX component links in .mdx files
 *
 * External links (https://) are reported but not validated by default.
 * Pass --check-external to validate them with HTTP HEAD requests.
 *
 * Usage:
 *   node scripts/check-links.mjs            # check internal links only
 *   node scripts/check-links.mjs --check-external  # also check external URLs
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
import { existsSync } from 'node:fs';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = join(ROOT, 'src', 'content', 'docs');
const PUBLIC_DIR = join(ROOT, 'public');
const DIST_DIR = join(ROOT, 'dist');
const BASE_PATH = '/elecraft-docs';

const checkExternal = process.argv.includes('--check-external');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect files matching a predicate. */
async function walk(dir, predicate) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(full, predicate)));
    } else if (predicate(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Check if a path exists (file or directory). */
async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Link extraction
// ---------------------------------------------------------------------------

/**
 * Extract all links from a markdown/mdx file.
 * Returns an array of { url, line, col, context } objects.
 */
function extractLinks(content, filePath) {
  const links = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Markdown links: [text](url)
    const mdLinkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
    let m;
    while ((m = mdLinkRe.exec(line)) !== null) {
      links.push({
        url: m[2].trim(),
        line: lineNum,
        col: m.index + 1,
        context: m[0],
        source: filePath,
      });
    }

    // JSX href attributes: href="/path/" or href="https://..."
    const hrefRe = /href="([^"]+)"/g;
    while ((m = hrefRe.exec(line)) !== null) {
      // Skip if this href is already captured as part of a markdown link
      const url = m[1].trim();
      const alreadyCaptured = links.some((l) => l.line === lineNum && l.url === url);
      if (!alreadyCaptured) {
        links.push({
          url,
          line: lineNum,
          col: m.index + 1,
          context: m[0],
          source: filePath,
        });
      }
    }

    // Frontmatter link: fields (  link: /path/)
    const fmLinkRe = /^\s+link:\s+(.+)$/;
    const fmMatch = line.match(fmLinkRe);
    if (fmMatch) {
      const url = fmMatch[1].trim();
      links.push({
        url,
        line: lineNum,
        col: line.indexOf(url) + 1,
        context: line.trim(),
        source: filePath,
      });
    }
  }

  return links;
}

// ---------------------------------------------------------------------------
// Link resolution
// ---------------------------------------------------------------------------

/**
 * Resolve a link URL to a file on disk.
 * Returns { exists: boolean, resolvedPath: string, type: string }.
 */
async function resolveLink(url) {
  // External link
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return { exists: null, resolvedPath: url, type: 'external' };
  }

  // Anchor-only link
  if (url.startsWith('#')) {
    return { exists: true, resolvedPath: url, type: 'anchor' };
  }

  // Must start with base path for this site
  if (!url.startsWith(BASE_PATH + '/') && !url.startsWith(BASE_PATH)) {
    // Could be a relative link without base path — this is an error
    if (url.startsWith('/')) {
      return {
        exists: false,
        resolvedPath: url,
        type: 'missing-base-path',
        error: `Internal link missing base path "${BASE_PATH}". Got: ${url}`,
      };
    }
    // Relative link (no leading slash) — unusual but check anyway
    return { exists: null, resolvedPath: url, type: 'relative' };
  }

  // Strip base path to get the local path
  const localPath = url.slice(BASE_PATH.length); // e.g. /contrib/elecraft/k3/file.pdf

  // PDF or other static asset in public/
  if (localPath.match(/\.[a-zA-Z0-9]+$/) && !localPath.endsWith('/')) {
    const assetPath = join(PUBLIC_DIR, localPath);
    const exists = await pathExists(assetPath);
    return { exists, resolvedPath: assetPath, type: 'asset' };
  }

  // Internal page link — check dist/ directory
  // Pages in dist/ are either dist/path/index.html or dist/path.html
  const candidates = [];

  // /k3/ → dist/k3/index.html
  if (localPath.endsWith('/')) {
    candidates.push(join(DIST_DIR, localPath, 'index.html'));
  }
  // /k3 → dist/k3/index.html or dist/k3.html
  candidates.push(join(DIST_DIR, localPath, 'index.html'));
  candidates.push(join(DIST_DIR, localPath + '.html'));

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return { exists: true, resolvedPath: candidate, type: 'page' };
    }
  }

  return {
    exists: false,
    resolvedPath: join(DIST_DIR, localPath),
    type: 'page',
  };
}

// ---------------------------------------------------------------------------
// External link checking
// ---------------------------------------------------------------------------

async function checkExternalUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'elecraft-docs-link-checker/1.0' },
    });
    clearTimeout(timeout);
    return { ok: res.ok, status: res.status };
  } catch (err) {
    // Retry with GET for servers that reject HEAD
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'elecraft-docs-link-checker/1.0' },
      });
      clearTimeout(timeout);
      return { ok: res.ok, status: res.status };
    } catch (retryErr) {
      return { ok: false, status: retryErr.message };
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🔗 Elecraft Docs Link Checker\n');

  // Check that dist/ exists (build must run first)
  if (!existsSync(DIST_DIR)) {
    console.error('Error: dist/ directory not found. Run `npm run build` first.\n');
    process.exit(1);
  }

  // Collect all content files
  const contentFiles = await walk(CONTENT_DIR, (name) => /\.(md|mdx)$/.test(name));
  console.log(`Found ${contentFiles.length} content files\n`);

  // Extract and check links
  const errors = [];
  const warnings = [];
  const externalLinks = new Map(); // dedupe
  let totalLinks = 0;
  let checkedLinks = 0;

  for (const file of contentFiles) {
    const relFile = relative(ROOT, file);
    const content = await readFile(file, 'utf-8');
    const links = extractLinks(content, relFile);
    totalLinks += links.length;

    for (const link of links) {
      const result = await resolveLink(link.url);

      if (result.type === 'external') {
        externalLinks.set(link.url, link);
        continue;
      }

      if (result.type === 'anchor' || result.type === 'relative') {
        continue;
      }

      checkedLinks++;

      if (result.type === 'missing-base-path') {
        errors.push({
          file: relFile,
          line: link.line,
          url: link.url,
          message: result.error,
        });
        continue;
      }

      if (!result.exists) {
        const relResolved = relative(ROOT, result.resolvedPath);
        errors.push({
          file: relFile,
          line: link.line,
          url: link.url,
          message: `${result.type === 'asset' ? 'File' : 'Page'} not found: ${relResolved}`,
        });
      }
    }
  }

  // Check external links if requested
  if (checkExternal && externalLinks.size > 0) {
    console.log(`Checking ${externalLinks.size} external links...\n`);
    for (const [url, link] of externalLinks) {
      const result = await checkExternalUrl(url);
      checkedLinks++;
      if (!result.ok) {
        warnings.push({
          file: link.source,
          line: link.line,
          url,
          message: `External link returned ${result.status}`,
        });
      }
    }
  }

  // Report results
  console.log('─'.repeat(72));
  console.log(`  Total links found:     ${totalLinks}`);
  console.log(
    `  Internal links checked: ${checkedLinks - (checkExternal ? externalLinks.size : 0)}`
  );
  console.log(`  External links found:  ${externalLinks.size}`);
  if (checkExternal) {
    console.log(`  External links checked: ${externalLinks.size}`);
  }
  console.log('─'.repeat(72));

  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} BROKEN LINK${errors.length === 1 ? '' : 'S'}:\n`);
    for (const err of errors) {
      console.log(`  ${err.file}:${err.line}`);
      console.log(`    Link: ${err.url}`);
      console.log(`    ${err.message}\n`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} WARNING${warnings.length === 1 ? '' : 'S'}:\n`);
    for (const warn of warnings) {
      console.log(`  ${warn.file}:${warn.line}`);
      console.log(`    Link: ${warn.url}`);
      console.log(`    ${warn.message}\n`);
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All links are valid!\n');
  }

  // Exit with error code if broken links found
  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
