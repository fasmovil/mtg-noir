# Quickstart: Validate Card Search Autocomplete

## Prerequisites

- Node.js 20 or later.
- npm.
- Access to the card catalog from the backend environment.

## Install and Run

From the repository root:

```bash
npm ci
npm ci --prefix frontend
npm ci --prefix backend
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at
`http://localhost:3001`.

## Automated Backend Verification

```bash
npm test --prefix backend
```

Verify that automated coverage includes:

1. Query validation and the stable autocomplete response shape.
2. Name-only normalization, including removal of non-name catalog fields.
3. Short query and no-match empty responses.
4. Catalog errors, invalid catalog data, and timeout behavior.
5. Preservation of the existing card-search tests and DTO behavior.

## Frontend Acceptance Validation

Use the browser at `http://localhost:5173` after backend startup.

1. Verify empty input shows no autocomplete area.
2. Enter text with matching names and verify English loading feedback followed by names only.
3. Select a suggestion by pointer or touch and verify the existing card search displays the
   selected card.
4. Repeat with Arrow Down, Arrow Up, Enter, and Escape. Confirm Escape retains the typed text.
5. Verify an empty result and a suggestion error are clear in English and that the typed name can
   still be submitted directly.
6. Verify the list, feedback, focus treatment, and search controls remain usable at desktop and
   narrow viewport widths.
7. Verify a direct search without selecting a suggestion retains V1 validation, loading, result,
   not-found, and error behavior.

## Build and Startup Checks

```bash
npm run build --prefix frontend
npm run start --prefix backend
```

The frontend build must finish successfully. The backend startup must report that it is listening
on its configured port; stop the process after confirming startup.
