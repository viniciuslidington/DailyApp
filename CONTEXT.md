# Daily — Domain Context

> Living glossary. Seeded from `docs/PLANNING.md` §3.3 and §5. Update terms here as decisions crystallize; keep entries meaningful to a domain expert, not implementation-level.

## Glossary

### Reminder
A **one-shot event** (appointment, birthday, bill) with a date and one or more **scheduled notifications** derived from a [[Schedule]]. Editing the event date recomputes every scheduled notification. Persisted in the `reminders` table; its notifications live in `scheduled_notifications`.

### Routine
A **recurring habit** (drink water, stretch, read, walk, meditate, custom) defined by `days_of_week × times_of_day`. Generates a rolling window of notifications. Has an optional **goal** (e.g. 3× per week) and a per-day **completion log**. Distinct from [[Reminder]]: a routine never has a "fire date" — it has cadence.

### Schedule
The notification plan attached to a [[Reminder]]. Two shapes (stored in `schedule_config` JSONB):
- **Preset:** `on_day | day_before | three_days | week_before`.
- **Custom:** an array of `{days, time}` offsets (e.g. "3 days before at 9am, 1 day before at 8pm, on the day at 8am").
A schedule is purely declarative; the trigger in §3.4 of PLANNING.md materializes it into `scheduled_notifications`.

### Routine log
A single row per `(routine_id, log_date)` recording whether the user marked the routine done that day. Source of truth for **streaks** and **completion %** on the Stats tab. Uniqueness constraint prevents double-logging.

### Scheduled notification
A queued push delivery in `scheduled_notifications`. `source_type ∈ {reminder, routine}` plus `source_id` ties it back. The `dispatch_push` edge function (60s cron) drains rows with `status='pending' AND send_at <= now()`.

### Push subscription
A device-bound Web Push registration (`endpoint + p256dh + auth`). A user may have many — one per installed PWA. Cleaned up when delivery returns 410 Gone.

### Onboarding
The 7-screen first-run flow (Welcome → Sign up → Name → Reminder time → Notifications → All set, plus Login for returning users). Setting `user_preferences.onboarding_completed = true` is the gate that sends users to Home.

## Open questions
See `docs/PLANNING.md` §9 — eight unresolved decisions (D-01 to D-08) blocking Phases 1-5.
