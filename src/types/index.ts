export type ActionResult<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

export type IdeaWithUser = {
  id: string;
  userId: string;
  content: string;
  approved: boolean | null;
  rejectionReason: string | null;
  category: string | null;
  votesCount: number;
  dayDate: Date;
  createdAt: Date;
};

export type DailyWinnerWithIdea = {
  id: string;
  dayDate: Date;
  implemented: boolean;
  createdAt: Date;
  idea: {
    id: string;
    userId: string;
    content: string;
    category: string | null;
    votesCount: number;
  };
};

export type GameProposalWithUser = {
  id: string;
  userId: string;
  title: string;
  description: string;
  approved: boolean | null;
  rejectionReason: string | null;
  category: string | null;
  votesCount: number;
  proposalDate: Date;
  createdAt: Date;
};

export type WinningGameWithProposal = {
  id: string;
  createdAt: Date;
  proposal: {
    id: string;
    userId: string;
    title: string;
    description: string;
    votesCount: number;
  };
};
