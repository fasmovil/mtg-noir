# Frontend Validation Fixtures

This document provides repeatable browser validation inputs without adding application behavior or
test-only product endpoints.

## Live Multi-Face Card

Search for `Delver of Secrets`. This established double-faced card is expected to be returned by
Scryfall with relevant `card_faces` data and face images. Record the resolved printing and response
date in the final conformity evidence. If the catalog response no longer contains faces, treat that
as an external-data change and use another documented Scryfall double-faced card only after adding
it to this document and recording the reason.

## Browser-Local Missing-Image Response

No stable public Scryfall card is guaranteed to remain image-less, so validate this presentation
with a browser-local response override instead of changing application code:

1. Start the frontend and backend, then search for `Lightning Bolt`.
2. In browser developer tools, enable Local Overrides and select a local directory outside the
   repository for the override files.
3. In the Network panel, select the successful `GET /api/cards/search?name=Lightning%20Bolt`
   response and use **Override content**.
4. In the saved JSON response, set the top-level `image` value to `null`; retain the response's
   other fields and set `faces` to `[]` if it is not already present.
5. Reload the page and search for the same card. Confirm the MTG Noir placeholder is visible,
   understandable to assistive technology, and maintains the card layout at desktop and narrow
   viewport widths.
6. Disable the override after validation so normal catalog behavior resumes.

The override is local to the browser and is not committed, served, or required by the application.
