# Tasks: V1 Baseline Alignment

**Input**: Design artifacts from `/Volumes/MacMini/Learning/mtg-noir/specs/001-v1-baseline-alignment/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/cards-search.md`, `quickstart.md`

**Tests**: The approved V1 contract explicitly requires backend coverage for search, validation, upstream failures, and DTO normalization; frontend state coverage is verified through the manual acceptance flow in `quickstart.md`, plus a production build and backend startup check. No frontend test framework is introduced.

**Organization**: Tasks are grouped by user story so each approved behavior can be implemented and verified independently. Tasks must be completed on the feature branch before freezing the V1 baseline.

## Phase 1: Setup

**Purpose**: Prepare the repository and its existing backend for the approved verification workflow.

- [ ] T001 Verify the active feature metadata in `.specify/feature.json` and create or switch to the `001-v1-baseline-alignment` Git branch before modifying application source files.
- [ ] T002 [P] Add a backend test script that invokes Node's built-in test runner in `backend/package.json`.
- [ ] T003 [P] Add deterministic Scryfall payload and error fixtures for exact, fuzzy, normal, multi-face, image-less, and failed responses in `backend/test/fixtures/scryfall.js`.

---

## Phase 2: Foundational Verification Support

**Purpose**: Establish reusable test support required by the backend conformity checks.

- [ ] T004 Create reusable mock-fetch setup and restoration helpers for backend tests in `backend/test/helpers/mockFetch.js`.

**Checkpoint**: Test tooling can exercise the Scryfall adapter without making network requests.

---

## Phase 3: User Story 1 — Resolve a card with the approved search policy (Priority: P1) 🎯 MVP

**Goal**: The backend attempts an exact Scryfall lookup first, falls back to Scryfall fuzzy lookup only when the exact lookup finds no card, returns English Oracle text, and exposes stable application errors.

**Independent Test**: With mocked Scryfall responses, verify that an exact result causes one exact request, an exact 404 causes one fuzzy retry, unresolved exact-plus-fuzzy requests return `CARD_NOT_FOUND`, and upstream failures do not trigger arbitrary fallback or frontend-specific Scryfall payloads.

- [ ] T005 [US1] Write exact-first, fuzzy-fallback, unresolved-card, and upstream-failure adapter tests in `backend/test/scryfall-search.test.js`.
- [ ] T006 [US1] Implement exact Scryfall lookup followed only by a 404-triggered fuzzy fallback, preserving canonical English `oracle_text`, in `backend/src/services/scryfall.js`.
- [ ] T007 [P] [US1] Map missing names, unresolved cards, Scryfall failures, and unexpected failures to the stable English API error contract in `backend/src/routes/cards.js` and `backend/src/server.js`.
- [ ] T008 [US1] Add route-level tests for a valid search, absent `name`, `CARD_NOT_FOUND`, and Scryfall error mapping in `backend/test/cards-search.test.js`.

**Checkpoint**: A caller of `GET /api/cards/search?name=…` receives the approved search behavior and error contract without depending on Scryfall response shapes.

---

## Phase 4: User Story 2 — Receive and view all relevant card faces (Priority: P2)

**Goal**: The API preserves the simple top-level DTO while exposing structured faces for multi-face cards, and the UI renders the available face information without breaking normal cards.

**Independent Test**: Normalize mocked normal and multi-face Scryfall cards and assert an empty `faces` array for normal cards, face objects with the required fields for multi-face cards, and `null` for unavailable values. Then manually search both card types and confirm the visible card information is usable at desktop and narrow widths.

- [ ] T009 [US2] Write normal-card, multi-face-card, optional-field, and canonical-Oracle DTO normalization tests in `backend/test/scryfall-dto.test.js`.
- [ ] T010 [US2] Extend the application DTO mapper to retain all top-level fields and add `faces` with nullable face fields from Scryfall `card_faces` in `backend/src/services/scryfall.js`.
- [ ] T011 [US2] Render the top-level card data and every available face from the stable DTO in `frontend/src/components/CardDisplay.jsx`.
- [ ] T012 [US2] Add responsive multi-face presentation rules that preserve the existing MTG Noir visual hierarchy in `frontend/src/styles.css`.

