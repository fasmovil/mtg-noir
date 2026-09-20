# Card Search Contract

## Endpoint

```text
GET /api/cards/search?name=<card-name>
```

The endpoint resolves one card according to the approved V1 search policy. Consumers receive only
the MTG Noir DTO; catalog-specific response structures are not exposed.

## Request

| Parameter | Required | Rules |
|-----------|----------|-------|
| `name` | Yes | A trimmed card name between 1 and 200 characters. |

## Successful Response

Status: `200 OK`

```json
{
  "name": "Lightning Bolt",
  "manaCost": "{R}",
  "typeLine": "Instant",
  "oracleText": "Lightning Bolt deals 3 damage to any target.",
  "set": "Example Set",
  "rarity": "common",
  "image": "https://example.invalid/card.jpg",
  "faces": []
}
```

All scalar card and face fields may be `null` when no applicable catalog value exists. A normal
card returns `faces: []`. A multi-face card retains the top-level fields and returns each relevant
face:

```json
{
  "name": "Example Front // Example Back",
  "manaCost": "{U}",
  "typeLine": "Creature",
  "oracleText": null,
  "set": "Example Set",
  "rarity": "rare",
  "image": "https://example.invalid/front.jpg",
  "faces": [
    {
      "name": "Example Front",
      "manaCost": "{U}",
      "typeLine": "Creature",
      "oracleText": "Example English Oracle text.",
      "image": "https://example.invalid/front.jpg"
    },
    {
      "name": "Example Back",
      "manaCost": null,
      "typeLine": "Creature",
      "oracleText": "Example English Oracle text.",
      "image": "https://example.invalid/back.jpg"
    }
  ]
}
```

## Search Policy

1. Resolve an exact card-name match.
2. If no exact card exists, attempt Scryfall fuzzy (tolerant) matching.
3. If Scryfall fuzzy (tolerant) matching does not resolve a valid card, return `CARD_NOT_FOUND`.
4. Do not apply application-owned ambiguity heuristics.

## Error Response

All errors use this shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "English user-facing message."
  }
}
```

| Status | Code | Meaning |
|--------|------|---------|
| `400` | `INVALID_NAME` | The `name` parameter is absent, invalid, or too long. |
| `404` | `CARD_NOT_FOUND` | Neither approved search step resolved a valid card. |
| `502` | `SCRYFALL_ERROR` | The catalog cannot process the request, is unavailable, or returns invalid data. |
| `504` | `SCRYFALL_ERROR` | The catalog does not respond within the configured request timeout. |
| `500` | `INTERNAL_ERROR` | An unexpected application error occurred. |
