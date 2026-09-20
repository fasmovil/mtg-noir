export class CardSearchError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'CardSearchError';
    this.code = code;
  }
}

export async function searchCard(name) {
  const url = new URL('/api/cards/search', window.location.origin);
  url.searchParams.set('name', name);

  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new CardSearchError('NETWORK_ERROR', 'Could not connect to the MTG Noir server. Please try again.');
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');

  if (!isJson) {
    if (response.status === 404) {
      throw new CardSearchError('BACKEND_UNAVAILABLE', 'The search service is unavailable. Check that the MTG Noir backend is running on port 3001.');
    }

    throw new CardSearchError('INVALID_RESPONSE', 'The server returned an unexpected response.');
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new CardSearchError('INVALID_RESPONSE', 'The server returned an unexpected response.');
  }

  if (!response.ok) {
    const error = payload?.error;
    throw new CardSearchError(
      error?.code || 'SEARCH_FAILED',
      error?.message || 'The card search could not be completed.',
    );
  }

  return payload;
}
