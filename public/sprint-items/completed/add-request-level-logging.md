# Add: Request-Level Access Logging

## Problem

Winston is configured for application-level logging but there is no per-request logging (method, path, status, response time). Without this, debugging production issues requires guesswork and there is no audit trail of API traffic.

## Acceptance Criteria

- Every inbound HTTP request is logged with: method, URL, response status, and response time.
- Logs are routed through the existing Winston logger (or Morgan is piped into Winston).
- Health check or static asset routes can be excluded to reduce noise.
- Log output format is consistent with existing Winston log entries.

## Files Affected

- `index.js` or `startup/logging.js`
- `package.json` (if adding `morgan`)
