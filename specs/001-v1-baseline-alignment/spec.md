# Feature Specification: MTG Noir V1 Baseline Alignment

**Feature Branch**: `main` (specification only; no implementation branch created)

**Created**: 2026-09-20

**Status**: Draft

**Input**: Align the existing MTG Noir application with the approved V1 contract before freezing
the V1 baseline as normative.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find a card using the approved search policy (Priority: P1)

As a user, I want a card search to prefer an exact name and only fall back to Scryfall fuzzy
(tolerant) matching when no exact card exists, so that expected card names resolve predictably
without adding product-specific matching rules.

**Why this priority**: Search is the primary V1 user journey and must conform before the baseline
can be frozen.

**Independent Test**: Search for a card with an exact name, a name requiring Scryfall fuzzy
(tolerant) fallback,
and a name that the card catalog cannot resolve.

**Acceptance Scenarios**:

1. **Given** an exact card name, **When** the user searches for it, **Then** the application
   returns the exact card without requiring a Scryfall fuzzy (tolerant) fallback.
2. **Given** no exact card name but a valid Scryfall fuzzy (tolerant) catalog match, **When** the user searches,
   **Then** the application returns the card resolved by the catalog.
3. **Given** the catalog cannot resolve a valid card, **When** the user searches, **Then** the
   application reports `CARD_NOT_FOUND` and presents a distinct clear not-found state.
4. **Given** the card catalog is unavailable or returns an error, **When** the user searches,
   **Then** the application presents a clear error state and does not select a card itself.

---

### User Story 2 - Inspect normal and multi-face cards (Priority: P2)

As a user, I want every returned card to preserve the standard card details and expose all
available faces, so that multi-face cards are understandable without breaking normal card results.

**Why this priority**: The card result is the central V1 output, and incomplete face data prevents
the contract from accurately representing supported cards.

**Independent Test**: Retrieve one normal card and one multi-face card, then inspect their card
details and available images.

**Acceptance Scenarios**:

1. **Given** a normal card, **When** it is returned, **Then** its standard card details are
   present and `faces` is an empty array.
2. **Given** a multi-face card, **When** it is returned, **Then** its standard top-level details
   remain available and each relevant face exposes its own supported details.
3. **Given** a multi-face card with more than one relevant image, **When** it is displayed,
   **Then** the user can view the available card faces without a broken result.
4. **Given** a supported field is not applicable for a card or face, **When** it is returned,
   **Then** the field is represented as `null` rather than causing an error.

---

### User Story 3 - Read all search states in English (Priority: P3)

As a user, I want search feedback and unavailable-image treatment to be clear, intentional, and
consistent with MTG Noir, so that the application remains understandable during normal and failed
searches.

**Why this priority**: English UI and basic accessibility are contractual V1 qualities, while the
noir visual identity remains part of the product.

**Independent Test**: View the initial, loading, successful, not-found, error, and missing-image
states of the search experience.

**Acceptance Scenarios**:

1. **Given** the search screen is idle, loading, successful, not found, or in error, **When** the
   user views the state, **Then** its user-facing text is in English and clearly communicates the
   outcome.
2. **Given** a card has no image, **When** it is displayed, **Then** the user sees an intentional
   MTG Noir visual placeholder rather than plain unavailable-image text.
3. **Given** any supported result state, **When** the user navigates with a keyboard or assistive
   technology, **Then** the essential search control, feedback, and card details remain usable and
   understandable.

### Edge Cases

- An exact search that returns no card triggers Scryfall fuzzy (tolerant) matching; an unavailable
  catalog or an invalid response triggers an error state instead of a fuzzy fallback.
- Scryfall fuzzy (tolerant) matching that does not produce a valid card returns `CARD_NOT_FOUND`; the application
  does not introduce its own ambiguity-resolution heuristics.
- A card or face may omit an applicable value or image; the result remains renderable with `null`
  values and, for a missing primary image, the MTG Noir placeholder.
