# Feature Specification: Card Search Autocomplete

**Feature Branch**: `002-card-search-autocomplete` (specification only; no implementation branch created)

**Created**: 2026-09-20

**Status**: Draft

**Input**: Add card search autocomplete to MTG Noir so users can select relevant Magic: The Gathering
card names while they type and continue through the existing card search flow.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select a suggested card name (Priority: P1)

As a user, I want to see relevant card-name suggestions while I type, so that I can select the
card I intend to search without needing to enter its full name manually.

**Why this priority**: Selecting a suggestion is the feature's primary value and must hand off to
the existing search journey reliably.

**Independent Test**: Enter text that has matching card names, choose one suggestion by pointer or
touch, and confirm that the existing search displays that selected card.

**Acceptance Scenarios**:

1. **Given** a non-empty search field and matching card names, **When** the user types, **Then** a
   list of relevant suggestions appears and each item contains only a card name.
2. **Given** visible suggestions, **When** the user selects one by pointer or touch, **Then** its
   card name is used to run the existing card search flow.
3. **Given** a selected suggestion, **When** its search completes, **Then** the established card
   loading, result, not-found, and error behavior remains available.

---

### User Story 2 - Use autocomplete with a keyboard (Priority: P2)

As a keyboard user, I want to navigate and select suggestions without a pointer, so that card-name
selection remains accessible.

**Why this priority**: Keyboard support is part of the product's basic accessibility requirement.

**Independent Test**: Enter text with matching names, use arrow keys to move through the list,
press Enter to select the active name, and confirm the existing search starts with that name.

**Acceptance Scenarios**:

1. **Given** visible suggestions, **When** the user presses Arrow Down or Arrow Up, **Then** the
   active suggestion moves through the available names.
2. **Given** an active suggestion, **When** the user presses Enter, **Then** its name is selected
   and the existing card search begins.
3. **Given** visible suggestions, **When** the user presses Escape, **Then** the list closes while
   the text already entered remains intact.

---

### User Story 3 - Understand unavailable suggestion results (Priority: P3)

As a user, I want clear feedback while suggestions are loading, unavailable, or empty, so that I
can decide whether to keep typing or use the existing search directly.

**Why this priority**: The autocomplete must not obscure or block the established search flow when
suggestions cannot be shown.

**Independent Test**: Enter text that has no matching names, simulate a suggestion retrieval error,
and verify that each state is clear and that direct search remains usable.

**Acceptance Scenarios**:

1. **Given** a non-empty field while suggestions are being retrieved, **When** the user views the
   autocomplete area, **Then** an English loading state is communicated.
2. **Given** a non-empty field with no matching names, **When** suggestion retrieval completes,
   **Then** an English empty-result state is communicated without showing stale suggestions.
3. **Given** suggestion retrieval fails, **When** the user views the autocomplete area, **Then** an
   English error state is communicated and the user can still submit the typed name through the
   existing search flow.
4. **Given** an empty field, **When** the user clears its text, **Then** no suggestions, loading,
   empty-result, or suggestion-error state is shown.

### Edge Cases

- If the field changes while a suggestion request is pending, only suggestions relevant to the
  current text may be presented.
- If no suggestion is active, submitting the form continues the existing search using the typed
  text.
- If the selected suggestion is no longer available when its search begins, the existing search
  error or not-found behavior handles the outcome.
- Long card names and suggestion lists remain usable on narrow and wide screens without hiding
  names or the existing search controls.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present relevant Magic: The Gathering card-name suggestions while a
  user enters non-empty text in the search field.
- **FR-002**: The system MUST not present suggestions or autocomplete feedback when the search
  field is empty.
- **FR-003**: Every suggestion item MUST contain only a card name and MUST not include edition
  information, card previews, or other metadata.
- **FR-004**: The user MUST be able to select a suggestion by pointer or touch.
- **FR-005**: Selecting a suggestion MUST use that exact name to start the existing card search
  flow.
- **FR-006**: The autocomplete MUST provide English loading, empty-result, and error feedback for
  non-empty input.
- **FR-007**: A suggestion retrieval error MUST not prevent the user from submitting the typed name
  through the existing card search flow.
- **FR-008**: Keyboard users MUST be able to move the active suggestion with Arrow Down and Arrow
  Up, select it with Enter, and close the suggestion list with Escape.
- **FR-009**: The autocomplete and its feedback MUST remain usable on desktop and mobile screen
  sizes and preserve the existing MTG Noir noir, neon, retrofuturistic identity.
- **FR-010**: The existing direct search behavior, including its validation, loading, result,
  not-found, and error states, MUST continue to work when autocomplete is unavailable, has no
  results, or is not used.
- **FR-011**: The feature MUST NOT add edition selection, card previews, search history, or other
  new product functionality.

### Key Entities *(include if feature involves data)*

- **Suggestion Query**: The current non-empty text entered in the card search field.
- **Card Name Suggestion**: A suggested Magic card name available for selection; it has no product
  fields beyond that name.
- **Suggestion State**: The visible autocomplete state for the current query: loading, available
  names, no matching names, or retrieval error.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In all acceptance tests with available matches, 100% of displayed suggestion items
  contain a card name only.
- **SC-002**: In all pointer, touch, and keyboard selection acceptance tests, selecting a
  suggestion starts the existing card search using the selected name.
- **SC-003**: In all acceptance tests for empty input, no autocomplete list or autocomplete feedback
  is visible.
- **SC-004**: In all acceptance tests for loading, empty-result, and error states, the feedback is
  English and the typed name remains available for direct search.
- **SC-005**: Existing direct-search acceptance tests continue to pass when autocomplete is unused,
  empty, or unavailable.
- **SC-006**: The autocomplete remains operable by pointer, touch, and keyboard at narrow and wide
  viewport sizes used for acceptance validation.

## Assumptions

- Relevant card names are supplied by the existing card catalog; MTG Noir does not introduce its
  own card-name ranking or ambiguity heuristics for this feature.
- The established MTG Noir English interface language applies to autocomplete labels and feedback.
- A suggestion selection immediately starts the existing search; autocomplete does not create a
  separate search result or card-preview experience.
- The feature uses the existing single search screen and preserves the V1 card result contract.
- Production hosting, reverse proxies, HTTPS and deployment, advanced observability, CI/CD, formal
  dependency policy, public API versioning, external consumers, and production infrastructure
  remain deferred and are not defined by this feature.
