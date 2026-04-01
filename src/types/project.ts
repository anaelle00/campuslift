export type ProjectCategory =
  | "Tech"
  | "Association"
  | "Art"
  | "Event"
  | "Social"
  | "Education";

export type Project = {
  id: string;
  owner_id: string;
  title: string;
  short_description: string;
  description: string;
  category: ProjectCategory | string;
  owner_name: string;
  owner_username: string;
  target_amount: number;
  current_amount: number;
  image_url: string;
  deadline: string;
  supporters_count: number;
  comments_count?: number;
  created_at?: string;
};
