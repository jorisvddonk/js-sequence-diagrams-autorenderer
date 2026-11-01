import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

const pkg = JSON.parse(await read('package.json'));
const index = await read('index.js');
const readme = await read('README.md');
const demo = await read('test.html');
const license = await read('LICENSE');

const pinnedUrls = [...index.matchAll(/'(https:\/\/[^']+)'/g)].map((match) => match[1]);

const EXPECTED_PINS = [
  'webfont/1.6.28/webfontloader.js',
  'raphael/2.3.0/raphael.min.js',
  'underscore.js/1.13.8/underscore-min.js',
  'js-sequence-diagrams@2.0.1/dist/sequence-diagram-min.js'
];

const versionIn = (url) => {
  const match = url.match(/\/(\d+\.\d+\.\d+)\//) || url.match(/@(\d+\.\d+\.\d+)/);
  return match && match[1];
};

test('package metadata is ready for publishing', () => {
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/, 'version must be semver');
  assert.equal(pkg.name, 'js-sequence-diagrams-autorenderer');
  assert.equal(pkg.main, 'index.js');
  assert.equal(pkg.license, 'MIT');
  assert.deepEqual(pkg.files, ['index.js'], 'only the runtime file should be published');
  assert.ok(pkg.description && pkg.description.length > 10, 'description is required');
  assert.ok(pkg.keywords?.length >= 3, 'keywords help discovery on npm');
  assert.ok(pkg.repository?.url.includes('github.com/jorisvddonk/js-sequence-diagrams-autorenderer'));
  assert.ok(pkg.homepage?.includes('github.com/jorisvddonk/js-sequence-diagrams-autorenderer'));
  assert.ok(pkg.bugs?.url.includes('github.com/jorisvddonk/js-sequence-diagrams-autorenderer'));
  assert.equal(pkg.scripts?.test, 'node --test test/*.test.mjs');
});

test('README and demo reference the current version', () => {
  const referenced = [...`${readme}\n${demo}`.matchAll(/js-sequence-diagrams-autorenderer@(\d+\.\d+\.\d+)/g)]
    .map((match) => match[1]);

  assert.ok(referenced.length > 0, 'README and test.html must include a usage example');
  for (const version of referenced) {
    assert.equal(version, pkg.version, 'README/test.html point at a stale version');
  }
});

test('index.js pins the current dependency versions', () => {
  assert.equal(pinnedUrls.length, EXPECTED_PINS.length, 'expected exactly four dependencies');
  assert.ok(pinnedUrls.every((url) => url.startsWith('https://')), 'all dependencies must use HTTPS');

  for (const pin of EXPECTED_PINS) {
    assert.ok(
      pinnedUrls.some((url) => url.includes(pin)),
      `missing pinned dependency: ${pin}`
    );
  }

  for (const stale of ['underscore.js/1.5.2', 'js-sequence-diagrams/1.0.6', 'raphael/2.1.0']) {
    assert.ok(!index.includes(stale), `stale dependency still referenced: ${stale}`);
  }
});

test('README documents the pinned dependency versions', () => {
  for (const pin of EXPECTED_PINS) {
    assert.ok(readme.includes(versionIn(pin)), `README does not mention ${versionIn(pin)}`);
  }
});

test('index.js does not ship unminified or insecure URLs', () => {
  assert.ok(!/http:\/\//.test(index), 'dependencies must not be loaded over plain HTTP');
  assert.ok(!/src=['"]\//.test(index), 'no relative script paths');
});

test('LICENSE is present', () => {
  assert.match(license, /^MIT License/);
  assert.match(license, /Copyright \(c\) \d{4}/);
});

test('CDN dependencies are reachable and serve the pinned version', async () => {
  for (const url of pinnedUrls) {
    const expected = versionIn(url);
    assert.ok(expected, `could not determine a version for ${url}`);

    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 200, `${url} returned HTTP ${response.status}`);

    const body = await response.text();
    assert.ok(body.length > 1000, `${url} returned a suspiciously small body`);
    assert.ok(body.includes(expected), `${url} does not contain its pinned version ${expected}`);
  }
});
