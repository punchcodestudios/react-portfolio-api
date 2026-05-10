# Refactor: Consolidate Duplicate Rate Limit Systems

## Problem

Rate limiting is configured in two places: directly in `index.js` and separately in `middleware/rateLimit.js`. The middleware file's config is never used. Having two parallel systems creates confusion about which limits are actually in effect and makes future changes error-prone.

## Acceptance Criteria

- A single source of truth for rate limit configuration exists (recommend `middleware/rateLimit.js`).
- `index.js` imports and applies limits from the middleware file rather than defining them inline.
- The unused config in `middleware/rateLimit.js` is either integrated or removed.
- All three tiers (strongest, strong, general) are functional and correctly applied.

## Files Affected

- `index.js`
- `middleware/rateLimit.js`
