# Daily — Project Planning

> **Version:** 1.0
> **Last updated:** 2026-05-23
> **Owner:** Solo developer
> **Methodology:** Waterfall (sequential phases with acceptance criteria)
> **Current stage:** Phase 0 — Design and validation (~90%)
> **Development environment:** Claude Code (CLI) + GitHub
> **Target market:** Global (English-first; localization deferred to post-MVP)

---

## Changelog

- **v1.0** — English-first global app. All product copy and docs in English. Calibrated against real design tokens extracted from the Claude Design project (`screens.jsx`, `create-reminder.jsx`, `routine.jsx`, `tabs.jsx`). Final pre-implementation baseline.

---

## 1. Overview

### 1.1 Problem

People rely on calendar apps, task lists, or notes to remember future events — but every option shares the same pain: **configuring reminders is tedious**. Each additional reminder means another form, another date picker, another time picker. Existing countdown apps offer little flexibility ("1 day before" or "3 days before", no customization). Calendar apps offer full flexibility, but with high friction. There's no middle ground that respects both power and speed.

### 1.2 Value proposition

**Daily** is a reminder and routine app whose differentiation lies in **configuration UX**: users set multiple reminders per event or routine in a handful of taps using visual presets and pre-configured time slots. The friction drops to near zero.

### 1.3 Differentiators

- **Visual, customizable schedule**: quick presets (`On the day`, `1 day before`, `3 days before`) plus a custom mode with per-day time selection.
- **Reminder + Routine duality**: one-shot events (appointments, birthdays) and recurring routines (workout, medication) with execution tracking.
- **Optional daily goal per routine**: users set a target ("3× per week") and see progress.
- **Native stats**: visual feedback on consistency (streaks, completion %).
- **Offline-first**: the app works without connectivity; sync is transparent.
- **iOS-first design**: built specifically for iPhone (iPhone 16 Pro is the reference device).
- **English-first, global from day one**: no regional gating, no localization debt to clear later.

### 1.4 MVP scope

Private distribution (PWA) for the author and ~10 friends to validate UX and notification reliability before any investment in native apps or marketing.

**Includes (25 screens mapped in the design + ~5 pending):**

| Block | Screens | Items |
|---|---|---|
| **Signup** | 7 | Welcome, Sign up, Name, Reminder time, Notifications, All set, Login |
| **Home** | 4 | Today, All, Stats, You |
| **Create reminder** | 8 | Title, When, Schedule (+ 3b Custom days, 3c Custom times), Message, Review, Created |
| **Create routine** | 5 | Pick, Days, Times, Goal, Created |
| **Pending** | ~6 | Reminder detail/edit, Routine detail/edit, Install (PWA), Forgot password, Empty/error states |

**Out of MVP scope:**
- Native iOS/Android apps.
- Social login (Apple/Google) — add in v1.1 if there's demand.
- Event sharing between users.
- WhatsApp / email integrations.
- Complex recurring events (RRULE) — only simple recurrence (yearly/monthly/weekly) for reminders and weekday-based recurrence for routines.
- iCloud / Google Drive backup.
- User-defined categories (only fixed presets).
- Bulk edit of reminders.
- Localization beyond English (no i18n machinery in MVP — but code structured so it can be added without refactor).

---

## 2. Requirements

### 2.1 Functional

#### Authentication
| ID | Requirement | Priority |
|---|---|---|
| RF-A01 | Users can create an account with email + password | Must |
| RF-A02 | Users can sign in with existing email + password | Must |
| RF-A03 | Users set their display name during onboarding | Must |
| RF-A04 | Users set their default reminder time during onboarding | Must |
| RF-A05 | The system requests notification permission during onboarding | Must |
| RF-A06 | Users can reset password by email | Should |
| RF-A07 | Logout available from the "You" tab | Must |

