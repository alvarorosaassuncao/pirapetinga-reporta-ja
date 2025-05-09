
export type ReportStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: ReportStatus;
  created_at: string;
  updated_at?: string;
  user_id: string;
  image_url?: string | null;
}
