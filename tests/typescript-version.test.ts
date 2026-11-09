import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('TypeScript is on major version 7 (the native compiler)', () => {
  const pkg = JSON.parse(readFileSync(new URL('../node_modules/typescript/package.json', import.meta.url), 'utf8')) as { version: string };
  assert.equal(pkg.version.split('.')[0], '7', `installed ${pkg.version}`);
});
