# Feature: Add Pagination to Collection Endpoints

## Problem

Endpoints that return collections (skills, tasks, experiences) fetch all documents from MongoDB with no limit. As data grows this causes slow responses, high memory usage, and large payloads sent to clients.

## Acceptance Criteria

- Collection endpoints accept `page` and `limit` query parameters (e.g. `?page=1&limit=20`).
- Responses include pagination metadata: `totalCount`, `page`, `limit`, `totalPages`.
- A maximum page size is enforced server-side (e.g. 100 documents).
- Existing clients that omit pagination params receive a sensible default (e.g. first 20 results).

## Files Affected

- `controllers/skill.js`
- `controllers/task.js`
- `controllers/experience.js`
- Corresponding route files
