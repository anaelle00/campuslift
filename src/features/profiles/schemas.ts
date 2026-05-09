export type UpdateProfileInput = {
  displayName: string;
  username: string;
  organization: string;
  phone: string;
  website: string;
  bio: string;
};

export function validateProfileInput(input: UpdateProfileInput) {
  if (input.username.trim() && /\s/.test(input.username.trim())) {
    return "Username cannot contain spaces.";
  }

  if (
    input.website.trim() &&
    !/^https?:\/\//i.test(input.website.trim())
  ) {
    return "Website must start with http:// or https://";
  }

  return null;
}
