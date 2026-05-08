# Architecture Analysis — react-portfolio-api

**Date:** May 8, 2026

---

## Overview

This is a Node.js/Express REST API using a layered architecture: Routes → Controllers → Models (Mongoose/MongoDB), with a centralized startup bootstrap pattern and JWT-based authentication.

---

## Structural Patterns

### Route / Controller Separation

Routes are thin (just paths + middleware chains) and logic lives in controllers. Controllers use a **pipeline pattern** where each middleware function sets `req.data` / `req.meta`, and a final `sendSuccessResponse` controller formats and sends the response.

### Startup Bootstrapping

The app uses a `startup/` folder to isolate concerns (logging, routes, DB, prod hardening) from `index.js`. Each module is `require()`d in sequence.

---

## Pros

- **Separation of concerns** — Routes, controllers, models, services, and utilities are cleanly divided into separate folders with single responsibilities.
- **Modular startup** — The `startup/` pattern keeps `index.js` clean and makes each initialization step independently testable/replaceable.
- **Refresh token pattern** — The dual-token (access + refresh) auth system with HTTP-only signed cookies persisted in MongoDB is a solid, industry-standard security approach.
- **Separate password storage** — Storing password hashes in their own collection (`passwords`) decouples credentials from user records and reduces accidental exposure.
- **Standardized response shape** — `sendSuccessResponse` / `catchError` enforce a consistent envelope (`{ content: { target, meta, error } }`), making frontend integration predictable.
- **Environment-based config** — Secrets (JWT keys, DB connection, cookie secret) are loaded from environment variables, not hardcoded.
- **Centralized error middleware** — `catchError.js` as a terminal middleware registered after all routes ensures unhandled errors are caught in one place.
- **Email confirmation flow** — Sign-up requires email verification before account activation, protecting against fake accounts.

---

## Cons

- ~~**Error handler always returns HTTP 200**~~ — ✅ **Fixed (May 8, 2026).** `catchError.js` now resolves the status code from `err.status || err.statusCode || 500` and returns it as the HTTP response status. A unit test suite (`__tests__/catchError.test.js`) covering 6 cases was added to verify the behavior.
- **Outdated Joi API** — Models use `Joi.validate()` which was removed in Joi v16+. This will silently fail or throw at runtime depending on the installed version.
- ~~**Broken rate limit logic**~~ — ✅ **Fixed (May 8, 2026).** `middleware/rateLimit.js` is now the single source of truth. The bracket-notation bug was corrected, `windowMs` casing fixed, the handler status corrected from 400 to 429, and the routing decision extracted into a pure `selectTier()` function. Unit tests added (`__tests__/rateLimit.test.js`, 10 passing tests).
- **Incomplete test coverage** — Vitest is configured and `__tests__/catchError.test.js` has been added (6 passing tests), but coverage remains limited. No integration or e2e tests exist, and the majority of routes, controllers, and models are still untested.
- ~~**Dead/disabled code**~~ — ✅ **Fixed (May 8, 2026).** All `return next()` bypasses removed from `addSkills`, `updateSkill` (skill.js), `addTask`, `updateTask`, `completeTask` (task.js), `addExperience`, `updateExperience`, `deleteExperience` (experience.js). Commented-out DB logic restored and uncommented. Test scaffolding comments removed from `resume_routes.js`.
- **Email host hardcoded in source** — `service/email.js` hardcodes `host: "punchcodestudios.com"`. This should be environment-configured alongside other SMTP credentials.
- ~~**No NoSQL injection protection**~~ — ✅ **Fixed (May 8, 2026).** `express-mongo-sanitize` is now registered globally in `index.js` immediately after `express.json()`, stripping any key beginning with `$` or containing `.` from `req.body`, `req.query`, and `req.params` before reaching any route handler. A test suite (`__tests__/mongoSanitize.test.js`, 6 passing tests) verifies the behavior.
- **Incomplete service layer** — Email sending logic lives in `controllers/mail.js` rather than `service/`. The `service/email.js` and `service/sendgrid.js` files are unused stubs.
- ~~**Duplicate rate limit systems**~~ — ✅ **Fixed (May 8, 2026).** Inline rate-limit block removed from `index.js`. `middleware/rateLimit.js` is now the sole configuration, imported via `app.use(rateLimitMiddleware)`.
- ~~**No pagination**~~ — ✅ **Fixed (May 8, 2026).** `utils/pagination.js` added with `parsePagination()` and `buildPaginationMeta()`. `getAllSkills`, `getAllExperience`, and `getTasks` now accept `?page=&limit=` query params (default 100, max 100). Responses include `{ page, limit, totalCount, totalPages }` in `meta`. `getTasks` sort moved from JS to MongoDB `.sort({ dueDate: 1 })`.
- ~~**SPA catch-all conflicts with API routes**~~ — ✅ **Fixed (May 8, 2026).** A dedicated `/api` 404 handler registered in `startup/routes.js` returns `{ error: { status: 404, message: "API route not found" } }` for unmatched API routes. The SPA catch-all in `index.js` guards against `/api` paths with an early `next()`.
- ~~**No request-level logging**~~ — ✅ **Fixed (May 8, 2026).** `morgan` installed and piped into the existing Winston `appLogger` at `info` level via `startup/routes.js`. Logs `:method :url :status :res[content-length] - :response-time ms` for `/api` routes only; non-API paths skipped.

---

## Summary

| Area                       | Rating     | Note                                                   |
| -------------------------- | ---------- | ------------------------------------------------------ |
| Project structure          | Good       | Clean folder layout                                    |
| Auth security              | Good       | Dual-token, signed cookies, bcrypt                     |
| Error handling             | Good       | Fixed — correct HTTP status codes returned             |
| Input validation           | Moderate   | Joi present but outdated API                           |
| Testing                    | Partial    | catchError covered; most code untested                 |
| Dead code                  | Good       | Fixed — all bypasses restored (May 8, 2026)            |
| Service layer              | Incomplete | Email service is a stub                                |
| Rate limiting              | Good       | Fixed — consolidated, bug corrected (May 8, 2026)      |
| NoSQL injection protection | Good       | Fixed — express-mongo-sanitize applied globally        |
| Pagination                 | Good       | Fixed — page/limit params, metadata (May 8, 2026)      |
| Request logging            | Good       | Fixed — Morgan → Winston, API routes (May 8, 2026)     |
| SPA/API routing            | Good       | Fixed — API 404 handler, catch-all guard (May 8, 2026) |
