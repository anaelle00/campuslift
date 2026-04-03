import { describe, expect, it } from "vitest";
import { validateProfileInput } from "./schemas";

const validInput = {
  displayName: "Anaelle Mathe",
  username: "anaellemathe",
  organization: "",
  phone: "",
  website: "https://campuslift.dev",
  bio: "",
};

describe("validateProfileInput", () => {
  it("rejects usernames with spaces", () => {
    expect(
      validateProfileInput({
        ...validInput,
        username: "anaelle mathe",
      }),
    ).toBe("Username cannot contain spaces.");
  });

  it("rejects usernames with tabs", () => {
    expect(
      validateProfileInput({
        ...validInput,
        username: "anaelle\tmathe",
      }),
    ).toBe("Username cannot contain spaces.");
  });

  it("rejects websites without a protocol", () => {
    expect(
      validateProfileInput({
        ...validInput,
        website: "campuslift.dev",
      }),
    ).toBe("Website must start with http:// or https://");
  });

  it("rejects websites with ftp protocol", () => {
    expect(
      validateProfileInput({
        ...validInput,
        website: "ftp://campuslift.dev",
      }),
    ).toBe("Website must start with http:// or https://");
  });

  it("accepts a valid profile payload", () => {
    expect(validateProfileInput(validInput)).toBeNull();
  });

  it("accepts http:// websites", () => {
    expect(
      validateProfileInput({
        ...validInput,
        website: "http://campuslift.dev",
      }),
    ).toBeNull();
  });

  it("accepts empty website", () => {
    expect(
      validateProfileInput({
        ...validInput,
        website: "",
      }),
    ).toBeNull();
  });

  it("accepts empty username", () => {
    expect(
      validateProfileInput({
        ...validInput,
        username: "",
      }),
    ).toBeNull();
  });

  it("accepts whitespace-only username as empty", () => {
    expect(
      validateProfileInput({
        ...validInput,
        username: "   ",
      }),
    ).toBeNull();
  });

  it("accepts whitespace-only website as empty", () => {
    expect(
      validateProfileInput({
        ...validInput,
        website: "   ",
      }),
    ).toBeNull();
  });

  it("accepts all optional fields as empty", () => {
    expect(
      validateProfileInput({
        displayName: "Anaelle",
        username: "anaelle",
        organization: "",
        phone: "",
        website: "",
        bio: "",
      }),
    ).toBeNull();
  });
});
