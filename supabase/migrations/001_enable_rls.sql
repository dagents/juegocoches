-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- Run this AFTER Prisma creates the tables (prisma db push)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_winners ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- IDEAS POLICIES
-- =====================================================

-- Anyone can read all ideas (approved + rejected shown in ranking)
CREATE POLICY "ideas_select_all"
  ON public.ideas FOR SELECT
  USING (true);

-- Authenticated users can insert their own ideas
CREATE POLICY "ideas_insert_own"
  ON public.ideas FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- No user can update or delete ideas
CREATE POLICY "ideas_no_update"
  ON public.ideas FOR UPDATE
  USING (false);

CREATE POLICY "ideas_no_delete"
  ON public.ideas FOR DELETE
  USING (false);

-- =====================================================
-- VOTES POLICIES
-- =====================================================

CREATE POLICY "votes_select_all"
  ON public.votes FOR SELECT
  USING (true);

-- Can only vote on approved ideas
CREATE POLICY "votes_insert_own"
  ON public.votes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.ideas
      WHERE ideas.id = idea_id
      AND ideas.approved = true
    )
  );

CREATE POLICY "votes_no_update"
  ON public.votes FOR UPDATE
  USING (false);

CREATE POLICY "votes_no_delete"
  ON public.votes FOR DELETE
  USING (false);

-- =====================================================
-- DAILY_WINNERS POLICIES
-- =====================================================

CREATE POLICY "daily_winners_select_all"
  ON public.daily_winners FOR SELECT
  USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "daily_winners_no_insert"
  ON public.daily_winners FOR INSERT
  WITH CHECK (false);

CREATE POLICY "daily_winners_no_update"
  ON public.daily_winners FOR UPDATE
  USING (false);

CREATE POLICY "daily_winners_no_delete"
  ON public.daily_winners FOR DELETE
  USING (false);

-- =====================================================
-- ENABLE REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
