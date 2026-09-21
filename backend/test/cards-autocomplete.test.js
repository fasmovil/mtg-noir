import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { app } from '../src/server.js';
import { autocompleteCatalog, emptyAutocompleteCatalog, invalidAutocompleteCatalog } from './fixtures/scryfall.js';
import { jsonResponse, timeoutError, withFetchMock } from './helpers/mockFetch.js';
import { resetAutocompleteRequestPacing } from '../src/services/scryfall.js';

async function requestApp(path) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  try {
    return await new Promise((resolve, reject) => {
      const request = http.get(`http://127.0.0.1:${port}${path}`, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => resolve({ status: response.statusCode, body: JSON.parse(body) }));
      });
      request.on('error', reject);
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test.afterEach(() => resetAutocompleteRequestPacing());

test('returns the stable names-only autocomplete response', async () => {
  await withFetchMock([jsonResponse(autocompleteCatalog)], async () => {
    const response = await requestApp('/api/cards/autocomplete?q=Lightning');
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { suggestions: ['Lightning Bolt', 'Lightning Helix'] });
  });
});

test('returns empty suggestions for short or unmatched valid queries', async () => {
  const shortResponse = await requestApp('/api/cards/autocomplete?q=L');
  assert.equal(shortResponse.status, 200);
  assert.deepEqual(shortResponse.body, { suggestions: [] });

  await withFetchMock([jsonResponse(emptyAutocompleteCatalog)], async () => {
    const response = await requestApp('/api/cards/autocomplete?q=zzzz');
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { suggestions: [] });
  });
});

test('rejects absent, blank, and overlong autocomplete queries', async () => {
  for (const path of [
    '/api/cards/autocomplete',
    '/api/cards/autocomplete?q=%20%20',
    `/api/cards/autocomplete?q=${'x'.repeat(201)}`,
  ]) {
    const response = await requestApp(path);
    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'INVALID_QUERY');
  }
});

test('maps upstream failures, malformed data, and timeouts to stable errors', async () => {
  await withFetchMock([jsonResponse(invalidAutocompleteCatalog)], async () => {
    const response = await requestApp('/api/cards/autocomplete?q=Lightning');
    assert.equal(response.status, 502);
    assert.equal(response.body.error.code, 'SCRYFALL_ERROR');
  });

  await withFetchMock([timeoutError()], async () => {
    const response = await requestApp('/api/cards/autocomplete?q=Lightning');
    assert.equal(response.status, 504);
    assert.equal(response.body.error.code, 'SCRYFALL_ERROR');
  });
});
