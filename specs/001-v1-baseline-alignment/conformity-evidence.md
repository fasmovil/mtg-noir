# V1 Baseline Alignment: Conformity Evidence

**Validation date**: 2026-09-20

## Executed Validation

| Check | Command or input | Result |
| --- | --- | --- |
| Clean root install | `npm ci` | Passed; 0 reported vulnerabilities. |
| Clean frontend install | `npm ci --prefix frontend` | Passed. |
| Clean backend install | `npm ci --prefix backend` | Passed. |
| Backend contract tests | `npm test --prefix backend` | Passed: 15 tests. Covers exact lookup, Scryfall fuzzy (tolerant) fallback, unresolved cards, missing name, malformed data, timeout, upstream errors, English internal errors, normal DTOs, multi-face DTOs, nullable fields, and canonical Oracle text. |
| Frontend production build | `npm run build --prefix frontend` | Passed. |
| Backend startup | `npm run start --prefix backend` and `GET /api/health` | Passed; process listened on port 3001 and health endpoint returned 200. |
| Integrated real-card search | Browser at `http://localhost:5173`; search `Lightning Bolt` | Passed; English card result rendered from the application backend. |
| Multi-face presentation | Browser at `http://localhost:5173`; search `Delver of Secrets` | Passed; top-level details and two face records with images rendered. Resolved printing observed: Innistrad Remastered. |
| Initial and validation states | Browser at `http://localhost:5173`; empty submit | Passed; initial prompt and validation feedback were English. |
| Not-found state | Browser at `http://localhost:5173`; search `MTG Noir Definitely Not A Card` | Passed; `CARD_NOT_FOUND` rendered as the distinct not-found state. |
| Unexpected error state | Browser at `http://localhost:5173`; temporarily unavailable backend | Passed; clear English error feedback rendered. |
| Missing-image placeholder | Browser at `http://localhost:5173`; temporary local DTO fixture with `image: null` | Passed; `NO IMAGE SIGNAL` placeholder and its accessible image-unavailable label rendered. The fixture was test-only and the real backend was restored after the check. |

## Residual-Gap Assessment

No residual conformity gaps were found.

- Exact lookup is attempted before Scryfall fuzzy (tolerant) matching.
- The backend exposes only the approved application DTO, including nullable fields and `faces`.
- Canonical Scryfall Oracle text is retained for top-level cards and faces.
- The UI is English, distinguishes not-found from unexpected errors, represents multi-face cards, and provides the approved Noir placeholder.
- No autocomplete, edition selector, internationalization, persistence, or other product capability was introduced.
- Deferred production infrastructure decisions remain unchanged.

## Final Decision

**conformant** — The implementation conforms to the approved V1 baseline alignment specification. V1 is ready to be treated as the frozen normative baseline.
