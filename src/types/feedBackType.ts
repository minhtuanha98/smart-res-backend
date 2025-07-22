export interface FeedbackInput {
  userId: string;
  title: string;
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
