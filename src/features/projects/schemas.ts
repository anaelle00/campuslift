export type CreateProjectInput = {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  ownerName: string;
  targetAmount: number;
  deadline: string;
};

export function validateCreateProjectInput(input: CreateProjectInput) {
  if (
    !input.title.trim() ||
    !input.shortDescription.trim() ||
    !input.description.trim() ||
    !input.category.trim() ||
    !input.ownerName.trim() ||
    !input.deadline.trim()
  ) {
    return "Please fill in all required fields.";
  }

  if (!Number.isFinite(input.targetAmount) || input.targetAmount <= 0) {
    return "Please enter a valid funding goal.";
  }

  return null;
}
