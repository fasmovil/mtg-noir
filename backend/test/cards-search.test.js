import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { app, errorHandler } from '../src/server.js';
import { exactCard, invalidCardPayload, notFoundPayload } from './fixtures/scryfall.js';
import { jsonResponse, timeoutError, withFetchMock } from './helpers/mockFetch.js';

async function requestApp(path) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  try {
    return await new Promise((resolve, reject) => {
      const request = http.get(`http://127.0.0.1:${port}${path}`, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          resolve({ status: response.statusCode, body: JSON.parse(body) });
        });
      });
      request.on('error', reject);
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('returns the stable DTO for a valid search', async () => {
  await withFetchMock([jsonResponse(exactCard)], async () => {
    const response = await requestApp('/api/cards/search?name=Lightning%20Bolt');

    assert.equal(response.status, 200);
    assert.equal(response.body.name, 'Lightning Bolt');
    assert.deepEqual(response.body.faces, []);
  });
});

test('rejects a missing name before calling Scryfall', async () => {
  const response = await requestApp('/api/cards/search');

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: {
      code: 'INVALID_NAME',
      message: 'The "name" parameter is required.',
    },
  });
});

test('maps unresolved exact and fuzzy lookups to CARD_NOT_FOUND', async () => {
  await withFetchMock([
    jsonResponse(notFoundPayload, { status: 404 }),
    jsonResponse(notFoundPayload, { status: 404 }),
  ], async () => {
    const response = await requestApp('/api/cards/search?name=No%20Such%20Card');

    assert.equal(response.status, 404);
    assert.equal(response.body.error.code, 'CARD_NOT_FOUND');
    assert.equal(response.body.error.message, 'No card was found for that name.');
  });
});

test('maps malformed catalog data and timeouts to stable Scryfall errors', async () => {
  await withFetchMock([jsonResponse(invalidCardPayload)], async () => {
    const response = await requestApp('/api/cards/search?name=Lightning%20Bolt');
    assert.equal(response.status, 502);
    assert.equal(response.body.error.code, 'SCRYFALL_ERROR');
  });

  await withFetchMock([timeoutError()], async () => {
    const response = await requestApp('/api/cards/search?name=Lightning%20Bolt');
    assert.equal(response.status, 504);
    assert.equal(response.body.error.code, 'SCRYFALL_ERROR');
  });
});

test('maps unexpected failures to an English internal error response', () => {
  let statusCode;
  let body;
  const response = {
    status(status) {
      statusCode = status;
      return this;
    },
    json(payload) {
      body = payload;
      return payload;
    },
  };

  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    errorHandler(new Error('Unexpected failure'), {}, response, () => {});
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(statusCode, 500);
  assert.deepEqual(body, {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected server error occurred.',
    },
  });
});
