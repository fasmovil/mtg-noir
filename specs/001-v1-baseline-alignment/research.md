# Research: MTG Noir V1 Baseline Alignment

## Exact Lookup Before Scryfall Fuzzy (Tolerant) Fallback

**Decision**: Query the card catalog for an exact name first. Only when that lookup reports that
no card was found, issue one Scryfall fuzzy (tolerant) lookup. Do not issue Scryfall fuzzy
(tolerant) matching after an exact success or an operational error.

**Rationale**: This implements the approved search policy, makes expected names predictable, and
keeps selection behavior delegated to the catalog.

**Alternatives considered**:

- Scryfall fuzzy (tolerant) lookup only: rejected because it is a known conformity gap.
- Local ambiguity scoring: rejected by the specification.
- Scryfall fuzzy (tolerant) fallback after an upstream error: rejected because an error is not
  evidence that no exact card exists.

## English Oracle Text

**Decision**: Normalize canonical Oracle text for the top-level card and each face. Do not use
localized printed text as the Oracle-text value.

**Rationale**: Canonical Oracle text is the catalog's rules text and fulfills the approved
English-language requirement without introducing translation or localization behavior.

**Alternatives considered**:

- Translation in MTG Noir: rejected because internationalization is outside V1.
- Localized printed text: rejected because it is not the canonical Oracle-text contract.

## Multi-Face DTO Normalization

**Decision**: Always return the current top-level card fields plus `faces`. For a normal card,
`faces` is empty. For a multi-face card, map every relevant catalog face to the approved face
fields. Map unavailable applicable values to `null`.

**Rationale**: This preserves compatibility for existing consumers while representing all faces
without leaking catalog-specific field names into the frontend.

**Alternatives considered**:

- Replace top-level fields with faces: rejected because the approved contract retains top-level
  fields.
- Expose raw catalog face objects: rejected because the frontend/backend contract must remain
  stable and independent of Scryfall.

## Image and Placeholder Behavior

**Decision**: Preserve the current preferred image rendition when available. When no primary or
face image is available, the UI renders a dedicated MTG Noir placeholder with accessible English
text instead of a plain unavailable-image sentence.

**Rationale**: This handles catalog image omission and failed image availability without breaking
the card result or weakening the product identity.

**Alternatives considered**:

- Leave the current plain text: rejected because it is a known conformity gap.
- Download or store substitute images: rejected because persistent storage and new infrastructure
  are outside V1.

## Verification Without New Frameworks

**Decision**: Add backend coverage with Node's built-in test runner and mocked catalog responses.
Verify frontend states through the documented browser acceptance scenarios and the existing Vite
production build.

**Rationale**: The repository has no test framework, and the approved constraints prohibit adding
one for this alignment. The approach still covers request sequencing, DTO normalization, errors,
and every required user-visible state.

**Alternatives considered**:

- Add a frontend test framework: rejected by the no-new-framework constraint.
- Rely only on manual backend checks: rejected because exact/fallback sequencing and normalized
  DTO behavior require deterministic coverage.

## Sources

- [Scryfall Card Fields](https://github.com/scryfall/api-types/blob/main/src/objects/Card/CardFields.ts):
  card-face fields, root and face image locations, canonical Oracle text, and localized printed
  text.
- [Scryfall Error Object](https://raw.githubusercontent.com/scryfall/api-types/main/src/objects/Error/Error.ts):
  status, machine-readable code, details, and optional ambiguity type.
- [Scryfall API access guidance](https://scryfall.com/docs/faqs/i-m-having-trouble-accessing-the-scryfall-api-or-i-m-blocked-17):
  request headers and rate-limit expectations.
