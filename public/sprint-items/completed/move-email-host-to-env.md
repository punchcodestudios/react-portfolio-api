# Fix: Move Hardcoded Email Host to Environment Config

## Problem

`service/email.js` hardcodes `host: "punchcodestudios.com"` and port `425` directly in source. Infrastructure values like this should be environment-configured so deployments to different environments (staging, production) do not require code changes.

## Acceptance Criteria

- SMTP `host` and `port` are read from environment variables (e.g. `EMAIL_HOST`, `EMAIL_PORT`).
- Fallback or validation is added if the variables are missing.
- No infrastructure values remain hardcoded in source.
- `.env.example` is updated with the new variable names.

## Files Affected

- `service/email.js`
- `.env.example` (or equivalent)
