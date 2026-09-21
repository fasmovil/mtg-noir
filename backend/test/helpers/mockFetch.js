export function jsonResponse(body, { status = 200 } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

export function invalidJsonResponse({ status = 200 } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      throw new SyntaxError('Invalid JSON');
    },
  };
}

export function timeoutError() {
  const error = new Error('Request timed out');
  error.name = 'TimeoutError';
  return error;
}

export function installFetchMock(steps) {
  const originalFetch = globalThis.fetch;
  const calls = [];
  let index = 0;

  globalThis.fetch = async (input, init) => {
    calls.push({ input: String(input), init, requestedAt: Date.now() });
    const step = steps[index++];

    if (step === undefined) {
      throw new Error('Unexpected fetch call');
    }

    if (step instanceof Error) {
      throw step;
    }

    return typeof step === 'function' ? step(input, init) : step;
  };

  return {
    calls,
    restore() {
      globalThis.fetch = originalFetch;
    },
  };
}

export async function withFetchMock(steps, callback) {
  const mock = installFetchMock(steps);

  try {
    return await callback(mock.calls);
  } finally {
    mock.restore();
  }
}
