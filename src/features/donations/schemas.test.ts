import { describe, expect, it } from "vitest";
import { validateSupportAmount } from "./schemas";

describe("validateSupportAmount", () => {
  it("rejects negative amounts", () => {
    expect(validateSupportAmount(-5)).toEqual({
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    });
  });

  it("rejects zero", () => {
    expect(validateSupportAmount(0)).toEqual({
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    });
  });

  it("accepts valid numeric amounts", () => {
    expect(validateSupportAmount("25")).toEqual({
      amount: 25,
      error: null,
    });
  });
});
