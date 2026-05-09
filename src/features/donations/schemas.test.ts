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

  it("accepts fractional amounts", () => {
    expect(validateSupportAmount(10.5)).toEqual({
      amount: 10.5,
      error: null,
    });
  });

  it("rejects NaN", () => {
    expect(validateSupportAmount(NaN)).toEqual({
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    });
  });

  it("rejects Infinity", () => {
    expect(validateSupportAmount(Infinity)).toEqual({
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    });
  });

  it("rejects non-numeric strings", () => {
    expect(validateSupportAmount("abc")).toEqual({
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    });
  });

  it("rejects null", () => {
    expect(validateSupportAmount(null)).toEqual({
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    });
  });

  it("rejects undefined", () => {
    expect(validateSupportAmount(undefined)).toEqual({
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    });
  });

  it("rejects empty string", () => {
    expect(validateSupportAmount("")).toEqual({
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    });
  });

  it("accepts very small positive amounts", () => {
    expect(validateSupportAmount(0.01)).toEqual({
      amount: 0.01,
      error: null,
    });
  });

  it("accepts large amounts", () => {
    expect(validateSupportAmount(99999)).toEqual({
      amount: 99999,
      error: null,
    });
  });
});
