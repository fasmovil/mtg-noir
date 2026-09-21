# Card Autocomplete Contract

## Endpoint

```text
GET /api/cards/autocomplete?q=<query>
```

The endpoint returns MTG Noir's stable name-only suggestion representation. Catalog-specific
response structures are not exposed.

## Request

| Parameter | Required | Rules |
|-----------|----------|-------|
| `q` | Yes | A trimmed card-name query between 1 and 200 characters. |

## Successful Response

Status: `200 OK`

```json
{
  "suggestions": [
    "Lightning Bolt",
    "Lightning Helix"
  ]
}
```

A successful response may contain an empty `suggestions` array for a valid query with no matching
names or a query shorter than the catalog's autocomplete threshold. The response contains no
printing, image, card-detail, or raw catalog fields.

## Error Response

All errors use the existing MTG Noir error shape:

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
| `400` | `INVALID_QUERY` | The `q` parameter is absent, invalid, or too long. |
| `502` | `SCRYFALL_ERROR` | The catalog is unavailable, rejects the request, or returns invalid autocomplete data. |
| `504` | `SCRYFALL_ERROR` | The catalog does not respond within the configured request timeout. |
| `500` | `INTERNAL_ERROR` | An unexpected application error occurred. |

## Compatibility

`GET /api/cards/search?name=<card-name>` and its V1 card DTO are unchanged. The autocomplete
endpoint supplies names that can be passed directly to that existing endpoint.
