# Fix: SPA Catch-All Conflicts with API 404 Responses

## Problem

`app.get("*", ...)` at the bottom of `index.js` serves `index.html` for any unmatched route. A mistyped or missing API route silently returns an HTML page with status 200 instead of a proper 404 JSON response. This also masks routing bugs.

## Acceptance Criteria

- Unmatched routes under `/api/*` return a JSON 404 response, not `index.html`.
- The SPA catch-all only applies to non-API routes.
- A specific 404 middleware is registered for `/api` routes before the catch-all.

## Files Affected

- `index.js`
- `startup/routes.js`
