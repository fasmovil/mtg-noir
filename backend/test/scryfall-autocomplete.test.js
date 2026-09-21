import assert from 'node:assert/strict';
import test from 'node:test';
import {
  autocompleteCatalog,
  emptyAutocompleteCatalog,
  invalidAutocompleteCatalog,
} from './fixtures/scryfall.js';
import { jsonResponse, timeoutError, withFetchMock } from './helpers/mockFetch.js';
import {
  getCardNameSuggestions,
  resetAutocompleteRequestPacing,
  ScryfallError,
} from '../src/services/scryfall.js';

test.afterEach(() => {
  resetAutocompleteRequestPacing();
});

test('normalizes a Scryfall catalog into at most 20 card names', async () => {
  await withFetchMock([jsonResponse(autocompleteCatalog)], async (calls) => {
    const suggestions = await getCardNameSuggestions('Lightning');

    assert.deepEqual(suggestions, ['Lightning Bolt', 'Lightning Helix']);
    assert.match(calls[0].input, /\/cards\/autocomplete\?q=Lightning/);
  });
});

test('returns no suggestions for short queries and empty Scryfall catalogs', async () => {
  await withFetchMock([], async (calls) => {
    assert.deepEqual(await getCardNameSuggestions('L'), []);
    assert.equal(calls.length, 0);
  });

  await withFetchMock([jsonResponse(emptyAutocompleteCatalog)], async () => {
    assert.deepEqual(await getCardNameSuggestions('Li'), []);
  });
});

test('maps malformed catalogs, upstream failures, and timeouts to Scryfall errors', async () => {
  await withFetchMock([jsonResponse(invalidAutocompleteCatalog)], async () => {
    await assert.rejects(() => getCardNameSuggestions('Lightning'), ScryfallError);
  });

  await withFetchMock([jsonResponse({ object: 'error' }, { status: 500 })], async () => {
    await assert.rejects(() => getCardNameSuggestions('Lightning'), ScryfallError);
  });

  await withFetchMock([timeoutError()], async () => {
    await assert.rejects(
      () => getCardNameSuggestions('Lightning'),
      (error) => error instanceof ScryfallError && error.status === 504,
    );
  });
});

test('spaces outbound autocomplete requests by at least 125 ms', async () => {
  await withFetchMock([
    jsonResponse(autocompleteCatalog),
    jsonResponse(autocompleteCatalog),
  ], async (calls) => {
    await Promise.all([
      getCardNameSuggestions('Lightning'),
      getCardNameSuggestions('Lightning'),
    ]);

    const first = calls[0].requestedAt;
    const second = calls[1].requestedAt;
    assert.ok(second - first >= 125, `expected at least 125 ms of spacing, received ${second - first} ms`);
  });
});
