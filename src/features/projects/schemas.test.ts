import { describe, expect, it } from "vitest";
import { parseExplorePageInput, validateCreateProjectInput } from "./schemas";

const validInput = {
  title: "Campus prototype",
  shortDescription: "A short summary",
  description: "A complete project description",
  category: "Tech",
  ownerName: "Anaelle",
  targetAmount: 150,
  deadline: "2026-04-30",
};

describe("validateCreateProjectInput", () => {
  it("rejects missing required fields", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        title: "   ",
      }),
    ).toBe("Please fill in all required fields.");
  });

  it("rejects invalid funding goals", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        targetAmount: 0,
      }),
    ).toBe("Please enter a valid funding goal.");
  });

  it("accepts a valid project payload", () => {
    expect(validateCreateProjectInput(validInput)).toBeNull();
  });
});

describe("parseExplorePageInput", () => {
  it("falls back to defaults for invalid values", () => {
    expect(
      parseExplorePageInput({
        category: "Unknown",
        sort: "bad-sort",
        page: "0",
      }),
    ).toEqual({
      category: "All",
      sortBy: "newest",
      page: 1,
    });
  });

  it("accepts valid category, sort, and page params", () => {
    expect(
      parseExplorePageInput({
        category: "Tech",
        sort: "most-funded",
        page: "3",
      }),
    ).toEqual({
      category: "Tech",
      sortBy: "most-funded",
      page: 3,
    });
  });
});
