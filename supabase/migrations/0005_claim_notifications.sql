-- Atomic claim for dispatch_push: transitions a batch of pending notifications
-- to 'processing' in a single statement. FOR UPDATE SKIP LOCKED means concurrent
-- invocations claim disjoint row sets and never double-deliver the same push.
CREATE OR REPLACE FUNCTION public.claim_pending_notifications(batch_size int DEFAULT 50)
RETURNS TABLE(id uuid, user_id uuid, payload jsonb, attempts int)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE scheduled_notifications
  SET status = 'processing'
  WHERE id IN (
    SELECT id FROM scheduled_notifications
    WHERE status = 'pending' AND send_at <= now()
    ORDER BY send_at
    LIMIT batch_size
    FOR UPDATE SKIP LOCKED
  )
  RETURNING id, user_id, payload, attempts;
$$;
