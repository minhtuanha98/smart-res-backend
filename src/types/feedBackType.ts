export interface FeedbackInput {
  userId: string;
  title: string;
  apartNumber: string;
  content: string;
  imageUrl?: string | null;
}

export interface FeedbackQuery {
  page: number;
  limit: number;
  status: string;
  userId: string;
  role: string;
}

export type Feedback = {
  userId: string;
  title: string;
  content: string;
  id: string;
  createdAt: Date;
  status: string;
};

export type OnlyStatus = {
  status: string;
};
