import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../vite.config.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(resolve(root, path));

test('GitHub Pages builds real homepage and LMLab HTML entries', () => {
  for (const [name, path] of Object.entries(config.build.rollupOptions.input)) {
    assert.match(readFileSync(path, 'utf8'), /id="root"/u, name);
  }
  assert.match(config.build.rollupOptions.input.lmlab.replaceAll('\\', '/'), /\/lmlab\/index\.html$/u);
  assert.equal(config.base, process.env.VITE_BASE_PATH || '/');
});

test('both entries reference existing favicon and iOS icon assets', () => {
  const pngSignature = '89504e470d0a1a0a';
  assert.equal(read('public/favicon.ico').subarray(0, 4).toString('hex'), '00000100');
  for (const path of ['favicon-32.png', 'apple-touch-icon.png']) {
    assert.equal(read(`public/${path}`).subarray(0, 8).toString('hex'), pngSignature);
  }
  for (const entry of ['index.html', 'lmlab/index.html']) {
    const html = read(entry).toString('utf8');
    for (const path of ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png']) {
      assert.ok(html.includes(`%BASE_URL%${path}`), `${entry}: ${path}`);
    }
    assert.match(html, /viewport-fit=cover/u);
  }
});

test('homepage retains all requested external destinations', () => {
  const app = read('src/App.jsx').toString('utf8');
  for (const href of ['https://xingjisoft.com', 'https://www.hgspace.work/', 'https://www.ithink537.top/', 'https://github.com/AuronaLabs']) {
    assert.ok(app.includes(href), href);
  }
  assert.ok(app.includes('BASE_URL}lmlab/'));
});
