import express from 'express';
import { searchCard } from './routes/cards.js';
import { ScryfallError } from './services/scryfall.js';

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/cards/search', searchCard);

app.use((error, _request, response, _next) => {
  if (error instanceof ScryfallError) {
    const code = error.status === 404 ? 'CARD_NOT_FOUND' : 'SCRYFALL_ERROR';

    return response.status(error.status).json({
      error: {
        code,
        message: error.message,
      },
    });
  }

  console.error(error);

  return response.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocurrió un error interno del servidor.',
    },
  });
});

app.listen(port, () => {
  console.log(`MTG Noir backend listening on http://localhost:${port}`);
});
