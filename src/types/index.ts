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
  user: {
    displayName: string | null;
    avatarUrl: string | null;
  };
};

export type DailyWinnerWithIdea = {
  id: string;
  dayDate: Date;
  implemented: boolean;
  createdAt: Date;
  idea: {
    id: string;
    content: string;
    category: string | null;
    votesCount: number;
    user: {
      displayName: string | null;
    };
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
  user: {
    displayName: string | null;
    avatarUrl: string | null;
  };
};

export type WinningGameWithProposal = {
  id: string;
  createdAt: Date;
  proposal: {
    id: string;
    title: string;
    description: string;
    votesCount: number;
    user: {
      displayName: string | null;
    };
  };
};
