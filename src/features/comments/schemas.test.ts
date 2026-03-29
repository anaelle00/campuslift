import { describe, expect, it } from "vitest";
import {
  validateCommentBody,
  validateCommentReportInput,
  validateParentCommentId,
} from "./schemas";

describe("comment schema helpers", () => {
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

  it("normalizes the parent comment id", () => {
    expect(validateParentCommentId("  parent-id  ")).toBe("parent-id");
    expect(validateParentCommentId("   ")).toBeNull();
  });

  it("rejects invalid report reasons", () => {
    expect(validateCommentReportInput("not-a-reason", null)).toEqual({
      reason: null,
      details: null,
      error: "Please choose a valid report reason.",
    });
  });

  it("accepts a valid report payload", () => {
    expect(validateCommentReportInput("spam", "  repeated links  ")).toEqual({
      reason: "spam",
      details: "repeated links",
      error: null,
    });
  });
});
