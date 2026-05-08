# Fix: Outdated Joi Validation API

## Problem

Models use `Joi.validate()`, which was removed in Joi v16+. Depending on the installed version, this either silently fails or throws at runtime, meaning input validation may not be running at all.

## Acceptance Criteria

- All `Joi.validate(data, schema)` calls are replaced with `schema.validate(data)`.
- Validation errors are correctly propagated to the error handler.
- All affected models are updated and manually tested.

## Files Affected

- `models/user.js`
- `models/skill.js`
- `models/task.js`
- `models/experience.js`
- `models/exam.js`
- Any other model using `Joi.validate()`
