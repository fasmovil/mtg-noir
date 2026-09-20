import assert from 'node:assert/strict';
import test from 'node:test';
import { ScryfallError, getCardByName } from '../src/services/scryfall.js';
import {
  exactCard,
  fuzzyCard,
  invalidCardPayload,
  notFoundPayload,
} from './fixtures/scryfall.js';
import {
  invalidJsonResponse,
  jsonResponse,
  timeoutError,
  withFetchMock,
} from './helpers/mockFetch.js';

test('uses an exact Scryfall lookup when it resolves a card', async () => {
  await withFetchMock([jsonResponse(exactCard)], async (calls) => {
    const card = await getCardByName('Lightning Bolt');

    assert.equal(card.name, 'Lightning Bolt');
    assert.equal(calls.length, 1);
    assert.match(calls[0].input, /exact=Lightning\+Bolt/);
    assert.doesNotMatch(calls[0].input, /fuzzy=/);
  });
});

test('uses Scryfall fuzzy matching only after an exact lookup returns 404', async () => {
  await withFetchMock([
    jsonResponse(notFoundPayload, { status: 404 }),
    jsonResponse(fuzzyCard),
  ], async (calls) => {
    const card = await getCardByName('Llanowar Elfs');

    assert.equal(card.name, 'Llanowar Elves');
    assert.equal(calls.length, 2);
    assert.match(calls[0].input, /exact=Llanowar\+Elfs/);
    assert.match(calls[1].input, /fuzzy=Llanowar\+Elfs/);
  });
});

test('returns a not-found Scryfall error when exact and fuzzy matching both fail', async () => {
  await withFetchMock([
    jsonResponse(notFoundPayload, { status: 404 }),
    jsonResponse(notFoundPayload, { status: 404 }),
  ], async (calls) => {
    await assert.rejects(getCardByName('No Such Card'), (error) => {
      assert.ok(error instanceof ScryfallError);
      assert.equal(error.status, 404);
      return true;
    });
    assert.equal(calls.length, 2);
  });
});

test('does not fall back after a network failure', async () => {
  await withFetchMock([new Error('Network unreachable')], async (calls) => {
    await assert.rejects(getCardByName('Lightning Bolt'), (error) => {
      assert.ok(error instanceof ScryfallError);
      assert.equal(error.status, 502);
      return true;
    });
    assert.equal(calls.length, 1);
  });
});

test('rejects malformed JSON and invalid catalog data without fuzzy fallback', async () => {
  await withFetchMock([invalidJsonResponse()], async (calls) => {
    await assert.rejects(getCardByName('Lightning Bolt'), (error) => error.status === 502);
    assert.equal(calls.length, 1);
  });

  await withFetchMock([jsonResponse(invalidCardPayload)], async (calls) => {
    await assert.rejects(getCardByName('Lightning Bolt'), (error) => error.status === 502);
    assert.equal(calls.length, 1);
  });
});

test('maps an aborted upstream request to a timeout without fuzzy fallback', async () => {
  await withFetchMock([timeoutError()], async (calls) => {
    await assert.rejects(getCardByName('Lightning Bolt'), (error) => {
      assert.ok(error instanceof ScryfallError);
      assert.equal(error.status, 504);
      return true;
    });
    assert.equal(calls.length, 1);
  });
});
