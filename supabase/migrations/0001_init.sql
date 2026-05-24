-- Daily — initial schema (docs/PLANNING.md §3.3).
-- All user data scoped by auth.uid(); RLS policies in 0002_rls.sql.

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
  -- Preset: { "preset": "on_day" | "day_before" | "three_days" | "week_before" }
  -- Custom: { "offsets": [{"days": 3, "time": "09:00"}, ...] }
  timezone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reminders_user_date ON reminders(user_id, event_date);

-- Routines (recurring)
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  routine_type TEXT NOT NULL, -- 'drink_water' | 'stretch' | 'read' | 'walk' | 'meditate' | 'custom'
  days_of_week INTEGER[] NOT NULL, -- 0=Sunday, 6=Saturday
  times_of_day TIME[] NOT NULL,
  goal_per_week INTEGER,
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
  UNIQUE (routine_id, log_date)
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

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_preferences_touch BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_reminders_touch BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_routines_touch BEFORE UPDATE ON routines
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
