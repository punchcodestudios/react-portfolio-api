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
