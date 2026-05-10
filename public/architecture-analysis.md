# Architecture Analysis — react-portfolio-api

**Date:** May 9, 2026

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
- **Role-based access control** — `isAuthenticated` + `isAdmin` middleware chain enforces separation between authenticated users and admin-only operations. Admin role is stored in the `User.roles` array and checked on every request via the DB-backed user lookup — roles cannot go stale via token payload.
- **Refresh token invalidation** — Logout deletes the refresh token from the `WebToken` collection. A subsequent request with the same access token is rejected because the refresh token DB check fails, making session termination meaningful.

---

## Open Items

- **Incomplete test coverage** — Vitest is configured and `__tests__/catchError.test.js` has been added (6 passing tests), but coverage remains limited. No integration or e2e tests exist, and the majority of routes, controllers, and models are still untested.
- **`skill_type` resource removed** — `routes/skill_type_routes.js` was deleted as legacy. If re-introduced, it should be rewritten to match the controller/pipeline pattern and use `isAuthenticated`/`isAdmin` on mutations.

---

## Resolved Items

- ~~**Error handler always returns HTTP 200**~~ — ✅ **Fixed (May 8, 2026).** `catchError.js` now resolves the status code from `err.status || err.statusCode || 500` and returns it as the HTTP response status. A unit test suite (`__tests__/catchError.test.js`) covering 6 cases was added to verify the behavior.
- ~~**Outdated Joi API**~~ — ✅ **Fixed (May 8, 2026).** All 11 models updated: plain schema objects wrapped with `Joi.object()`, `Joi.validate(data, schema)` replaced with `schema.validate(data)`. Pre-existing bug in `models/password.js` also fixed (`Joi.unique()` → `Joi.string().required()`).
- ~~**Broken rate limit logic**~~ — ✅ **Fixed (May 8, 2026).** `middleware/rateLimit.js` is now the single source of truth. The bracket-notation bug was corrected, `windowMs` casing fixed, the handler status corrected from 400 to 429, and the routing decision extracted into a pure `selectTier()` function. Unit tests added (`__tests__/rateLimit.test.js`, 10 passing tests).
- ~~**Dead/disabled code**~~ — ✅ **Fixed (May 8, 2026).** All `return next()` bypasses removed from `addSkills`, `updateSkill` (skill.js), `addTask`, `updateTask`, `completeTask` (task.js), `addExperience`, `updateExperience`, `deleteExperience` (experience.js). Commented-out DB logic restored and uncommented. Test scaffolding comments removed from `resume_routes.js`.
- ~~**Email host hardcoded in source**~~ — ✅ **Fixed (May 8, 2026).** `service/email.js` fully rewritten — all credentials (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `DEFAULT_EMAIL_RECIP`) moved to environment variables. `.env.example` created documenting all required variables.
- ~~**No NoSQL injection protection**~~ — ✅ **Fixed (May 8, 2026).** `express-mongo-sanitize` is now registered globally in `index.js` immediately after `express.json()`, stripping any key beginning with `$` or containing `.` from `req.body`, `req.query`, and `req.params` before reaching any route handler. A test suite (`__tests__/mongoSanitize.test.js`, 6 passing tests) verifies the behavior.
- ~~**Incomplete service layer**~~ — ✅ **Fixed (May 8, 2026).** `service/sendgrid.js` and `service/email.js` rewritten as proper service modules. `controllers/mail.js` refactored to delegate all sends through `sendgridService`. Direct `@sendgrid/mail` usage and `setApiKey()` call removed from the controller. Unused `ejs` import and dangling `send()` function removed. `sendContact` restored (was disabled). Double-`next()` bug fixed in `sendRegistrationConfirmation`.
- ~~**Duplicate rate limit systems**~~ — ✅ **Fixed (May 8, 2026).** Inline rate-limit block removed from `index.js`. `middleware/rateLimit.js` is now the sole configuration, imported via `app.use(rateLimitMiddleware)`.
- ~~**No pagination**~~ — ✅ **Fixed (May 8, 2026).** `utils/pagination.js` added with `parsePagination()` and `buildPaginationMeta()`. `getAllSkills`, `getAllExperience`, and `getTasks` now accept `?page=&limit=` query params (default 100, max 100). Responses include `{ page, limit, totalCount, totalPages }` in `meta`. `getTasks` sort moved from JS to MongoDB `.sort({ dueDate: 1 })`.
- ~~**SPA catch-all conflicts with API routes**~~ — ✅ **Fixed (May 8, 2026).** A dedicated `/api` 404 handler registered in `startup/routes.js` returns `{ error: { status: 404, message: "API route not found" } }` for unmatched API routes. The SPA catch-all in `index.js` guards against `/api` paths with an early `next()`.
- ~~**No request-level logging**~~ — ✅ **Fixed (May 8, 2026).** `morgan` installed and piped into the existing Winston `appLogger` at `info` level via `startup/routes.js`. Logs `:method :url :status :res[content-length] - :response-time ms` for `/api` routes only; non-API paths skipped.
- ~~**Auth dormant / misconfigured**~~ — ✅ **Fixed (May 9, 2026).** All JWT secrets and TTL values moved to env vars. TTL standardized to `ms()` string format (`"1h"`, `"7d"`) across `auth-utils.js` and `controllers/auth.js`. Refresh token DB validation restored in `isAuthenticated` — logout now truly invalidates sessions. `createPassword` bug fixed (password was stored plaintext; now hashed with bcrypt). `Skill.findOne` missing `await` in `addSkills` fixed (duplicate check always triggered). `.env.example` updated.
- ~~**No role-based authorization**~~ — ✅ **Fixed (May 9, 2026).** `middleware/admin.js` updated to check `req.user?.roles?.includes("ADMIN")`. `isAdmin` added to all DELETE routes in `resume_routes.js` and to list/byId routes in `admin_user_routes.js`. GET routes remain public; POST/PUT require `isAuthenticated`; DELETE requires `isAuthenticated` + `isAdmin`.
- ~~**Unprotected mutation routes**~~ — ✅ **Fixed (May 9, 2026).** `POST /api/exam/seed-exams` now requires `isAuthenticated`. Legacy `skill_type_routes.js` (all mutations unprotected, different pattern) removed entirely.
- ~~**Duplicate delete routes**~~ — ✅ **Fixed (May 9, 2026).** `DELETE /delete-all-skills` removed (duplicate of `/delete-skills`). `deleteSkill` controller simplified to single-delete via `findByIdAndDelete` — unreachable bulk-via-body branches removed.