#### Reminders (one-shot events)
| ID | Requirement | Priority |
|---|---|---|
| RF-R01 | Users can create a reminder with title and type | Must |
| RF-R02 | Users can set event date and time | Must |
| RF-R03 | Users pick a notification schedule (preset or custom) | Must |
| RF-R04 | Custom schedule allows selecting specific days before the event | Must |
| RF-R05 | Each custom-schedule day can have its own time | Must |
| RF-R06 | Users can add a custom message | Should |
| RF-R07 | Review screen summarizes everything before saving | Must |
| RF-R08 | Moving the event date recalculates scheduled notifications | Must |

#### Routines (recurring)
| ID | Requirement | Priority |
|---|---|---|
| RF-T01 | Users can create a routine by picking a preset type | Must |
| RF-T02 | Users define which days of the week the routine occurs | Must |
| RF-T03 | Users define times (one or more per day) | Must |
| RF-T04 | Users can optionally set a weekly goal ("3× per week") | Should |
| RF-T05 | Users can mark a routine as done for the day | Must |
| RF-T06 | The system records completion history | Must |

#### Home and navigation
| ID | Requirement | Priority |
|---|---|---|
| RF-H01 | **Today** tab lists today's reminders and routines | Must |
| RF-H02 | **All** tab lists every reminder and routine | Must |
| RF-H03 | **Stats** tab shows streaks and completion % | Must |
| RF-H04 | **You** tab shows profile, settings, logout | Must |
| RF-H05 | A "+" button opens a sheet to create a reminder or routine | Must |

#### Notifications
| ID | Requirement | Priority |
|---|---|---|
| RF-N01 | The system fires push notifications at the configured time | Must |
| RF-N02 | Push works while the app is closed (PWA installed) | Must |
| RF-N03 | Tapping a notification opens the related item | Must |
| RF-N04 | A routine notification offers inline "Done" | Could |

#### System
| ID | Requirement | Priority |
|---|---|---|
| RF-S01 | The app handles CRUD offline; sync occurs on reconnect | Must |
| RF-S02 | An "Install" page detects platform and teaches installation | Must |
| RF-S03 | Dark mode toggle in "You" | Should |
| RF-S04 | Manual backup (JSON export) | Could |

### 2.2 Non-functional

- **Performance**: initial load < 1.5s on 4G; create operation < 200ms (optimistic local).
- **Availability**: notification cron with informal SLA of ~1 minute precision.
- **Privacy**: HTTPS in transit; Supabase encryption at rest. No third-party tracking.
- **Offline-first**: 100% of CRUD operations work offline.
- **Accessibility**: WCAG AA contrast, ARIA labels, touch targets ≥ 44pt.
- **Internationalization**: English only in MVP; code paths use i18n keys so future locales are non-breaking.
- **Timezone-aware**: UTC storage + user IANA timezone.
- **Dark mode**: first-class; manual toggle (no system-auto in MVP).

### 2.3 Constraints

- **iOS PWA**: notifications only work if installed to the home screen (iOS 16.4+).
- **iOS PWA**: no reliable `showTrigger` → **a server is mandatory** for time-based push.
- **Notification permission**: requested only after explicit user interaction.
- **Solo dev**: capacity ~10h/week → schedule of 11-12 weeks for MVP.
- **Costs**: MVP must operate within every service's free tier.
- **Reference device**: iPhone 16 Pro (390 × 844 logical).

---

## 3. Architecture

### 3.1 Component diagram

