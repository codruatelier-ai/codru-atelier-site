import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  engines?: { node?: string };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

test('the project requires Node 24 or newer', () => {
  assert.match(pkg.engines?.node ?? '', /^>=\s*24(\.|$)/);
});

test('@types/node is the Node 24 line', () => {
  const types = pkg.devDependencies?.['@types/node'] ?? pkg.dependencies?.['@types/node'];
  assert.ok(types, '@types/node is listed');
  assert.match(types, /^\^?24\./);
});
