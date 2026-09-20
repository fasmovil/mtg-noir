# Data Model: MTG Noir V1 Baseline Alignment

## Search Request

| Field | Type | Rules |
|-------|------|-------|
| `name` | string | Required after trimming; 1 to 200 characters. |

## Card Result

The stable result returned by the application for one resolved card.

| Field | Type | Rules |
|-------|------|-------|
| `name` | string or null | Card-level name. |
| `manaCost` | string or null | Card-level mana cost; retain the existing first-face fallback when no card-level value applies. |
| `typeLine` | string or null | Card-level type line; retain the existing first-face fallback when no card-level value applies. |
| `oracleText` | string or null | Canonical English Oracle text; retain the existing first-face fallback when no card-level value applies. |
| `set` | string or null | Resolved printing's set name. |
| `rarity` | string or null | Resolved printing's rarity. |
| `image` | string or null | Preferred card-level image, with the existing first-face fallback when needed. |
| `faces` | Card Face array | Empty for a normal card; contains every relevant face for a multi-face card. |

## Card Face

One relevant face of a multi-face card.

| Field | Type | Rules |
|-------|------|-------|
| `name` | string or null | Face name. |
| `manaCost` | string or null | Face mana cost. |
| `typeLine` | string or null | Face type line. |
| `oracleText` | string or null | Face canonical English Oracle text. |
| `image` | string or null | Face image. |

## Search Presentation State

| State | Card result | User-visible outcome |
|-------|-------------|----------------------|
| Initial | None | English prompt to search. |
| Loading | None | English progress feedback; input and submit action unavailable. |
| Success | Card Result | Top-level details and available faces are displayable. |
| Not found | None | English not-found feedback for `CARD_NOT_FOUND`. |
| Error | None | English feedback for validation, catalog, network, or unexpected failures. |

## Relationships and Invariants

- A Search Request produces either one Card Result or an error outcome.
- A Card Result has zero faces for a normal card and one or more faces for a multi-face card.
- A missing scalar value is `null`; an absent face collection is never used in place of `faces`.
- A missing image does not invalidate its Card Result or Card Face; presentation uses the approved
  placeholder.
