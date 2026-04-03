import { createClient } from "@/lib/supabase/server";
import { actionFailure, actionSuccess, type ActionResult } from "@/features/shared/result";
import { type CreateProjectInput, validateCreateProjectInput } from "@/features/projects/schemas";
import type { ProjectStatus } from "@/types/project";

const DEFAULT_PROJECT_IMAGE_URL =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

function getImageFile(formData: FormData) {
  const imageEntry = formData.get("imageFile");

  if (!(imageEntry instanceof File) || imageEntry.size === 0) {
    return null;
  }

  return imageEntry;
}

export async function createProject(
  formData: FormData,
): Promise<ActionResult<{ redirectTo: string }>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to create a project.", 401);
  }

  const input: CreateProjectInput = {
    title: String(formData.get("title") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    ownerName: String(formData.get("ownerName") ?? ""),
    targetAmount: Number(formData.get("targetAmount") ?? ""),
    deadline: String(formData.get("deadline") ?? ""),
  };

  const validationError = validateCreateProjectInput(input);

  if (validationError) {
    return actionFailure(validationError);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.username) {
    return actionFailure("Your profile is missing a username.");
  }

  let finalImageUrl = DEFAULT_PROJECT_IMAGE_URL;
  const imageFile = getImageFile(formData);

  if (imageFile) {
    if (!imageFile.type.startsWith("image/")) {
      return actionFailure("Please upload a valid image file.");
    }

    const fileExt = imageFile.name.split(".").pop() || "jpg";
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, imageFile, {
        contentType: imageFile.type,
      });

    if (uploadError) {
      return actionFailure(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    finalImageUrl = publicUrlData.publicUrl;
  }

  const rawStatus = String(formData.get("status") ?? "published");
  const status: ProjectStatus =
    rawStatus === "draft" || rawStatus === "archived" ? rawStatus : "published";

  const { error } = await supabase.from("projects").insert({
    title: input.title.trim(),
    short_description: input.shortDescription.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
    owner_name: input.ownerName.trim(),
    owner_id: user.id,
    owner_username: profile.username,
    target_amount: input.targetAmount,
    current_amount: 0,
    image_url: finalImageUrl,
    deadline: input.deadline,
    supporters_count: 0,
    status,
  });

  if (error) {
    return actionFailure(error.message);
  }

  const redirectTo = status === "draft" ? "/dashboard" : "/explore";
  return actionSuccess({ redirectTo }, "Project created successfully.");
}

export async function updateProject(
  projectId: string,
  formData: FormData,
): Promise<ActionResult<{ redirectTo: string }>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to edit a project.", 401);
  }

  const { data: existing, error: existingError } = await supabase
    .from("projects")
    .select("id, owner_id, image_url")
    .eq("id", projectId)
    .single();

  if (existingError || !existing) {
    return actionFailure("Project not found.", 404);
  }

  if (existing.owner_id !== user.id) {
    return actionFailure("You don't have permission to edit this project.", 403);
  }

  const input: CreateProjectInput = {
    title: String(formData.get("title") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    ownerName: String(formData.get("ownerName") ?? ""),
    targetAmount: Number(formData.get("targetAmount") ?? ""),
    deadline: String(formData.get("deadline") ?? ""),
  };

  const validationError = validateCreateProjectInput(input);

  if (validationError) {
    return actionFailure(validationError);
  }

  let finalImageUrl = existing.image_url as string;
  const imageFile = getImageFile(formData);

  if (imageFile) {
    if (!imageFile.type.startsWith("image/")) {
      return actionFailure("Please upload a valid image file.");
    }

    const fileExt = imageFile.name.split(".").pop() || "jpg";
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, imageFile, { contentType: imageFile.type });

    if (uploadError) {
      return actionFailure(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    finalImageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from("projects")
    .update({
      title: input.title.trim(),
      short_description: input.shortDescription.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      owner_name: input.ownerName.trim(),
      target_amount: input.targetAmount,
      image_url: finalImageUrl,
      deadline: input.deadline,
    })
    .eq("id", projectId);

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess(
    { redirectTo: `/projects/${projectId}` },
    "Project updated successfully.",
  );
}

export async function deleteProject(
  projectId: string,
): Promise<ActionResult<null>> {
  if (!projectId.trim()) {
    return actionFailure("Project id is required.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in.", 401);
  }

  const { data: existing, error: existingError } = await supabase
    .from("projects")
    .select("id, owner_id")
    .eq("id", projectId)
    .single();

  if (existingError || !existing) {
    return actionFailure("Project not found.", 404);
  }

  if (existing.owner_id !== user.id) {
    return actionFailure("You don't have permission to delete this project.", 403);
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess(null);
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<ActionResult<null>> {
  if (!projectId.trim()) {
    return actionFailure("Project id is required.");
  }

  const validStatuses: ProjectStatus[] = ["draft", "published", "archived"];
  if (!validStatuses.includes(status)) {
    return actionFailure("Invalid status.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in.", 401);
  }

  const { data: existing, error: existingError } = await supabase
    .from("projects")
    .select("id, owner_id")
    .eq("id", projectId)
    .single();

  if (existingError || !existing) {
    return actionFailure("Project not found.", 404);
  }

  if (existing.owner_id !== user.id) {
    return actionFailure("You don't have permission to update this project.", 403);
  }

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId);

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess(null);
}

export async function toggleFavorite(
  projectId: string,
): Promise<ActionResult<{ isFavorite: boolean }>> {
  if (!projectId.trim()) {
    return actionFailure("Project id is required.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to update favorites.", 401);
  }

  const { data: favorite, error: favoriteError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .maybeSingle();

  if (favoriteError) {
    return actionFailure(favoriteError.message);
  }

  if (favorite) {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favorite.id);

    if (deleteError) {
      return actionFailure(deleteError.message);
    }

    return actionSuccess({ isFavorite: false });
  }

  const { error: insertError } = await supabase.from("favorites").insert({
    user_id: user.id,
    project_id: projectId,
  });

  if (insertError) {
    return actionFailure(insertError.message);
  }

  return actionSuccess({ isFavorite: true });
}
