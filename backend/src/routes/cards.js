import { getCardByName } from '../services/scryfall.js';

const MAX_NAME_LENGTH = 200;

export async function searchCard(request, response, next) {
  const { name } = request.query;

  if (typeof name !== 'string' || !name.trim()) {
    return response.status(400).json({
      error: {
        code: 'INVALID_NAME',
        message: 'El parámetro "name" es obligatorio.',
      },
    });
  }

  const normalizedName = name.trim();

  if (normalizedName.length > MAX_NAME_LENGTH) {
    return response.status(400).json({
      error: {
        code: 'INVALID_NAME',
        message: `El parámetro "name" no puede superar ${MAX_NAME_LENGTH} caracteres.`,
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
