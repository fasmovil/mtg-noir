const SCRYFALL_NAMED_CARD_URL = 'https://api.scryfall.com/cards/named';
const REQUEST_TIMEOUT_MS = 8000;

export class ScryfallError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ScryfallError';
    this.status = status;
  }
}

export async function getCardByName(name) {
  let scryfallResponse;

  try {
    const url = new URL(SCRYFALL_NAMED_CARD_URL);
    url.searchParams.set('fuzzy', name);

    scryfallResponse = await fetch(url, {
      headers: {
        Accept: 'application/json;q=0.9,*/*;q=0.8',
        'User-Agent': 'MTG-Noir/1.0',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new ScryfallError('Scryfall tardó demasiado en responder.', 504);
    }

    throw new ScryfallError('No se pudo conectar con Scryfall.', 502);
  }

  let data;

  try {
    data = await scryfallResponse.json();
  } catch {
    throw new ScryfallError('Scryfall devolvió una respuesta inválida.', 502);
  }

  if (scryfallResponse.status === 404) {
    throw new ScryfallError('No encontramos una carta con ese nombre.', 404);
  }

  if (!scryfallResponse.ok) {
    throw new ScryfallError('Scryfall no pudo procesar la búsqueda.', 502);
  }

  return toCardResponse(data);
}

function toCardResponse(card) {
  const firstFace = card.card_faces?.[0];

  return {
    name: card.name,
    manaCost: card.mana_cost || firstFace?.mana_cost || '',
    typeLine: card.type_line || firstFace?.type_line || '',
    oracleText: card.oracle_text || firstFace?.oracle_text || '',
    set: card.set_name,
    rarity: card.rarity,
    image: card.image_uris?.normal || firstFace?.image_uris?.normal || '',
  };
}
