# Security: Add NoSQL Injection Protection

## Problem

Controllers pass request body and query parameters directly to Mongoose without sanitizing for NoSQL injection operators (e.g. `$where`, `$gt`, `$regex`). An attacker can craft payloads that manipulate query logic, bypass authentication, or exfiltrate data.

## Acceptance Criteria

- All incoming `req.body` and `req.query` values are sanitized before being passed to Mongoose.
- Use a library such as `express-mongo-sanitize` to strip keys beginning with `$` or containing `.`.
- Sanitization is applied globally as middleware so all routes are protected.
- At least one test verifies that a malicious `$gt` payload is rejected.

## Files Affected

- `index.js` or `startup/routes.js` (global middleware registration)
- `package.json` (new dependency)

---

## Resolution

**Date Completed:** May 8, 2026

**Solution Applied:**

`express-mongo-sanitize` was installed and registered in `index.js` immediately after `express.json()`, ensuring all routes are protected globally. The middleware strips any key from `req.body`, `req.query`, and `req.params` that begins with `$` or contains `.`, neutralizing NoSQL injection operators before they can reach Mongoose.

A test suite was added at `__tests__/mongoSanitize.test.js` with 6 passing tests covering: top-level `$` key removal, nested `$` key removal, dot-notation key removal, `req.query` sanitization, and preservation of safe values.
