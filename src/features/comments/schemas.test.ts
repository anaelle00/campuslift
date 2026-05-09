import { describe, expect, it } from "vitest";
import {
  validateCommentBody,
  validateCommentReportInput,
  validateParentCommentId,
} from "./schemas";

describe("validateCommentBody", () => {
  it("trims and accepts a valid comment body", () => {
    expect(validateCommentBody("  Hello campus  ")).toEqual({
      body: "Hello campus",
      error: null,
    });
  });

  it("rejects an empty comment body", () => {
    expect(validateCommentBody("   ")).toEqual({
      body: null,
      error: "Comment body is required.",
    });
  });

  it("rejects non-string input", () => {
    expect(validateCommentBody(42)).toEqual({
      body: null,
      error: "Comment body is required.",
    });
  });

  it("rejects null input", () => {
    expect(validateCommentBody(null)).toEqual({
      body: null,
      error: "Comment body is required.",
    });
  });

  it("rejects undefined input", () => {
    expect(validateCommentBody(undefined)).toEqual({
      body: null,
      error: "Comment body is required.",
    });
  });

  it("rejects a comment body that exceeds the max length", () => {
    const longBody = "a".repeat(1001);
    const result = validateCommentBody(longBody);
    expect(result.body).toBeNull();
    expect(result.error).toContain("1000 characters");
  });

  it("accepts a comment body at exactly the max length", () => {
    const maxBody = "a".repeat(1000);
    expect(validateCommentBody(maxBody)).toEqual({
      body: maxBody,
      error: null,
    });
  });
});

describe("validateParentCommentId", () => {
  it("normalizes the parent comment id", () => {
    expect(validateParentCommentId("  parent-id  ")).toBe("parent-id");
  });

  it("returns null for whitespace-only input", () => {
    expect(validateParentCommentId("   ")).toBeNull();
  });

  it("returns null for non-string input", () => {
    expect(validateParentCommentId(123)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(validateParentCommentId(undefined)).toBeNull();
  });

  it("returns null for null", () => {
    expect(validateParentCommentId(null)).toBeNull();
  });
});

describe("validateCommentReportInput", () => {
  it("rejects invalid report reasons", () => {
    expect(validateCommentReportInput("not-a-reason", null)).toEqual({
      reason: null,
      details: null,
      error: "Please choose a valid report reason.",
    });
  });

  it("rejects non-string reason", () => {
    expect(validateCommentReportInput(42, null)).toEqual({
      reason: null,
      details: null,
      error: "Please choose a valid report reason.",
    });
  });

  it("accepts a valid report with details", () => {
    expect(validateCommentReportInput("spam", "  repeated links  ")).toEqual({
      reason: "spam",
      details: "repeated links",
      error: null,
    });
  });

  it("accepts a valid report without details", () => {
    expect(validateCommentReportInput("harassment", null)).toEqual({
      reason: "harassment",
      details: null,
      error: null,
    });
  });

  it("accepts empty string details as null", () => {
    expect(validateCommentReportInput("hate", "")).toEqual({
      reason: "hate",
      details: null,
      error: null,
    });
  });

  it("accepts all valid report reasons", () => {
    for (const reason of ["spam", "harassment", "hate", "misinformation", "other"]) {
      const result = validateCommentReportInput(reason, null);
      expect(result.reason).toBe(reason);
      expect(result.error).toBeNull();
    }
  });

  it("rejects report details that exceed the max length", () => {
    const longDetails = "a".repeat(401);
    const result = validateCommentReportInput("spam", longDetails);
    expect(result.reason).toBeNull();
    expect(result.error).toContain("400 characters");
  });

  it("accepts report details at exactly the max length", () => {
    const maxDetails = "a".repeat(400);
    const result = validateCommentReportInput("spam", maxDetails);
    expect(result.reason).toBe("spam");
    expect(result.details).toBe(maxDetails);
    expect(result.error).toBeNull();
  });

  it("rejects non-string details", () => {
    expect(validateCommentReportInput("spam", 42)).toEqual({
      reason: null,
      details: null,
      error: "Report details must be valid text.",
    });
  });
});
