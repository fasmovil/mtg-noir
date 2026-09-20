import { getCardByName } from '../services/scryfall.js';

const MAX_NAME_LENGTH = 200;

export async function searchCard(request, response, next) {
  const { name } = request.query;

  if (typeof name !== 'string' || !name.trim()) {
    return response.status(400).json({
      error: {
        code: 'INVALID_NAME',
        message: 'The "name" parameter is required.',
      },
    });
  }

  const normalizedName = name.trim();

  if (normalizedName.length > MAX_NAME_LENGTH) {
    return response.status(400).json({
      error: {
        code: 'INVALID_NAME',
        message: `The "name" parameter cannot exceed ${MAX_NAME_LENGTH} characters.`,
      },
    });
  }

  try {
    const card = await getCardByName(normalizedName);
    return response.json(card);
  } catch (error) {
    return next(error);
  }
}