```
┌──────────────────────────┐
│        PWA Client        │
│  ┌────────────────────┐  │
│  │   Next.js 15 App   │  │
│  │  (React + TanStack)│  │
│  └─────────┬──────────┘  │
│            │             │
│  ┌─────────▼──────────┐  │
│  │   Dexie (IndexedDB)│  │  ← Offline-first
│  └─────────┬──────────┘  │
│            │             │
│  ┌─────────▼──────────┐  │
│  │  Service Worker    │  │  ← Receives push, caches assets
│  └────────────────────┘  │
└────────┬─────────────────┘
         │
         │ HTTPS (REST + Realtime)
         │
┌────────▼─────────────────┐
│       Supabase           │
│  ┌────────────────────┐  │
│  │  PostgreSQL        │  │
│  │  - users           │  │
│  │  - reminders       │  │
│  │  - routines        │  │
│  │  - routine_logs    │  │
│  │  - subscriptions   │  │
│  │  - scheduled_notif │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Edge Functions    │  │
│  │  - dispatch_push   │  │
│  │  - rotate_routines │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Auth (email+pwd)  │  │
│  └────────────────────┘  │
└────────┬─────────────────┘
         │
         │ web-push (VAPID)
         │
┌────────▼─────────────────┐
│   FCM (Android) / APNs   │
│         (iOS)            │
└──────────────────────────┘
```

### 3.2 Tech stack

#### Frontend
- **Next.js 15** (App Router, RSC where useful)
- **TypeScript** (strict mode)
- **TanStack Query** v5 (server state)
- **Zustand** (client cross-component state)
- **Dexie.js** v4 (IndexedDB)
- **Serwist** (Service Worker + manifest — modern `next-pwa` successor)
- **Tailwind CSS** v4 with `@theme` mapping the design tokens
- **shadcn/ui** + Radix UI primitives
- **Framer Motion** for chip transitions and page transitions
- **date-fns** + **date-fns-tz** (timezone)
- **react-hook-form** + **zod**
- **lucide-react** (icons)

#### Backend
- **Supabase**: Postgres, Auth (email + password), Edge Functions (Deno), Realtime (optional)
- **web-push** (npm) for Web Push delivery (VAPID)
- **Supabase Scheduled Functions** or **Upstash QStash** for cron

#### Infra
- **Vercel** (hobby tier) — Next.js hosting
- **Supabase free tier** — backend
- **Custom domain** (.app or .com) — HTTPS is mandatory for PWA
- **Sentry free tier** — error capture
- **PostHog free tier** — optional analytics

#### Dev tooling
- **Claude Code** (CLI) — pair programming during development
- **pnpm** — package manager
- **Biome** — lint + format (faster than ESLint + Prettier)
- **GitHub Actions** — CI (lint + typecheck + build)
- **Husky + lint-staged** — pre-commit
- **Conventional Commits** — commit semantics

### 3.3 Data model

```sql
-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  default_reminder_time TIME NOT NULL DEFAULT '09:00',
  dark_mode BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  notification_permission_granted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reminders (one-shot events)
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reminder_type TEXT NOT NULL, -- 'event' | 'appointment' | 'bill' | 'birthday' | 'other'
  event_date TIMESTAMPTZ NOT NULL,
  message TEXT,
  schedule_type TEXT NOT NULL, -- 'preset' | 'custom'
  schedule_config JSONB NOT NULL,
  timezone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reminders_user_date ON reminders(user_id, event_date);

-- schedule_config JSON format:
-- Preset: { "preset": "on_day" | "day_before" | "three_days" | "week_before" }
-- Custom: { "offsets": [{"days": 3, "time": "09:00"}, {"days": 1, "time": "20:00"}, {"days": 0, "time": "08:00"}] }

-- Routines (recurring)
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  routine_type TEXT NOT NULL, -- 'drink_water' | 'stretch' | 'read' | 'walk' | 'meditate' | 'custom'
  days_of_week INTEGER[] NOT NULL, -- 0=Sunday, 6=Saturday
  times_of_day TIME[] NOT NULL,
  goal_per_week INTEGER, -- optional, e.g. 3
  goal_unit TEXT, -- 'sessions' | 'minutes' | 'reps' (future)
  active BOOLEAN DEFAULT true,
  timezone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_routines_user ON routines(user_id, active);

-- Routine completion log (for stats)
CREATE TABLE routine_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  completed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ,
  UNIQUE(routine_id, log_date)
);

CREATE INDEX idx_routine_logs_user_date ON routine_logs(user_id, log_date);

-- Push subscriptions (per device)
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

-- Scheduled notification queue
CREATE TABLE scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL, -- 'reminder' | 'routine'
  source_id UUID NOT NULL,
  send_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending' | 'sent' | 'failed' | 'cancelled'
  attempts INTEGER DEFAULT 0,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_scheduled_pending ON scheduled_notifications(send_at)
  WHERE status = 'pending';

-- RLS on every table (policies: users only see their own rows)
```

