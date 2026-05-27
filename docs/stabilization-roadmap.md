# ECWA Portal Stabilization Roadmap

This file keeps the next cleanup steps clear and quota-safe.

## Current State

- The app is a React single-page portal.
- Most features live in `src/App.jsx`.
- Data is saved to Supabase mainly through the `app_state` table as large JSON values.
- Some uploaded files are stored as base64 text inside database records.
- Email notifications use EmailJS only when environment variables are configured.

## Work Already Started

- Supabase client moved to `src/lib/supabase.js`.
- Email helper moved to `src/lib/email.js`.
- `.env.example` added for setup clarity.
- File uploads that enter database JSON now have a 2 MB guard.
- The starter React test was replaced with a real login-screen smoke test.

## Quota-Safe Next Steps

These should not meaningfully increase Supabase usage:

1. Extract helper functions and constants from `App.jsx`.
2. Extract each module into its own file:
   - finance
   - leave
   - Sunday reports
   - attendance
   - personnel
   - master admin
3. Add more smoke tests for login, signup view, and module rendering.
4. Add a database migration plan before touching live data.

## Database Migration Plan

Do this only after a Supabase backup/export.

Suggested future tables:

- `users`
- `finance_requests`
- `leave_requests`
- `sunday_reports`
- `attendance_records`
- `announcements`
- `password_reset_requests`
- `audit_logs`
- `app_settings`
- `user_assets`

Keep files/photos out of JSON rows where possible. Store only metadata and URLs in database tables.

## Free-Tier Safety Notes

- Normal rows such as staff names, leave requests, finance approvals, and attendance records are small.
- Files, photos, signatures, and base64 documents are the main quota risk.
- Supabase Storage or strict upload limits should be used before many real documents are uploaded.

## Before Risky Work

Before database restructuring or authentication changes:

1. Export Supabase data.
2. Keep the old `app_state` data unchanged.
3. Build migration scripts that copy data rather than delete it.
4. Test locally before pointing users to the new flow.
