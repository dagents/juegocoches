-- =====================================================
-- SECURITY HARDENING
-- =====================================================

-- Fix: add SET search_path = public to game vote trigger function
-- (other SECURITY DEFINER functions already have this)
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Explicit deny policies on profiles (default is deny, but explicit is safer)
CREATE POLICY "profiles_no_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (false);

CREATE POLICY "profiles_no_delete"
  ON public.profiles FOR DELETE
  USING (false);
