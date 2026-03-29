const MAX_COMMENT_LENGTH = 1000;
const MAX_REPORT_DETAILS_LENGTH = 400;

export const COMMENT_REPORT_REASONS = [
  "spam",
  "harassment",
  "hate",
  "misinformation",
  "other",
] as const;

export type CommentReportReason = (typeof COMMENT_REPORT_REASONS)[number];

function normalizeOptionalId(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function validateCommentBody(rawBody: unknown) {
  if (typeof rawBody !== "string") {
    return {
      body: null,
      error: "Comment body is required.",
    };
  }

  const trimmed = rawBody.trim();

  if (!trimmed) {
    return {
      body: null,
      error: "Comment body is required.",
    };
  }

  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return {
      body: null,
      error: `Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.`,
    };
  }

  return {
    body: trimmed,
    error: null,
  };
}

export function validateParentCommentId(rawParentId: unknown) {
  return normalizeOptionalId(rawParentId);
}

export function validateCommentReportInput(rawReason: unknown, rawDetails: unknown) {
  if (
    typeof rawReason !== "string" ||
    !COMMENT_REPORT_REASONS.includes(rawReason as CommentReportReason)
  ) {
    return {
      reason: null,
      details: null,
      error: "Please choose a valid report reason.",
    };
  }

  if (rawDetails === undefined || rawDetails === null || rawDetails === "") {
    return {
      reason: rawReason as CommentReportReason,
      details: null,
      error: null,
    };
  }

  if (typeof rawDetails !== "string") {
    return {
      reason: null,
      details: null,
      error: "Report details must be valid text.",
    };
  }

  const trimmedDetails = rawDetails.trim();

  if (trimmedDetails.length > MAX_REPORT_DETAILS_LENGTH) {
    return {
      reason: null,
      details: null,
      error: `Report details must be ${MAX_REPORT_DETAILS_LENGTH} characters or fewer.`,
    };
  }

  return {
    reason: rawReason as CommentReportReason,
    details: trimmedDetails || null,
    error: null,
  };
}
