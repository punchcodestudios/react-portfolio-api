# Add: Test Coverage for Core Routes and Controllers

## Problem

`__tests__/` is empty despite Vitest being configured. There are no unit, integration, or end-to-end tests for any route, controller, or model, making regressions undetectable.

## Acceptance Criteria

- Integration tests cover the auth flow: sign-up, confirm, login, refresh, logout.
- Unit tests cover key controllers: `user.js`, `auth.js`, `skill.js`.
- Unit tests cover validation functions in each model.
- Tests run cleanly with `npm test` and produce a passing report.

## Files Affected

- `__tests__/` (new test files)
- `package.json` (verify Vitest config)
