-- =====================================================
-- TRIGGER: Increment votes_count on idea when vote is inserted
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_vote_inserted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.ideas
  SET votes_count = votes_count + 1
  WHERE id = NEW.idea_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_vote_inserted ON public.votes;

CREATE TRIGGER on_vote_inserted
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vote_inserted();

-- =====================================================
-- TRIGGER: Decrement votes_count on idea when vote is deleted
-- (Safety net — votes should not normally be deleted)
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_vote_deleted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.ideas
  SET votes_count = GREATEST(votes_count - 1, 0)
  WHERE id = OLD.idea_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_vote_deleted ON public.votes;

CREATE TRIGGER on_vote_deleted
  AFTER DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vote_deleted();

-- =====================================================
-- FUNCTION: Select daily winner (called by cron)
-- =====================================================

CREATE OR REPLACE FUNCTION public.select_daily_winner(
  target_date DATE DEFAULT (CURRENT_DATE AT TIME ZONE 'Europe/Madrid')::date
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  winner_idea_id UUID;
BEGIN
  SELECT id INTO winner_idea_id
  FROM public.ideas
  WHERE day_date = target_date
    AND approved = true
    AND votes_count > 0
  ORDER BY votes_count DESC, created_at ASC
  LIMIT 1;

  IF winner_idea_id IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.daily_winners (idea_id, day_date)
  VALUES (winner_idea_id, target_date)
  ON CONFLICT (day_date) DO UPDATE SET idea_id = EXCLUDED.idea_id;

  RETURN winner_idea_id;
END;
$$;
