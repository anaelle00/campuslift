export type ProjectCategory =
  | "Tech"
  | "Association"
  | "Art"
  | "Event"
  | "Social";

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ProjectCategory;
  ownerName: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
  deadline: string;
  supportersCount: number;
};