import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PROJECT } from '../src/index.ts';

test('the project loads', () => {
  assert.equal(PROJECT, 'codru-atelier-site');
});
