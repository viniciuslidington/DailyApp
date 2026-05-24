-- Row-level security: users see only their own rows.

ALTER TABLE user_preferences        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines                ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- Generic owner policy: one block per table covering all four verbs.
-- USING controls visibility (SELECT/UPDATE/DELETE); WITH CHECK controls writes.

CREATE POLICY "own rows" ON user_preferences
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own rows" ON reminders
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own rows" ON routines
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own rows" ON routine_logs
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own rows" ON push_subscriptions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- scheduled_notifications: clients read their own; only the service role writes
-- (the dispatch_push edge function uses the service key).
CREATE POLICY "read own" ON scheduled_notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
