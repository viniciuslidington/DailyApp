-- Prevent duplicate scheduled_notifications for the same source at the same
-- send time. rotate_routines uses INSERT ... ON CONFLICT DO NOTHING for
-- idempotent daily inserts.
ALTER TABLE scheduled_notifications
  ADD CONSTRAINT unique_notification_per_send_at
  UNIQUE (source_type, source_id, send_at);

-- Cancel pending routine notifications when a routine is deleted,
-- mirroring the reminder cancel trigger in 0003_reminders_trigger.sql.
CREATE OR REPLACE FUNCTION routines_cancel_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE scheduled_notifications
     SET status = 'cancelled'
   WHERE source_type = 'routine'
     AND source_id   = OLD.id
     AND status      = 'pending';
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_routines_cancel_notifications
AFTER DELETE ON routines
FOR EACH ROW
EXECUTE FUNCTION routines_cancel_notifications();
