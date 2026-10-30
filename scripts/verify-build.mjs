import assert from 'node:assert/strict';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const entries = ['index.html', 'lmlab/index.html'];

for (const entry of entries) {
  const html = readFileSync(resolve(root, entry), 'utf8');
  assert.ok(!html.includes('/src/'), `${entry} still references uncompiled source`);
  assert.ok(!html.includes('%BASE_URL%'), `${entry} contains unresolved Vite placeholders`);
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gu)].map((match) => match[1]);
  assert.ok(scripts.length, `${entry} has no application script`);
  for (const asset of scripts) {
    assert.ok(asset.startsWith('/assets/'), `${entry} has an invalid production script: ${asset}`);
    assert.ok(asset.endsWith('.js'), `${entry} script is not compiled JavaScript`);
    const path = resolve(root, `.${asset}`);
    assert.ok(path.startsWith(root.endsWith(sep) ? root : `${root}${sep}`), 'Asset escaped dist');
    assert.ok(statSync(path).size > 0, `${asset} is missing or empty`);
  }
  console.log(`Verified compiled entry: ${entry}`);
}

for (const asset of ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png']) {
  assert.ok(statSync(resolve(root, asset)).size > 0, `${asset} is missing`);
}

writeFileSync(resolve(root, '.nojekyll'), '');
writeFileSync(resolve(root, 'deployment.json'), `${JSON.stringify({
  commit: process.env.GITHUB_SHA || null,
  workflow: process.env.GITHUB_RUN_ID || null,
  builtAt: new Date().toISOString(),
  entries,
}, null, 2)}\n`);
console.log('Verified Pages artifact; deployment metadata written.');