---

## Summary

| Area                       | Rating  | Note                                                         |
| -------------------------- | ------- | ------------------------------------------------------------ |
| Project structure          | Good    | Clean folder layout                                          |
| Auth security              | Good    | Dual-token, signed cookies, bcrypt, RBAC (May 9, 2026)       |
| Error handling             | Good    | Fixed — correct HTTP status codes returned                   |
| Input validation           | Good    | Fixed — Joi.object() + schema.validate() (May 8, 2026)       |
| Testing                    | Partial | catchError covered; most code untested                       |
| Dead code                  | Good    | Fixed — all bypasses restored (May 8, 2026)                  |
| Service layer              | Good    | Fixed — email delegated to service layer (May 8, 2026)       |
| Rate limiting              | Good    | Fixed — consolidated, bug corrected (May 8, 2026)            |
| NoSQL injection protection | Good    | Fixed — express-mongo-sanitize applied globally              |
| Pagination                 | Good    | Fixed — page/limit params, metadata (May 8, 2026)            |
| Request logging            | Good    | Fixed — Morgan → Winston, API routes (May 8, 2026)           |
| SPA/API routing            | Good    | Fixed — API 404 handler, catch-all guard (May 8, 2026)       |
| Authorization (RBAC)       | Good    | Fixed — isAdmin middleware, role-gated DELETEs (May 9, 2026) |
