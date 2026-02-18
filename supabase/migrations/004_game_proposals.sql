-- =====================================================
-- GAME PROPOSALS: RLS, Triggers, Realtime
-- Run AFTER prisma db push creates the tables
-- =====================================================

-- =====================================================
-- ENABLE RLS
-- =====================================================

ALTER TABLE public.game_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winning_game ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GAME_PROPOSALS POLICIES
-- =====================================================

CREATE POLICY "game_proposals_select_all"
  ON public.game_proposals FOR SELECT
  USING (true);

CREATE POLICY "game_proposals_insert_own"
  ON public.game_proposals FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

CREATE POLICY "game_proposals_no_update"
  ON public.game_proposals FOR UPDATE
  USING (false);

CREATE POLICY "game_proposals_no_delete"
  ON public.game_proposals FOR DELETE
  USING (false);

-- =====================================================
-- GAME_VOTES POLICIES
-- =====================================================

CREATE POLICY "game_votes_select_all"
  ON public.game_votes FOR SELECT
  USING (true);

CREATE POLICY "game_votes_insert_own"
  ON public.game_votes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.game_proposals
      WHERE game_proposals.id = proposal_id
      AND game_proposals.approved = true
    )
  );

CREATE POLICY "game_votes_no_update"
  ON public.game_votes FOR UPDATE
  USING (false);

CREATE POLICY "game_votes_no_delete"
  ON public.game_votes FOR DELETE
  USING (false);

-- =====================================================
-- WINNING_GAME POLICIES
-- =====================================================

CREATE POLICY "winning_game_select_all"
  ON public.winning_game FOR SELECT
  USING (true);

CREATE POLICY "winning_game_no_insert"
  ON public.winning_game FOR INSERT
  WITH CHECK (false);

CREATE POLICY "winning_game_no_update"
  ON public.winning_game FOR UPDATE
  USING (false);

CREATE POLICY "winning_game_no_delete"
  ON public.winning_game FOR DELETE
  USING (false);

-- =====================================================
-- VOTE COUNT TRIGGER (auto-increment on game_votes)
-- =====================================================

CREATE OR REPLACE FUNCTION update_game_proposal_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.game_proposals
    SET votes_count = votes_count + 1
    WHERE id = NEW.proposal_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.game_proposals
    SET votes_count = votes_count - 1
    WHERE id = OLD.proposal_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER game_vote_count_trigger
  AFTER INSERT OR DELETE ON public.game_votes
  FOR EACH ROW EXECUTE FUNCTION update_game_proposal_votes_count();

-- =====================================================
-- SELECT WINNING GAME FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION select_winning_game()
RETURNS void AS $$
DECLARE
  winner_id UUID;
BEGIN
  -- Already have a winner? Do nothing
  IF EXISTS (SELECT 1 FROM public.winning_game LIMIT 1) THEN
    RETURN;
  END IF;

  -- Pick the approved proposal with most votes
  SELECT id INTO winner_id
  FROM public.game_proposals
  WHERE approved = true
  ORDER BY votes_count DESC, created_at ASC
  LIMIT 1;

  IF winner_id IS NOT NULL THEN
    INSERT INTO public.winning_game (id, proposal_id, created_at)
    VALUES (gen_random_uuid(), winner_id, now());
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ENABLE REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.game_proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_votes;
