# Implementation Plan: Card Search Autocomplete

**Branch**: `002-card-search-autocomplete` | **Date**: 2026-09-20 | **Spec**:
[spec.md](./spec.md)

**Input**: Add card-name autocomplete to the established MTG Noir search screen while preserving the
V1 card-search contract and behavior.

## Summary

Add a small autocomplete path beside the existing single-card lookup. The Express backend will
query the catalog's name-autocomplete capability and expose a stable list of names only. The
frontend search control will request suggestions for current input, prevent stale results from
being displayed, support pointer/touch and keyboard selection, and hand a selected name to the
existing search callback. The V1 card DTO and `GET /api/cards/search` endpoint remain unchanged.

## Technical Context

**Language/Version**: JavaScript; Node.js 20+ backend; React 19 frontend.

**Primary Dependencies**: Express 5; React 19; Vite 7. No dependency additions.

**Storage**: N/A; neither card results nor suggestions are persisted.

**Testing**: Node built-in test runner for autocomplete adapter, endpoint, validation, and error
behavior; manual browser acceptance for suggestion states, pointer/touch, keyboard, and responsive
behavior; Vite production build.

**Target Platform**: Modern desktop and mobile browsers with a Node.js backend process.

**Project Type**: Two-part web application: browser frontend plus HTTP backend.

**Performance Goals**: Keep sustained Scryfall autocomplete traffic below its published 10
requests-per-second guidance per application process. The frontend waits 300 ms after the most
recent input change before requesting suggestions. The backend spaces outbound Scryfall autocomplete
requests by at least 125 ms, capping that endpoint at eight requests per second per backend process.
Suggestions must correspond only to the current input.

**Constraints**: Preserve the existing frontend/backend separation, V1 card DTO, current card-search
endpoint and search behavior. Keep catalog-specific response structures in the backend. Add no
state-management library, database, infrastructure, edition selection, card preview, or history.

**Scale/Scope**: One existing search field, one new internal autocomplete endpoint, a name-only
response of up to 20 catalog-provided names, and the existing external catalog integration.

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

| Principle | Plan response | Status |
|-----------|---------------|--------|
| I. Functional Correctness Before All Other Concerns | The V1 direct-search flow and card DTO remain unchanged; autocomplete behavior is defined by the approved feature specification. | Pass |
| II. Stable Application Contract and Service Boundaries | The frontend consumes an MTG Noir suggestion contract; catalog payloads stay in the backend adapter. | Pass |
| III. Prefer the Simplest Verified Solution | Existing route, service, client, component, stylesheet, and Node test runner are reused; no dependency or state layer is added. | Pass |
| IV. Basic Accessibility and Product Identity | Semantic combobox/listbox behavior, keyboard interaction, English feedback, responsive layout, and restrained Noir presentation are included. | Pass |
| V. Spec-Driven, Feature-Scoped Change Management | This plan traces to the active specification. Before source changes, work MUST be created or switched to the named feature branch because the current checkout is not guaranteed to be that branch. | Pass with pre-implementation branch gate |

## Project Structure

### Documentation (this feature)

```text
specs/002-card-search-autocomplete/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── card-autocomplete.md
└── tasks.md                 # Created later by $speckit-tasks
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── routes/
│   │   └── cards.js          # Existing card search plus autocomplete request validation
│   ├── services/
│   │   └── scryfall.js       # Existing card lookup plus catalog-name normalization
│   └── server.js             # Existing route registration and stable error mapping
└── test/
    ├── cards-autocomplete.test.js
    └── scryfall-autocomplete.test.js

frontend/
├── src/
│   ├── components/
│   │   └── SearchBar.jsx     # Existing search control plus autocomplete interaction
│   ├── services/
│   │   └── cardsApi.js       # Existing card search plus stable suggestion client
│   └── styles.css            # Existing Noir responsive styles plus suggestion presentation
└── package.json
```

**Structure Decision**: Retain the V1 frontend/backend layout. Add the autocomplete route and
catalog adapter function alongside the established card search instead of introducing a separate
service or package. Keep autocomplete interaction state within the existing search component.

## Phase 0: Research Decisions

See [research.md](./research.md). Research resolves the catalog autocomplete source, name-only
normalization, short-query behavior, catalog request guidance, stale-result handling, and accessible
interaction approach. No technical clarifications remain.

## Phase 1: Design Artifacts

- [Data model](./data-model.md) defines suggestion queries, name-only suggestions, presentation
  states, and keyboard state.
- [Autocomplete contract](./contracts/card-autocomplete.md) defines the backend endpoint without
  exposing catalog response structures.
- [Quickstart](./quickstart.md) defines post-implementation automated and browser validation.

## Complexity Tracking

No constitution violations require justification. The feature reuses the established two-part
application and external catalog adapter.
