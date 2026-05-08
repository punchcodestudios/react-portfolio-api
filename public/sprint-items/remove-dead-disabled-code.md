# Refactor: Remove or Restore Dead/Disabled Code

## Problem

Several controllers contain `return next()` at the top of their handler functions, silently bypassing all logic. Affected areas include `addSkills`, and portions of `exam.js`, `task.js`, and `experience.js`. There is no indication of whether these are intentionally disabled or unfinished.

## Acceptance Criteria

- Each disabled function is either restored with working logic or explicitly removed along with its route registration.
- No route points to a handler that immediately passes through without doing anything.
- Decisions are documented with a brief inline comment where relevant.

## Files Affected

- `controllers/skill.js`
- `controllers/exam.js`
- `controllers/task.js`
- `controllers/experience.js`
- Corresponding route files
