# MTG Noir

Aplicación web para buscar cartas de Magic: The Gathering con una interfaz noir retrofuturista. El frontend consulta una API Express propia; el backend consulta Scryfall y devuelve un formato de respuesta reducido y estable.

## Requisitos

- Node.js 20 o superior
- npm

## Instalar dependencias

Desde la raíz del proyecto, instala las dependencias de los tres paquetes. `npm ci` usa los archivos de bloqueo incluidos y permite repetir la instalación de forma consistente.

```bash
npm ci
npm ci --prefix frontend
npm ci --prefix backend
```

## Desarrollo

Para iniciar frontend y backend juntos:

```bash
npm run dev
```

También se pueden iniciar por separado:

```bash
npm run dev:frontend
npm run dev:backend
```

El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:3001`.

## Funcionamiento

1. Escribe el nombre de una carta y selecciona **Search**.
2. El frontend consulta `GET /api/cards/search?name=<nombre>`.
3. El backend valida el nombre, consulta la API pública de Scryfall y devuelve únicamente `name`, `manaCost`, `typeLine`, `oracleText`, `set`, `rarity` e `image`.
4. La interfaz muestra la carta, un estado de carga o un mensaje de error claro.

Para comprobar el backend directamente:

```bash
curl "http://localhost:3001/api/health"
curl "http://localhost:3001/api/cards/search?name=Lightning%20Bolt"
```

## Estructura

- `frontend/`: aplicación React creada con Vite.
  - `src/components/`: interfaz de búsqueda y ficha de carta.
  - `src/services/cardsApi.js`: cliente del endpoint propio.
- `backend/`: API Node.js con Express.
  - `src/routes/cards.js`: validación y ruta de búsqueda.
  - `src/services/scryfall.js`: consulta y adaptación de la respuesta de Scryfall.
- `frontend/vite.config.js`: proxy de `/api` hacia el backend local.

No hay base de datos ni almacenamiento local en esta versión.