- A card may have one or more relevant faces; normal cards always expose an empty `faces` array.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST attempt to find an exact card-name match before attempting Scryfall
  fuzzy (tolerant) matching.
- **FR-002**: The system MUST attempt Scryfall fuzzy (tolerant) matching only when no exact match exists.
- **FR-003**: The system MUST delegate Scryfall fuzzy (tolerant) matching to the card catalog and MUST NOT apply
  custom heuristics to select among ambiguous cards.
- **FR-004**: When the card catalog cannot resolve a valid card after the approved search policy,
  the system MUST return the `CARD_NOT_FOUND` result.
- **FR-005**: The system MUST guarantee that returned Oracle text is in English.
- **FR-006**: Every card result MUST preserve these top-level fields: `name`, `manaCost`,
  `typeLine`, `oracleText`, `set`, `rarity`, and `image`. A top-level field without an applicable
  catalog value MUST be `null`.
- **FR-007**: Every card result MUST include `faces`. A normal card MUST return an empty `faces`
  array.
- **FR-008**: Each relevant multi-face entry MUST expose `name`, `manaCost`, `typeLine`,
  `oracleText`, and `image`. A field without an applicable catalog value MUST be `null`.
- **FR-009**: Multi-face results MUST retain their top-level fields and MUST remain displayable
  together with all available relevant faces.
- **FR-010**: All user-facing interface text, including loading, validation, not-found, error, and
  missing-image feedback, MUST be in English.
- **FR-011**: A card without a primary image MUST display an intentional visual placeholder that
  preserves the MTG Noir noir, neon, and retrofuturistic identity.
- **FR-012**: The search experience MUST clearly represent initial, loading, successful,
  not-found, and error states while preserving basic keyboard and assistive-technology usability.
  A `CARD_NOT_FOUND` API error MUST map to the distinct not-found presentation; other failures
  MUST map to the error presentation.
- **FR-013**: The feature MUST NOT introduce autocomplete, edition selection, internationalization,
  persistent storage, or other new product functionality.
- **FR-014**: Conformity verification MUST cover valid search, missing `name`, card not found,
  catalog error, DTO normalization, initial state, loading state, successful result, not-found
  state, error state, optional data, absent images, frontend compilation, and backend startup.

### Key Entities *(include if feature involves data)*

- **Card Result**: The stable application representation of a resolved card. It contains the
  preserved top-level card fields and the collection of relevant faces.
- **Card Face**: One relevant face of a multi-face card, with its own supported name, mana cost,
  type line, Oracle text, and image values.
- **Conformity Gap**: A documented difference between the approved V1 contract and the existing
  implementation that must be resolved before the V1 baseline is frozen.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All acceptance scenarios for exact search, Scryfall fuzzy (tolerant) fallback, unresolved cards, and
  catalog errors pass without custom ambiguity selection.
- **SC-002**: All tested normal-card results expose an empty `faces` array, and all tested
  multi-face results expose every available relevant face without removing top-level fields.
- **SC-003**: All user-facing text in the initial, loading, successful, not-found, error, and
  missing-image states is English.
- **SC-004**: All required backend and frontend verification scenarios pass, the frontend compiles
  successfully, and the backend starts successfully before the baseline is marked conformant.
- **SC-005**: No user-visible V1 capability outside the approved search, result, state, and
  placeholder alignment scope is introduced.

## Assumptions

- The existing card catalog remains the source of card names, details, prints, and images.
- The printing selected through the approved exact-match then Scryfall fuzzy (tolerant) search policy is accepted for V1;
  users do not choose an edition.
- The exact visual composition of multi-face cards and the missing-image placeholder belongs to
  later design work, provided the contractual outcomes in this specification are met.
- The implementation plan will select the means of guaranteeing English Oracle text and the
  verification tooling; those choices do not alter this product contract.
- Production hosting, reverse proxies, HTTPS and deployment, advanced observability, CI/CD,
  formal dependency policy, public API versioning, external consumers, and production
  infrastructure remain deferred and are not defined by this feature.