**Checkpoint**: Normal cards still render as before with `faces: []`; multi-face cards expose and display all relevant supplied faces without the frontend reading Scryfall fields.

---

## Phase 5: User Story 3 — Use clear English states and an intentional missing-image treatment (Priority: P3)

**Goal**: All visible V1 interface states are clear English, and missing images receive an accessible, intentional MTG Noir placeholder rather than plain fallback text.

**Independent Test**: In the browser, verify initial, loading, success, not-found, and unexpected-error states in English; use an image-less DTO to confirm the placeholder has useful accessible text and maintains the card panel layout on narrow and wide screens.

- [ ] T013 [P] [US3] Replace visible application state messages with their approved English wording in `frontend/src/App.jsx`.
- [ ] T014 [P] [US3] Update the search field label, validation feedback, button text, and related accessibility text to English in `frontend/src/components/SearchBar.jsx`.
- [ ] T015 [P] [US3] Translate client-side invalid-response and unexpected-network error messages while retaining error-code handling in `frontend/src/services/cardsApi.js`.
- [ ] T016 [US3] Replace the plain unavailable-image message with an accessible intentional placeholder component state in `frontend/src/components/CardDisplay.jsx`.
- [ ] T017 [US3] Style the missing-image placeholder and its responsive behavior consistently with the existing restrained noir/neon interface in `frontend/src/styles.css`.

**Checkpoint**: Visible UI text is English, errors remain understandable, and an image-less card keeps a deliberate, accessible visual treatment.

---

## Phase 6: Polish and Conformity Verification

**Purpose**: Prove the approved contract is met without adding product scope, then prepare V1 for the normative-baseline decision.

- [ ] T018 Run the clean-install, backend-test, backend-startup, frontend-build, and manual browser verification matrix documented in `specs/001-v1-baseline-alignment/quickstart.md`.
- [ ] T019 Compare the completed behavior against every requirement and deferred boundary in `specs/001-v1-baseline-alignment/spec.md` and the response contract in `specs/001-v1-baseline-alignment/contracts/cards-search.md`; record only residual conformity gaps, if any, in the feature documentation.

---

## Dependencies and Execution Order

- **Setup (Phase 1)**: T001 before every source change; T002 and T003 may run in parallel.
- **Foundational support (Phase 2)**: T004 depends on T003 and blocks backend test tasks.
- **US1 (P1)**: T005 before T006; T007 can proceed in parallel with T006 after T004; T008 follows T006 and T007.
- **US2 (P2)**: T009 before T010; T011 follows T010; T012 follows T011.
- **US3 (P3)**: T013, T014, and T015 may proceed in parallel after the existing frontend contract is available. T016 follows T011 because both modify `CardDisplay.jsx`; T017 follows T016 because both modify the placeholder presentation.
- **Verification (Phase 6)**: T018 follows all user-story tasks. T019 follows successful verification in T018.

## Parallel Opportunities

- T002 and T003 can be completed together after the branch check.
- T006 and T007 modify separate backend responsibilities and can proceed together after T005 establishes expected behavior.
- T013, T014, and T015 modify separate frontend files and can proceed together.

## Implementation Strategy

1. Complete Phases 1 and 2 so verification is deterministic and branch governance is met.
2. Deliver and verify US1 first as the minimum viable alignment: exact-then-fuzzy lookup, English canonical Oracle text, and stable backend errors.
3. Deliver US2 to establish the approved multi-face DTO and presentation.
4. Deliver US3 to align the remaining visible language and missing-image requirements.
5. Run the full conformity matrix and evaluate whether any documented gaps remain before declaring V1 frozen.

## Task Count

| User story | Tasks | Count |
| --- | --- | ---: |
| Setup | T001–T003 | 3 |
| Foundational support | T004 | 1 |
| US1 — exact then fuzzy | T005–T008 | 4 |
| US2 — multi-face cards | T009–T012 | 4 |
| US3 — English UI and placeholder | T013–T017 | 5 |
| Polish and verification | T018–T019 | 2 |
| **Total** |  | **19** |
