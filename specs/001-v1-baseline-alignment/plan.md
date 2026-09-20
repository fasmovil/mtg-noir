# Implementation Plan: MTG Noir V1 Baseline Alignment

**Branch**: `001-v1-baseline-alignment` | **Date**: 2026-09-20 | **Spec**:
[spec.md](./spec.md)

**Input**: Align the existing V1 implementation with the approved search, DTO, English UI, and
missing-image contract without adding product functionality.

## Summary

Bring the existing single-card lookup into V1 conformity through focused changes in the existing
backend adapter and frontend presentation. The backend will perform exact lookup before catalog
tolerant fallback, normalize cards and relevant faces into the stable DTO, and preserve canonical
English Oracle text. The frontend will consume the expanded DTO, render each available face, use
English feedback, and show a Noir placeholder for absent images. No new runtime dependencies,
state layers, storage, endpoints, or infrastructure are required.

## Technical Context

**Language/Version**: JavaScript; Node.js 20+ for the backend; current frontend uses React 19.

**Primary Dependencies**: React 19 and Vite 7 for the frontend; Express 5 for the backend.

**Storage**: N/A; the application retains no persistent card data.

**Testing**: Node's built-in test runner for backend behavior and DTO normalization; manual browser
acceptance validation for frontend states; Vite production build. No test framework is currently
installed, and no new framework will be introduced for this alignment.

**Target Platform**: Modern desktop and mobile browsers with a Node.js backend process.

**Project Type**: Two-part web application: browser frontend plus HTTP backend.

**Performance Goals**: Preserve the current single-search interaction and existing upstream
timeout behavior; no additional performance target is approved for this feature.

**Constraints**: Preserve frontend/backend separation; expose only the application DTO; keep
Scryfall structures in the backend; add no database, state-management library, framework, or
infrastructure; preserve behavior outside the approved conformity scope.

**Scale/Scope**: One existing search screen, one existing card-search endpoint, one external card
catalog integration, and four known conformity gaps.

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

| Principle | Plan response | Status |
|-----------|---------------|--------|
| I. Functional Correctness Before All Other Concerns | The plan implements only approved V1 requirements and retains unrelated behavior. | Pass |
| II. Stable Application Contract and Service Boundaries | Scryfall lookup and normalization remain backend-only; the frontend receives the stable DTO. | Pass |
| III. Prefer the Simplest Verified Solution | The plan reuses the current application structure and Node's built-in test runner; no dependencies or state layers are added. | Pass |
| IV. Basic Accessibility and Product Identity | English feedback, semantic placeholder content, existing focus behavior, and responsive face rendering are included. | Pass |
| V. Spec-Driven, Feature-Scoped Change Management | This plan is traceable to the active specification. Before implementation, work MUST move to the named feature branch because the current checkout remains `main`. | Pass with pre-implementation branch gate |

## Project Structure

### Documentation (this feature)

```text
specs/001-v1-baseline-alignment/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── cards-search.md
└── tasks.md                 # Created later by $speckit-tasks
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── routes/
│   │   └── cards.js          # Existing request validation and result endpoint
│   ├── services/
│   │   └── scryfall.js       # Existing catalog lookup and DTO normalization
│   └── server.js             # Existing application startup and error mapping
└── test/                     # Planned built-in Node test files

frontend/
├── src/
│   ├── App.jsx               # Existing search state and feedback text
│   ├── components/
│   │   ├── CardDisplay.jsx   # Existing card, face, and placeholder presentation
│   │   └── SearchBar.jsx     # Existing input validation text
│   ├── services/
│   │   └── cardsApi.js       # Existing backend client and error presentation
│   └── styles.css            # Existing Noir responsive styles and placeholder styling
└── package.json              # Build script; no dependency additions planned
```

**Structure Decision**: Retain the current frontend/backend layout. Backend changes stay within
the existing route and Scryfall service boundary. Frontend changes stay within the existing state,
components, client, and stylesheet. Backend tests are added beside the backend without creating a
new service or shared package.

## Phase 0: Research Decisions

See [research.md](./research.md). The research resolves the catalog lookup sequence, English
Oracle text source, multi-face normalization, image behavior, and verification approach. No
technical clarifications remain.

## Phase 1: Design Artifacts

- [Data model](./data-model.md) defines the stable card, face, request, and UI state entities.
- [HTTP contract](./contracts/cards-search.md) defines the application endpoint and DTO without
  exposing catalog response structures.
- [Quickstart](./quickstart.md) defines the post-implementation checks for backend behavior,
  browser states, build, and startup.

## Complexity Tracking

No constitution violations require justification. The alignment uses the existing two-part
application and one external catalog integration.