### 3.4 Notification flow

**Reminder (one-shot):**
1. User creates a reminder with a schedule.
2. Client persists to Dexie + sends to Supabase.
3. Postgres trigger calculates UTC timestamps and populates `scheduled_notifications`.
4. Edge function `dispatch_push` (cron every 60s) picks pending rows and sends via web-push.

**Routine (rolling):**
1. User creates a routine with `days_of_week` and `times_of_day`.
2. Edge function `rotate_routines` runs once a day (per user timezone) and generates the day's notifications for active routines.
3. Same `dispatch_push` Edge function delivers them.

**Receive:** Service Worker shows the notification; tap opens a deep link to the item.

### 3.5 Offline-first strategy

- Dexie is the local source of truth.
- Each mutation writes to an `outbox` table with a ULID.
- A sync worker drains the queue when online.
- Conflicts: last-write-wins by `updated_at` (simple and sufficient for MVP).

---

## 4. Project phases

### Phase 0 — Design and validation (in progress)

**Goal:** all visual flows approved in Claude Design before any code.

**Status:** ~90% complete. Missing screens:
- [ ] Reminder detail / edit
- [ ] Routine detail / edit + completion log
- [ ] "How to install" (PWA install instructions)
- [ ] Forgot password
- [ ] Empty states (Today empty, All empty, Stats no data)
- [ ] Error states (no connection, sync failure)

**Acceptance:** all 25+ screens with approved visuals, including empty/error states.

---

### Phase 1 — Technical foundation

**Goal:** project setup, minimal infra running, working auth.

**Deliverables:**
- GitHub repo with README, .gitignore, license, Conventional Commits.
- Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui project.
- PWA configured (manifest, icons, Serwist service worker).
- Supabase project with initial schema (versioned migrations).
- Auth email + password (sign up, login, logout, forgot password).
- Continuous deployment on Vercel (preview per PR).
- GitHub Actions CI: lint + typecheck + build.
- Design tokens implemented as CSS variables (see DESIGN.md).

**Acceptance:**
- Sign up + login + logout working in production.
- Lighthouse PWA score ≥ 90.
- Green CI.
- Base components (Button, Input, Card) follow DESIGN.md.

**Estimated duration:** 5-7 days.

---

### Phase 2 — Onboarding

**Goal:** implement the full signup flow (7 screens).

**Deliverables:**
- S1 Welcome
- S2 Sign up (email + password)
- S3 Your name
- S4 Reminder time (default time)
- S5 Notifications (permission)
- S6 All set
- Login (returning user)
- Persistence in `user_preferences`.

**Acceptance:**
- Full new-user flow completes in < 60 seconds.
- Notification permission is requested on screen 5 (after explicit interaction).
- Returning user goes directly to Home.
- Logout returns to Login.

**Estimated duration:** 5-7 days.

---

### Phase 3 — Reminders (CRUD)

**Goal:** full reminder creation flow (8 screens).

**Deliverables:**
- CR1 Title & type
- CR2 Date & time
- CR3 Notification schedule (presets)
- CR3b Custom · pick days
- CR3c Custom · per-day times
- CR4 Message
- CR5 Review
- CR6 Created
- Reminder edit and delete.
- Persistence in Dexie + Supabase.

**Acceptance:**
- Creating a reminder with 3 reminders at different times works end-to-end.
- Editing the date recomputes `scheduled_notifications`.
- Offline operation persists to Dexie and syncs when back online.

**Estimated duration:** 7-10 days.

---

### Phase 4 — Routines (CRUD)

**Goal:** full routine creation flow (5 screens) + completion log.

