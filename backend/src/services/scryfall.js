const SCRYFALL_NAMED_CARD_URL = 'https://api.scryfall.com/cards/named';
const SCRYFALL_AUTOCOMPLETE_URL = 'https://api.scryfall.com/cards/autocomplete';
const REQUEST_TIMEOUT_MS = 8000;
const AUTOCOMPLETE_MIN_INTERVAL_MS = 125;

let lastAutocompleteRequestAt = 0;
let autocompleteQueue = Promise.resolve();

export class ScryfallError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ScryfallError';
    this.status = status;
  }
}

export async function getCardByName(name) {
  try {
    return await requestCard(name, 'exact');
  } catch (error) {
    if (!(error instanceof ScryfallError) || error.status !== 404) throw error;
  }

  return requestCard(name, 'fuzzy');
}

export async function getCardNameSuggestions(query) {
  if (query.length < 2) return [];

  await waitForAutocompleteSlot();

  let response;
  try {
    const url = new URL(SCRYFALL_AUTOCOMPLETE_URL);
    url.searchParams.set('q', query);
    response = await fetch(url, requestOptions());
  } catch (error) {
    throw toRequestError(error);
  }

  if (response.status === 404) return [];
  if (!response.ok) throw new ScryfallError('Scryfall could not provide card suggestions.', 502);

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ScryfallError('Scryfall returned invalid autocomplete data.', 502);
  }

  if (!isAutocompleteCatalog(data)) {
    throw new ScryfallError('Scryfall returned invalid autocomplete data.', 502);
  }

  return data.data.slice(0, 20);
}

async function waitForAutocompleteSlot() {
  const previousRequest = autocompleteQueue;
  let releaseSlot;
  autocompleteQueue = new Promise((resolve) => { releaseSlot = resolve; });
  await previousRequest;

  const delay = Math.max(0, AUTOCOMPLETE_MIN_INTERVAL_MS - (Date.now() - lastAutocompleteRequestAt));
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  lastAutocompleteRequestAt = Date.now();
  releaseSlot();
}

export function resetAutocompleteRequestPacing() {
  lastAutocompleteRequestAt = 0;
  autocompleteQueue = Promise.resolve();
}

async function requestCard(name, matchType) {
  let response;
  try {
    const url = new URL(SCRYFALL_NAMED_CARD_URL);
    url.searchParams.set(matchType, name);
    response = await fetch(url, requestOptions());
  } catch (error) {
    throw toRequestError(error);
  }

  if (response.status === 404) throw new ScryfallError('No card was found for that name.', 404);
  if (!response.ok) throw new ScryfallError('Scryfall could not process the search.', 502);

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ScryfallError('Scryfall returned invalid card data.', 502);
  }
  if (!isCardPayload(data)) throw new ScryfallError('Scryfall returned invalid card data.', 502);

  return toCardResponse(data);
}

function requestOptions() {
  return {
    headers: { Accept: 'application/json;q=0.9,*/*;q=0.8', 'User-Agent': 'MTG-Noir/1.0' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  };
}

function toRequestError(error) {
  if (error.name === 'TimeoutError' || error.name === 'AbortError') {
    return new ScryfallError('Scryfall did not respond in time.', 504);
  }
  return new ScryfallError('Could not reach Scryfall.', 502);
}

function isCardPayload(data) {
  return Boolean(data) && typeof data === 'object' && !Array.isArray(data) && data.object === 'card';
}

function isAutocompleteCatalog(data) {
  return Boolean(data)
    && typeof data === 'object'
    && !Array.isArray(data)
    && data.object === 'catalog'
    && Array.isArray(data.data)
    && data.data.every((name) => typeof name === 'string');
}

function nullableString(value) { return typeof value === 'string' ? value : null; }
function firstApplicable(...values) { return values.find((value) => value !== undefined && value !== null) ?? null; }
function imageUrl(imageUris) { return nullableString(imageUris?.normal); }

function toCardFaceResponse(face) {
  return {
    name: nullableString(face?.name), manaCost: nullableString(face?.mana_cost),
    typeLine: nullableString(face?.type_line), oracleText: nullableString(face?.oracle_text),
    image: imageUrl(face?.image_uris),
  };
}

export function toCardResponse(card) {
  const faces = Array.isArray(card.card_faces) ? card.card_faces.map(toCardFaceResponse) : [];
  const firstFace = card.card_faces?.[0];
  return {
    name: nullableString(card.name),
    manaCost: nullableString(firstApplicable(card.mana_cost, firstFace?.mana_cost)),
    typeLine: nullableString(firstApplicable(card.type_line, firstFace?.type_line)),
    oracleText: nullableString(firstApplicable(card.oracle_text, firstFace?.oracle_text)),
    set: nullableString(card.set_name), rarity: nullableString(card.rarity),
    image: nullableString(firstApplicable(imageUrl(card.image_uris), imageUrl(firstFace?.image_uris))),
    faces,
  };
}
