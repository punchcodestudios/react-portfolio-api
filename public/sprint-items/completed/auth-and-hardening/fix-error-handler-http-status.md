# Fix: Error Handler Always Returns HTTP 200

## Problem

`middleware/catchError.js` sends HTTP status `200` for all responses, including errors. This breaks REST conventions, prevents `fetch`/`axios` from routing errors to their `catch` handlers, and makes error monitoring tools unable to detect failures.

## Acceptance Criteria

- Error responses return semantically correct HTTP status codes (e.g. 400, 401, 403, 404, 500).
- The response envelope structure (`{ content: { error } }`) is preserved.
- Existing success responses continue to return 200.

## Files Affected

- `middleware/catchError.js`

---

## Resolution

**Date Completed:** May 8, 2026

**Solution Applied:**

`middleware/catchError.js` was updated to resolve the HTTP status code from `err.status || err.statusCode || 500` before sending the response. This covers errors from `http-errors` (`.status`), native Node/Express errors (`.statusCode`), and unhandled exceptions (fallback `500`). The resolved code is used for both `res.status()` and the `error.status` field in the response body, keeping them consistent.

A unit test suite was added at `__tests__/catchError.test.js` with 6 tests covering:

- Correct use of `err.status`
- Fallback to `err.statusCode`
- Default to `500` for plain errors
- No HTTP 200 returned for errors
- Response envelope structure preserved
- Body `error.status` matches HTTP status code
