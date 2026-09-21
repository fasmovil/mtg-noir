# Conformity Evidence: Card Search Autocomplete

**Date**: 2026-09-20  
**Feature**: `002-card-search-autocomplete`  
**Decision**: Conformant with the approved feature specification.

## Automated validation

| Check | Result |
|---|---|
| `npm test --prefix backend` | Passed: 23 tests. Includes autocomplete DTO normalization, query validation, no-match, malformed upstream data, upstream failures, timeout mapping, and 125 ms outbound request spacing. |
| `npm run build --prefix frontend` | Passed. |
| `git diff --check` | Passed. |

## Browser validation

The running local application at `http://localhost:5173` was validated against the documented scenarios:

- `Lightning` displayed name-only suggestions from the new endpoint.
- Pointer selection of `Lightning Bolt` started the existing search and displayed its card result.
- Arrow Down followed by Enter selected `Lightning Axe` and started the existing search.
- Escape closed the suggestion list while retaining `Lightning` in the field.
- `zzzzzzzzzzzzzzzzzzzz` displayed the English empty-result feedback.
- The search control, feedback, and result remained exposed at 390 × 844 and 1440 × 900 viewports.

Endpoint tests cover malformed data, upstream failure, and timeout responses. The frontend maps these failures to its non-blocking English suggestion-error state and does not disable direct submission.

## Contract review

- `GET /api/cards/autocomplete?q=<query>` returns only `{ suggestions: string[] }`.
- Scryfall response structures remain isolated in `backend/src/services/scryfall.js`.
- Existing `GET /api/cards/search` behavior and the V1 card DTO remain unchanged.
- The 300 ms client debounce and 125 ms backend request spacing meet the documented autocomplete traffic strategy.
- No edition selection, card previews, history, dependencies, persistence, or infrastructure were added.

## Dropdown visual refinement

The autocomplete dropdown was rechecked in the browser after its style refinement. It now uses the
existing panel borders, restrained cyan and magenta accents, terminal spacing, and a dark scrollbar.
The active row remains distinct through its cyan edge, higher-contrast text, contained glow, and
status marker. The dropdown was visually checked at 1440 × 900 and 390 × 844 CSS pixels without
changing its combobox semantics or behavior.