**Deliverables:**
- RT1 Pick routine
- RT2 Days of week
- RT3 Times of day
- RT4 Daily goal
- RT5 Created
- Routine edit and delete.
- Daily completion check.

**Acceptance:**
- Creating a routine "Workout Mon/Wed/Fri at 7am" works.
- Marking it done creates a `routine_logs` row.
- Deleting a routine cancels future notifications.

**Estimated duration:** 5-7 days.

---

### Phase 5 — Home, Stats, You

**Goal:** the 4 main tabs working with real data.

**Deliverables:**
- Today (today's reminders + routines)
- All (full list, filters, ordering)
- Stats (streaks, completion % over last 7 / 30 days)
- You (profile, dark mode toggle, about, logout)
- "+" button with create sheet (reminder or routine).

**Acceptance:**
- Today shows today's items in chronological order correctly.
- Stats compute completion % over 7 and 30-day windows.
- Dark mode applies on every screen.

**Estimated duration:** 7-10 days.

---

### Phase 6 — Notifications

**Goal:** real notifications arriving at the right time.

**Deliverables:**
- Service Worker with `push` and `notificationclick` handlers.
- Push subscription registration after onboarding.
- Edge function `dispatch_push` (cron 60s).
- Edge function `rotate_routines` (daily cron).
- Postgres trigger populating `scheduled_notifications`.
- Deep link from notification to item.

**Acceptance:**
- Reminder set for 2 minutes from now → notification on Android and iPhone (PWA installed).
- Routine active at 7am → notification at 7am on the right day.
- Tapping opens the item.
- App closed: still received.

**Estimated duration:** 7-10 days.

---

### Phase 7 — Polish & install screen

**Goal:** app ready for a non-technical friend to install alone.

**Deliverables:**
- "How to install" screen with iOS Safari vs others detection.
- Short GIF/video of iOS install flow.
- Empty states on every list.
- Toasts and visual feedback.
- Loading skeletons.
- Framer Motion animations (chips, transitions).
- Floating feedback form.
- Minimal PostHog telemetry (events: signup, create item, notification received).

**Acceptance:**
- Heuristic walkthrough with no blocking bugs.
- Lighthouse: Performance ≥ 90, PWA ≥ 100, A11y ≥ 95.
- Non-technical user installs without external help.

**Estimated duration:** 5-7 days.

---

### Phase 8 — Closed beta

**Goal:** 5-10 friends using the app for 2 weeks.

**Deliverables:**
- Custom domain + HTTPS.
- Landing page with pitch + CTA.
- Allow-list of authorized emails.
- Invitation message + tutorial video (1 minute).
- Feedback channel (WhatsApp / Discord).
- Minimal admin panel (saved Supabase query).

**Acceptance:**
- 5+ friends installed and created at least 1 reminder or routine.
- ≥ 80% of notifications arrive within 2 min of their scheduled time.
- ≥ 3 feedback notes collected.

**Estimated duration:** 2-3 days of prep; 2 weeks of real use.

---

### Phase 9 — Findings & decision

**Goal:** decide on public v1 vs adjustments vs pivot.

**Deliverables:**
- Findings document.
- Prioritized v1 backlog.
- Go/no-go for native app investment.

---

### Schedule summary

| Phase | Duration | Cumulative |
|---|---|---|
| 0 — Design | wrapping up | — |
| 1 — Foundation | 5-7d | ~1 week |
| 2 — Onboarding | 5-7d | ~2 weeks |
| 3 — Reminders | 7-10d | ~3-4 weeks |
| 4 — Routines | 5-7d | ~4-5 weeks |
| 5 — Home/Stats/You | 7-10d | ~5-6 weeks |
| 6 — Notifications | 7-10d | ~7-8 weeks |
| 7 — Polish | 5-7d | ~8-9 weeks |
| 8 — Beta | 2-3d + 2 weeks use | ~10-11 weeks |
| 9 — Findings | 2-3d | ~11-12 weeks |

**Total: 11-12 weeks** (at 10h/week) to post-beta.

---

## 5. Design flows

> **This section is living.** As each flow is finalized in Claude Design, add/update a subsection with description, screens, states, components, endpoints, and the "done" criterion.

### 5.1 Signup flow (7 screens) — defined in design

**Screens:** Welcome → Sign up → Name → Reminder time → Notifications → All set + Login (returning).

**States to cover:**
- Sign up: invalid email, weak password, email already in use, network error.
- Login: invalid credentials, unknown email, network error.
- Permission: granted, denied (show path to system settings).

**Components to build:**
- `OnboardingLayout` (progress dots, back button, page transitions).
- `EmailInput`, `PasswordInput` (with visibility toggle).
- `TimePicker` (iOS-like wheel).
- `PermissionPrimer` (soft ask explaining why).

**Endpoints / queries:**
- `supabase.auth.signUp({ email, password })`
- `supabase.auth.signInWithPassword({ email, password })`
- `upsert user_preferences (display_name, default_reminder_time, onboarding_completed)`
- `Notification.requestPermission()` + `pushManager.subscribe(...)` + insert into `push_subscriptions`.

**Done when:** a new user completes the flow in < 60s and lands on Home with preferences persisted.

---

### 5.2 Home (4 tabs) — defined in design

**Screens:** Today, All, Stats, You.

**States to cover:**
- Today: empty (no items today), with items, loading.
- All: empty (never created), with filters, loading.
- Stats: insufficient data (< 7 days), with data.
- You: dark mode toggle, account info, logout.

**Components to build:**
- `BottomTabBar` (4 iOS-style tabs with inline SVG icons — see DESIGN.md §3.9).
- `TodayItemCard` (reminder vs routine, with a check for routines).
- `ListSection` (with header and separators).
- `StreakChart` (consistency dots or bars).
- `StatsCard` (completion %, current streak).
- `FAB` ("+" button, opens creation sheet).
- `CreationSheet` (choose: new reminder or new routine).

**Endpoints / queries:**
- `select reminders where event_date::date = today`
- `select routines where days_of_week @> array[extract(dow from today)] and active`
- `select routine_logs for stats window`
- Postgres materialized view for `user_stats` (optional for perf).

**Done when:** all 4 tabs show real data and dark mode works everywhere.

---

### 5.3 Create reminder (8 screens) — defined in design

**Screens:** Title & type → Date & time → Schedule → (Custom days → Custom times) → Message → Review → Created.

**States to cover:**
- Inline validation on each step.
- Custom schedule with 0 days selected (blocks "Next").
- Review with edit-in-place for any field.

**Components to build:**
- `StepperLayout` (header with current step, back/next).
- `TypeChips` (selectable chips with icons).
- `DateTimePicker` (iOS-like).
- `SchedulePresetGrid` (preset cards + "Custom" option).
- `DayPicker` (days before the event, 0-30).
- `PerDayTimeList` (editable list with inline TimePicker).
- `MessageInput` (textarea with counter).
- `ReviewCard` (summary with edit links).
- `SuccessConfetti` (animation on the Created screen).

**Endpoints / queries:**
- `insert reminder` + `insert scheduled_notifications` via trigger.
- Client-side computation of timestamps for preview on Review.

**Done when:** creating a reminder with a custom schedule (3 distinct days, 3 distinct times) produces 3 rows in `scheduled_notifications`.

---

### 5.4 Create routine (5 screens) — defined in design

**Screens:** Pick routine → Days of week → Times of day → Daily goal → Created.

**Routine presets in MVP:** 💧 Drink water, 🧘 Stretch, 📖 Read, 🚶 Walk, ✦ Meditate, ＋ Custom.

**States to cover:**
- Pick: 5 preset types + "Custom".
- Days: at least 1 day required.
- Times: at least 1 time; multiple allowed (morning/afternoon/evening).
- Goal: optional, skip allowed.

**Components to build:**
- `RoutineTypeGrid` (large cards with icons).
- `WeekdayPicker` (M/T/W/T/F/S/S toggles).
- `MultiTimePicker` (add/remove times).
- `GoalInput` (number + unit).

**Endpoints / queries:**
- `insert routine`.
- Trigger generates initial `scheduled_notifications` for the next 7 days.
- Edge `rotate_routines` keeps the rolling window updated.

**Done when:** a "Workout Mon/Wed/Fri 7am, goal 3×/week" routine has the next 3 times scheduled.

---

### 5.5 Pending screens

To be designed and documented here:
- Reminder detail / edit.
- Routine detail / edit.
- "How to install" (PWA install).
- Forgot password.
- Empty / error states for all lists.

---

## 6. Test plan

### 6.1 End-to-end smoke test (from Phase 6)

1. Sign up.
2. Complete onboarding (name, time, permission).
3. Create a reminder with 3 custom reminders.
4. Create a routine for today.
5. Verify `scheduled_notifications`.
6. Wait for the first notification.
7. Tap → app opens on the right screen.
8. Mark the routine done.
9. Stats reflects completion.
10. Logout / login → everything preserved.

### 6.2 Critical scenarios

| Scenario | How to test |
|---|---|
| iOS PWA installed notification | Real iPhone with iOS 16.4+ |
| Android notification | Real device or emulator |
| Timezone (traveler) | Create item, change device timezone, verify firing |
| Offline → online | Airplane mode, create item, disable, verify sync |
| App closed | Force-kill PWA, wait for notification |
| Permission denied | Decline first prompt, see fallback screen |
| Multiple devices | iPhone + Android on same account, both receive |
| Dark mode on every screen | Manual visual regression |

---

## 7. Risks and mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| iOS PWA doesn't deliver notifications reliably | Medium | High | E2E test on real device in Phase 6 before continuing |
| Supabase cron delays notifications | Medium | Medium | Migrate to Upstash QStash if needed |
| iOS installation friction loses friends | High | Medium | Tutorial video + direct support |
| Offline-first subtle sync bugs | High | Medium | Keep model simple; manual edge case tests |
| Solo dev burnout (scope grew) | High | High | Realistic schedule; allow scope cuts (e.g. simple Stats v1) |
| Apple PWA policy change | Low | High | Capacitor migration plan documented |
| Supabase free tier insufficient | Low | Low | Pro tier $25/mo is acceptable post-validation |
| Custom schedule confuses users | Medium | Medium | Validate UX in beta before public v1 |

---

## 8. Post-MVP roadmap

**v1.0 — Public release**
- Polished onboarding with explainer video.
- Bulk edit.
- JSON + CSV backup/export.
- Social login (Apple/Google).
- More built-in routine presets.

**v1.1 — Engagement**
- Event sharing.
- Richer category templates.
- Notification snooze and inline actions.
- Localization (start with Portuguese for the BR market the dev knows).

**v2.0 — Native app**
- React Native or Capacitor.
- Local notifications (no server dependency on iOS).
- Home screen widgets.
- System calendar integration.

**v2.x — Monetization (if traction)**
- Free tier with caps.
- Premium: unlimited sync, integrations (WhatsApp, email), themes.

---

## 9. Open decisions

Captured during v1.0 calibration (after inspecting the Claude Design source). Resolve before the indicated phase.

| ID | Decision | Deadline | Notes |
|---|---|---|---|
| D-01 | **Logout destination:** return to Welcome or to Login? | Before Phase 2 | Common UX is Login. Confirm. |
| D-02 | **Routine without notification:** can users create a routine for tracking only, no push? | Before Phase 4 | Affects model: `times_of_day` becomes nullable if yes. |
| D-03 | **Stats in MVP:** streak + completion % only, or detailed charts? | Before Phase 5 | Recommendation: simple in MVP (1 bar chart + streak + %). |
| D-04 | **Forgot password:** Phase 1 (with auth) or Phase 2 (with onboarding)? | Before Phase 1 | Recommendation: Phase 1. |
| D-05 | **Routine presets:** lock to the 5 from the design or allow custom in MVP? | Before Phase 4 | Design already includes "Custom"; keep. |
| D-06 | **Tab bar:** floating as in design or traditional iOS bottom bar? | Before Phase 5 | Design is floating (DESIGN.md §3.9). Keep. |
| D-07 | **Reminder type vs category:** the design shows "quick types" in step 1. Closed list? | Before Phase 3 | Verify against `CR1_Title` JSX and reflect in schema. |
| D-08 | **Routine goal:** only "X times per week" or other units (minutes, reps)? | Before Phase 4 | Schema includes optional `goal_unit`; MVP UI = "X per week" only. |

---

## 10. Appendix

### 10.1 Architectural decisions

- **Why PWA before native?** Iteration speed, zero cost, no store friction, sufficient to validate UX and notification reliability.
- **Why Next.js?** Developer familiarity, mature ecosystem, runs on Vercel free tier, SSR if a public landing is needed.
- **Why Supabase?** Auth + DB + Edge + Realtime in one package; Postgres avoids catastrophic vendor lock-in.
- **Why Dexie?** Pleasant API over IndexedDB; sufficient for MVP. WatermelonDB would be overkill.
- **Why email + password instead of magic link?** The design specifies it.
- **Why JSONB for schedule?** Lets the schedule shape evolve without frequent migrations.
- **Why separate Reminder and Routine?** Their behavior and mental model differ; unifying would add unnecessary complexity.
- **Why a Postgres trigger for `scheduled_notifications`?** Idempotent, simple, easy to test.
- **Why English-only in MVP?** Global market from day one; localization adds complexity (date/time formats, content review per locale) that's not worth it before validating product fit.

### 10.2 Proposed folder structure

```
daily/
├── app/                      # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (onboarding)/
│   │   ├── welcome/
│   │   ├── name/
│   │   ├── time/
│   │   ├── notifications/
│   │   └── done/
│   ├── (app)/                # authenticated routes
│   │   ├── today/
│   │   ├── all/
│   │   ├── stats/
│   │   ├── you/
│   │   ├── reminders/
│   │   │   ├── new/          # 8 steps
│   │   │   └── [id]/
│   │   └── routines/
│   │       ├── new/          # 5 steps
│   │       └── [id]/
│   ├── install/              # "how to install" page
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/                   # shadcn primitives
│   ├── onboarding/
│   ├── reminders/
│   ├── routines/
│   ├── stats/
│   └── shared/
├── lib/
│   ├── supabase/             # client + server clients
│   ├── db/                   # Dexie
│   ├── sync/                 # outbox + reconciler
│   ├── push/                 # service worker registration
│   ├── time/                 # timezone helpers
│   └── i18n/                 # message keys (English-only in MVP, ready for more)
├── styles/
│   └── tokens.css            # design tokens (see DESIGN.md)
├── public/
│   ├── icons/
│   └── manifest.json
├── supabase/
│   ├── migrations/
│   └── functions/
│       ├── dispatch_push/
│       └── rotate_routines/
└── docs/
    ├── PLANNING.md
    └── DESIGN.md
```

### 10.3 Development conventions

- **Branches**: `main` (production), `feature/*`, `fix/*`.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- **PRs**: even as a solo dev, open PRs to record changes and run CI.
- **Migrations**: numbered (`0001_init.sql`, `0002_routines.sql`).
- **Naming**: PascalCase for components, camelCase with `use` prefix for hooks, PascalCase for types.
- **Imports**: absolute paths via `@/` (e.g. `@/components/ui/button`).
- **Copy strings**: all user-facing strings centralized in `lib/i18n/en.ts` so a future locale only needs a new file.

---

*Next step: start Phase 1 (Technical foundation) using this document and DESIGN.md as references. Update Section 5 as new screens are finalized in Claude Design.*
