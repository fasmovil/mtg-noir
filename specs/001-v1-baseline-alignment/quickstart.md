# Quickstart: Validate V1 Baseline Alignment

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

After implementation adds the planned built-in backend tests, run:

```bash
npm test --prefix backend
```

Verify that the suite covers:

1. Exact match success without a tolerant fallback.
2. Tolerant fallback after an exact name is unresolved.
3. `CARD_NOT_FOUND` after both approved search attempts are unresolved.
4. Missing `name`, catalog errors, invalid catalog data, and timeout behavior.
5. Normal-card and multi-face DTO normalization, including `null` values and English Oracle text.

## Frontend Acceptance Validation

Use the browser at `http://localhost:5173` after backend startup.

1. Verify the initial prompt, input validation, loading feedback, not-found feedback, and error
   feedback are English and understandable.
2. Search for an exact card name and verify its result.
3. Search for a name that requires tolerant fallback and verify the resolved result.
4. Search for a nonexistent name and verify the not-found state.
5. Verify a multi-face fixture displays its available faces and their relevant images.
6. Verify a missing-image fixture displays the intentional Noir placeholder.
7. Navigate the input, button, feedback, and result with a keyboard at desktop and narrow viewport
   widths.

## Build and Startup Checks

```bash
npm run build --prefix frontend
npm run start --prefix backend
```

The frontend build must finish successfully. The backend startup must report that it is listening
on its configured port; stop the process after confirming startup.

## Conformity Completion

Mark the baseline conformant only when the required backend coverage, frontend acceptance checks,
build, and startup checks all pass and no capability outside the approved alignment scope was
introduced.
