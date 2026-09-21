# Data Model: Card Search Autocomplete

## Suggestion Query

| Field | Type | Rules |
|-------|------|-------|
| `q` | string | Trimmed text; 1 to 200 characters when sent to the autocomplete endpoint. |

## Card Name Suggestion

A complete Magic card name available for selection. It is represented as a string and has no
edition, image, card details, or other metadata.

## Autocomplete Response

| Field | Type | Rules |
|-------|------|-------|
| `suggestions` | Card Name Suggestion array | Contains zero to 20 name strings. An empty array represents a valid short query or no matching names. |

## Autocomplete Presentation State

| State | Input condition | User-visible outcome |
|-------|-----------------|----------------------|
| Inactive | Input is empty | No list or autocomplete feedback is shown. |
| Loading | Non-empty input has a current request | English loading feedback is shown. |
| Available | Current request returns one or more names | Name-only list is shown; zero or one name is active for keyboard navigation. |
| Empty | Current request returns no names | English empty-result feedback is shown. |
| Error | Current request fails | English error feedback is shown; direct card search remains usable. |
| Closed | User presses Escape | The list is hidden and input text remains unchanged. |

## Relationships and Invariants

- A non-empty Suggestion Query produces one current Autocomplete Response or an error state.
- Only the response associated with the current input can change the visible suggestion state.
- Selecting a Card Name Suggestion passes its `name` to the existing card-search flow.
- An autocomplete error, empty response, or closed list never disables direct card search.
