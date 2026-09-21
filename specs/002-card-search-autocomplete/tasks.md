# Tasks: Card Search Autocomplete

**Input**: Design documents from `/Volumes/MacMini/Learning/mtg-noir/specs/002-card-search-autocomplete/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/card-autocomplete.md`, `quickstart.md`

**Tests**: Backend tests are required by the approved technical plan. Frontend behavior is verified through the repeatable browser scenarios in `quickstart.md`; no frontend test framework is introduced for this feature.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently while preserving the existing V1 card-search flow.

## Phase 1: Setup

- [ ] T001 Create or switch to the Git feature branch `002-card-search-autocomplete` and confirm `.specify/feature.json` identifies `specs/002-card-search-autocomplete` before modifying source files.
- [ ] T002 [P] Add deterministic Scryfall autocomplete catalog fixtures for successful suggestions, an empty catalog, malformed upstream data, an upstream error, and a timeout in `backend/test/fixtures/scryfall.js`.

---

## Phase 2: Foundational work

No new shared framework or infrastructure is needed. This feature uses the existing Express route/service boundary, frontend API client, and `SearchBar` component.

---

## Phase 3: User Story 1 - See and select card-name suggestions (Priority: P1) 🎯 MVP

**Goal**: A user typing a non-empty card-name query can see relevant name-only suggestions and select one to launch the existing card search with that exact suggestion.

**Independent Test**: Type a query with known Scryfall matches, verify only card names appear, select one using pointer or touch, and verify the existing result area displays that selected card. Submit a typed name without selecting a suggestion and verify normal V1 search still works.

### Tests for User Story 1

- [ ] T003 [P] [US1] Add service-level tests for Scryfall autocomplete normalization, empty results, malformed upstream catalogs, upstream failures, timeouts, and 125 ms minimum outbound-request spacing in `backend/test/scryfall-autocomplete.test.js`.
- [ ] T004 [P] [US1] Add endpoint contract tests for `GET /api/cards/autocomplete`, including valid suggestions, empty suggestions, missing or invalid `q`, Scryfall errors, and the stable names-only response in `backend/test/cards-autocomplete.test.js`.

### Implementation for User Story 1

- [ ] T005 [US1] Implement the Scryfall autocomplete adapter and names-only normalization, including short-query handling, existing request safety conventions, and process-level 125 ms outbound-request spacing in `backend/src/services/scryfall.js`.
- [ ] T006 [US1] Add `GET /api/cards/autocomplete` query validation, the stable `{ suggestions: string[] }` response, and existing error mapping in `backend/src/routes/cards.js` and `backend/src/server.js`.
- [ ] T007 [US1] Add a frontend autocomplete API client that consumes the stable backend response and exposes structured API errors in `frontend/src/services/cardsApi.js`.
- [ ] T008 [US1] Add a 300 ms input debounce, autocomplete request state, names-only suggestions, stale-response protection, and pointer/touch selection that invokes the existing `onSearch` flow in `frontend/src/components/SearchBar.jsx`.
- [ ] T009 [US1] Add responsive Noir-consistent styling for the name-only suggestion list and selectable items in `frontend/src/styles.css`.

**Checkpoint**: Pointer and touch selection work end to end, the existing direct search remains functional, and backend autocomplete tests pass.

---

## Phase 4: User Story 2 - Navigate suggestions with the keyboard (Priority: P2)

**Goal**: A keyboard user can move through visible suggestions, select one with Enter, or dismiss the list with Escape while preserving the typed query.

**Independent Test**: With suggestions visible, use ArrowDown and ArrowUp to move the active item, press Enter to run the selected card search, then repeat and press Escape to close the list while retaining the input value.

### Implementation for User Story 2

- [ ] T010 [US2] Add semantic combobox/listbox/option relationships and implement ArrowUp, ArrowDown, Enter, and Escape behavior in `frontend/src/components/SearchBar.jsx`.
- [ ] T011 [US2] Add visible active-item and keyboard-focus styling that remains usable at narrow viewport widths in `frontend/src/styles.css`.

**Checkpoint**: The documented keyboard sequence operates correctly without changing the existing Search-button or Enter-submit behavior when no suggestion is active.

---

## Phase 5: User Story 3 - Understand autocomplete feedback (Priority: P3)

**Goal**: The user receives clear English feedback while suggestions load, when none match, and when autocomplete fails, without blocking a direct card search.

**Independent Test**: Enter a qualifying query and observe loading; use a query with no matches and observe the empty state; simulate or reproduce an autocomplete failure and observe an error while submitting the typed query still invokes V1 search; clear the field and verify suggestions and feedback disappear.

### Implementation for User Story 3

- [ ] T012 [US3] Add English loading, empty-result, and error feedback for autocomplete; clear all autocomplete feedback for empty input; and keep direct submission available after an autocomplete error in `frontend/src/components/SearchBar.jsx`.
- [ ] T013 [US3] Style autocomplete feedback and its screen-reader-facing status treatment consistently with the existing Noir interface in `frontend/src/styles.css`.

**Checkpoint**: All autocomplete states are clear, non-blocking, responsive, and preserve the existing V1 card-search behavior.

---

## Phase 6: Polish and cross-cutting validation

- [ ] T014 Run the backend autocomplete test files and the full backend suite, including the deterministic 125 ms request-spacing assertion, then run `npm run build` in `frontend/`; record any fixes required by failures in the appropriate source and test tasks above.
- [ ] T015 Execute the repeatable desktop and mobile browser scenarios, including the `Lightning` match query, the documented 300 ms client-debounce check, the `zzzzzzzzzzzzzzzzzzzz` no-match query, the request-blocking error procedure, and the defined 1440×900 and 390×844 viewports in `specs/002-card-search-autocomplete/quickstart.md`.
- [ ] T016 Create `specs/002-card-search-autocomplete/conformity-evidence.md` recording the validation commands, browser scenario results, date, residual gaps (if any), and the final conformance decision against `spec.md`.
- [ ] T017 Review `specs/002-card-search-autocomplete/spec.md`, `plan.md`, `tasks.md`, and `quickstart.md` after implementation so the task checkboxes, implementation notes, and conformance evidence accurately reflect the delivered feature without changing the approved product contract.

---

## Dependencies and execution order

- T001 precedes every source-code task.
- T002 supplies fixtures for T003 and T004.
- T003 and T004 can run in parallel. T005 follows T003; T006 follows T004 and T005.
- T007 follows T006 because it consumes the established backend contract.
- T008 follows T007; T009 can proceed once the suggestion markup in T008 is available.
- T010 and T011 follow T008/T009. T012 and T013 follow T008/T009 and may proceed after the interaction-state structure is present.
- T014 and T015 follow all user-story work. T016 follows T014 and T015. T017 is last.

## Parallel opportunities

- T002 can proceed independently during setup.
- T003 and T004 can be written in parallel after T002.
- T009 can be styled alongside the completed behavior in T008.
- T011 and T013 touch the same stylesheet, so complete them sequentially unless their changes are coordinated.
- T014 and T015 can be executed in parallel after implementation is complete.

## Implementation strategy

1. Complete User Story 1 to deliver a usable, pointer/touch-accessible autocomplete path without disrupting direct search.
2. Add User Story 2 keyboard support and semantics.
3. Add User Story 3 feedback states, then run the full validation and record conformance evidence.
