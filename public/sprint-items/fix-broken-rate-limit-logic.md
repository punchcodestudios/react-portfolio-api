# Fix: Broken Rate Limit Path-Matching Logic

## Problem

In `index.js`, the expression `path.includes[("signup", "login")]` uses bracket notation on the `includes` method reference instead of calling it. The comma expression evaluates only to `"login"`, so `includes` is always `undefined`. The stronger rate limit intended for `/signup` and `/login` never activates.

## Acceptance Criteria

- Path matching uses correct method call syntax: `path.includes("signup") || path.includes("login")`.
- The strong rate limit (10 req/min) is confirmed to apply to sign-up and login endpoints.
- No other paths are unintentionally affected.

## Files Affected

- `index.js`
