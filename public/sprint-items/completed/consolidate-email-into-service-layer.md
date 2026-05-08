# Refactor: Move Email Logic into the Service Layer

## Problem

Email sending logic lives in `controllers/mail.js` instead of `service/`. The files `service/email.js` and `service/sendgrid.js` exist as unused stubs. This mixes transport concerns with request-handling concerns and makes the email implementation harder to swap or test.

## Acceptance Criteria

- Email sending logic (SendGrid calls, template generation) is moved into `service/email.js` or `service/sendgrid.js`.
- `controllers/mail.js` delegates to the service layer rather than containing transport logic.
- The unused stub files are either populated or removed.
- Behavior is unchanged from the consumer's perspective.

## Files Affected

- `controllers/mail.js`
- `service/email.js`
- `service/sendgrid.js`
