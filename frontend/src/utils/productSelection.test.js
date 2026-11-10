import test from 'node:test';
import assert from 'node:assert/strict';
import { canAddSelection, sizeStock, totalStock } from './productSelection.js';

test('missing and invalid stock is unavailable', () => {
  assert.equal(sizeStock(null, 'M'), 0);
  assert.equal(sizeStock({ countInStock: { M: -2 } }, 'M'), 0);
  assert.equal(sizeStock({ countInStock: { M: 'bad' } }, 'M'), 0);
  assert.equal(totalStock({ countInStock: { S: 0, M: 0, L: 0, XL: 0 } }), 0);
});

test('selection must name an available size and a whole quantity within stock', () => {
  const product = { countInStock: { S: 0, M: 2, L: 5, XL: 0 } };
  assert.equal(totalStock(product), 7);
  assert.equal(canAddSelection(product, '', 1), false);
  assert.equal(canAddSelection(product, 'S', 1), false);
  assert.equal(canAddSelection(product, 'XXL', 1), false);
  assert.equal(canAddSelection(product, 'M', 0), false);
  assert.equal(canAddSelection(product, 'M', 1.5), false);
  assert.equal(canAddSelection(product, 'M', 3), false);
  assert.equal(canAddSelection(product, 'M', 2), true);
  assert.equal(canAddSelection(product, 'L', 1), true);
});
