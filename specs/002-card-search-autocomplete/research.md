# Research: Card Search Autocomplete

## Catalog Name Autocomplete

**Decision**: Use the catalog's dedicated autocomplete capability from the backend, with the query
text supplied as its name query. Normalize its catalog response into MTG Noir's name-only
suggestion contract.

**Rationale**: The catalog capability is designed for name completion, returns up to 20 complete
English card names, and already orders results by name relevance. The backend continues to prevent
the frontend from depending on catalog response fields.

**Alternatives considered**:

- Reusing the single-card exact/fuzzy lookup: rejected because it resolves one card rather than a
  list of suggested names.
- Implementing local name ranking or ambiguity heuristics: rejected because it would duplicate
  catalog behavior and expand V1's established boundary.
- Returning full card objects or printing metadata: rejected because the feature requires names
  only and excludes previews and edition selection.

## Short Queries and Empty Results

**Decision**: The backend returns an empty suggestion list for valid trimmed queries shorter than
two characters and for catalog no-match results. The frontend does not request suggestions for an
empty field.

**Rationale**: The catalog's autocomplete capability returns no names for short input and no
matches. A stable empty list lets the UI distinguish a valid empty result from an error while
preserving direct search.

**Alternatives considered**:

- Treating short input as an API validation error: rejected because it creates an unnecessary error
  state while a user is still typing.
- Showing stale suggestions after the input changes: rejected because suggestions must correspond
  to the current query.

## Request Cadence and Current-Query Results

**Decision**: Delay suggestion requests briefly after input changes and ensure that only the latest
request may update visible suggestions.

**Rationale**: A brief input pause reduces duplicate catalog requests and helps remain below the
catalog's sustained traffic guidance. Tracking the current request prevents slower older responses
from replacing newer suggestions.

**Alternatives considered**:

- Sending a request for every keystroke immediately: rejected because it can create unnecessary
  catalog traffic.
- Letting responses update in arrival order: rejected because an outdated response could violate
  the current-query requirement.

## Keyboard and Accessible Presentation

**Decision**: Use the established combobox, listbox, and option interaction semantics: Arrow Down
and Arrow Up change the active name, Enter selects it, and Escape closes the list without changing
the entered text.

**Rationale**: These semantics meet the specification's keyboard behavior and allow assistive
technology to understand the relationship between the input, state feedback, and suggestions.

**Alternatives considered**:

- Pointer-only selection: rejected because keyboard support is an explicit requirement.
- Moving focus into every option for arrow navigation: rejected because retaining input focus keeps
text entry and form submission predictable.

## Sources

- [Scryfall autocomplete API](https://scryfall.com/docs/api/cards/autocomplete): name-query
  behavior, up to 20 complete English card names, short-query/no-match behavior, and ordering.
- [Scryfall API access guidance](https://scryfall.com/docs/faqs/i-m-having-trouble-accessing-the-scryfall-api-or-i-m-blocked-17): HTTPS, descriptive headers, and sustained traffic guidance below 10 requests per second.
