import { createClient } from "@/lib/supabase/server";
import { actionFailure, actionSuccess, type ActionResult } from "@/features/shared/result";
import { type UpdateProfileInput, validateProfileInput } from "@/features/profiles/schemas";

function getAvatarFile(formData: FormData) {
  const avatarEntry = formData.get("avatarFile");

  if (!(avatarEntry instanceof File) || avatarEntry.size === 0) {
    return null;
  }

  return avatarEntry;
}

export async function updateProfile(
  formData: FormData,
): Promise<ActionResult<{ avatarUrl: string | null }>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to update your profile.", 401);
  }

  const input: UpdateProfileInput = {
    displayName: String(formData.get("displayName") ?? ""),
    username: String(formData.get("username") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    website: String(formData.get("website") ?? ""),
    bio: String(formData.get("bio") ?? ""),
  };

  const validationError = validateProfileInput(input);

  if (validationError) {
    return actionFailure(validationError);
  }

  const avatarFile = getAvatarFile(formData);
  let avatarUrl = String(formData.get("currentAvatarUrl") ?? "") || null;

  if (avatarFile) {
    if (!avatarFile.type.startsWith("image/")) {
      return actionFailure("Please upload a valid image file.");
    }

    const fileExt = avatarFile.name.split(".").pop() || "jpg";
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, {
        contentType: avatarFile.type,
        upsert: true,
      });

    if (uploadError) {
      return actionFailure(uploadError.message);
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    avatarUrl = data.publicUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: input.displayName.trim() || null,
      username: input.username.trim() || null,
      organization: input.organization.trim() || null,
      phone: input.phone.trim() || null,
      website: input.website.trim() || null,
      bio: input.bio.trim() || null,
      avatar_url: avatarUrl,
    })
    .eq("id", user.id);

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess(
    {
      avatarUrl,
    },
    "Profile updated successfully.",
  );
}
