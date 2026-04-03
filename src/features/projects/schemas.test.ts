import { describe, expect, it } from "vitest";
import {
  parseExplorePageInput,
  validateCreateProjectInput,
} from "./schemas";

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

  it("rejects empty short description", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        shortDescription: "",
      }),
    ).toBe("Please fill in all required fields.");
  });

  it("rejects empty description", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        description: "  ",
      }),
    ).toBe("Please fill in all required fields.");
  });

  it("rejects empty category", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        category: "",
      }),
    ).toBe("Please fill in all required fields.");
  });

  it("rejects empty owner name", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        ownerName: "   ",
      }),
    ).toBe("Please fill in all required fields.");
  });

  it("rejects empty deadline", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        deadline: "",
      }),
    ).toBe("Please fill in all required fields.");
  });

  it("rejects zero funding goal", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        targetAmount: 0,
      }),
    ).toBe("Please enter a valid funding goal.");
  });

  it("rejects negative funding goals", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        targetAmount: -100,
      }),
    ).toBe("Please enter a valid funding goal.");
  });

  it("rejects NaN funding goals", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        targetAmount: NaN,
      }),
    ).toBe("Please enter a valid funding goal.");
  });

  it("rejects Infinity funding goals", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        targetAmount: Infinity,
      }),
    ).toBe("Please enter a valid funding goal.");
  });

  it("accepts a valid project payload", () => {
    expect(validateCreateProjectInput(validInput)).toBeNull();
  });

  it("accepts fractional funding goals", () => {
    expect(
      validateCreateProjectInput({
        ...validInput,
        targetAmount: 10.5,
      }),
    ).toBeNull();
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
      search: null,
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
      search: null,
    });
  });

  it("handles array-valued search params", () => {
    expect(
      parseExplorePageInput({
        category: ["Art", "Tech"],
        sort: ["newest"],
        page: ["2"],
        search: ["robot"],
      }),
    ).toEqual({
      category: "Art",
      sortBy: "newest",
      page: 2,
      search: "robot",
    });
  });

  it("trims and normalizes search input", () => {
    expect(
      parseExplorePageInput({
        search: "  robotics  ",
      }),
    ).toEqual({
      category: "All",
      sortBy: "newest",
      page: 1,
      search: "robotics",
    });
  });

  it("returns null for empty search strings", () => {
    expect(
      parseExplorePageInput({
        search: "   ",
      }),
    ).toEqual({
      category: "All",
      sortBy: "newest",
      page: 1,
      search: null,
    });
  });

  it("accepts all valid categories", () => {
    for (const cat of ["All", "Tech", "Association", "Art", "Event", "Social", "Education"]) {
      const result = parseExplorePageInput({ category: cat });
      expect(result.category).toBe(cat);
    }
  });

  it("accepts all valid sort options", () => {
    for (const sort of ["newest", "most-funded", "deadline-soon"]) {
      const result = parseExplorePageInput({ sort });
      expect(result.sortBy).toBe(sort);
    }
  });

  it("clamps negative page numbers to 1", () => {
    expect(parseExplorePageInput({ page: "-5" }).page).toBe(1);
  });

  it("handles non-numeric page gracefully", () => {
    expect(parseExplorePageInput({ page: "abc" }).page).toBe(1);
  });
});
