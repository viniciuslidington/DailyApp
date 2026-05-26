-- Materialize scheduled_notifications from a reminder's schedule_config.
-- Recomputed on every INSERT/UPDATE and cleared on DELETE. We only delete rows
-- that are still pending — historical 'sent' rows stay for audit.
--
-- schedule_config shapes (docs/PLANNING.md §3.3):
--   Preset: { "preset": "on_day" | "day_before" | "three_days" | "week_before" }
--   Custom: { "offsets": [{"days": N, "time": "HH:MM"}, ...] }

CREATE OR REPLACE FUNCTION generate_reminder_notifications(
  p_reminder_id UUID,
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_event_date TIMESTAMPTZ,
  p_schedule_type TEXT,
  p_schedule_config JSONB,
  p_timezone TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_offset JSONB;
  v_days INTEGER;
  v_time TIME;
  v_send_at TIMESTAMPTZ;
  v_payload JSONB;
BEGIN
  v_payload := jsonb_build_object(
    'title', p_title,
    'body', COALESCE(p_message, ''),
    'url', '/reminders/' || p_reminder_id::text,
    'tag', 'reminder:' || p_reminder_id::text
  );

  IF p_schedule_type = 'preset' THEN
    -- Each preset is a single notification at an offset relative to event_date.
    -- Time-of-day mirrors the event itself, keeping the trigger self-contained
    -- (no join into user_preferences required).
    CASE p_schedule_config->>'preset'
      WHEN 'on_day'      THEN v_send_at := p_event_date;
      WHEN 'day_before'  THEN v_send_at := p_event_date - INTERVAL '1 day';
      WHEN 'three_days'  THEN v_send_at := p_event_date - INTERVAL '3 days';
      WHEN 'week_before' THEN v_send_at := p_event_date - INTERVAL '7 days';
      ELSE
        RAISE EXCEPTION 'unknown preset: %', p_schedule_config->>'preset';
    END CASE;

    INSERT INTO scheduled_notifications (user_id, source_type, source_id, send_at, payload)
    VALUES (p_user_id, 'reminder', p_reminder_id, v_send_at, v_payload);

  ELSIF p_schedule_type = 'custom' THEN
    FOR v_offset IN
      SELECT * FROM jsonb_array_elements(COALESCE(p_schedule_config->'offsets', '[]'::jsonb))
    LOOP
      v_days := (v_offset->>'days')::INTEGER;
      v_time := (v_offset->>'time')::TIME;

      -- Compute the wall date N days before the event in the user's timezone,
      -- combine with the chosen time-of-day, then convert that local instant
      -- back to UTC so dispatch_push can compare it to now() directly.
      v_send_at := (
        ((p_event_date AT TIME ZONE p_timezone)::date - v_days + v_time)
        AT TIME ZONE p_timezone
      );

      INSERT INTO scheduled_notifications (user_id, source_type, source_id, send_at, payload)
      VALUES (p_user_id, 'reminder', p_reminder_id, v_send_at, v_payload);
    END LOOP;
  ELSE
    RAISE EXCEPTION 'unknown schedule_type: %', p_schedule_type;
  END IF;
END;
$$;

-- AFTER INSERT/UPDATE: refresh the pending rows for this reminder.
CREATE OR REPLACE FUNCTION reminders_refresh_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM scheduled_notifications
   WHERE source_type = 'reminder'
     AND source_id   = NEW.id
     AND status      = 'pending';

  PERFORM generate_reminder_notifications(
    NEW.id, NEW.user_id, NEW.title, NEW.message,
    NEW.event_date, NEW.schedule_type, NEW.schedule_config, NEW.timezone
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_reminders_refresh_notifications
AFTER INSERT OR UPDATE OF event_date, schedule_type, schedule_config, timezone, title, message
ON reminders
FOR EACH ROW
EXECUTE FUNCTION reminders_refresh_notifications();

-- AFTER DELETE: cancel anything still pending for this reminder.
CREATE OR REPLACE FUNCTION reminders_cancel_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM scheduled_notifications
   WHERE source_type = 'reminder'
     AND source_id   = OLD.id
     AND status      = 'pending';
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_reminders_cancel_notifications
AFTER DELETE ON reminders
FOR EACH ROW
EXECUTE FUNCTION reminders_cancel_notifications();
