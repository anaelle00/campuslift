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

  it("rejects websites without a protocol", () => {
    expect(
      validateProfileInput({
        ...validInput,
        website: "campuslift.dev",
      }),
    ).toBe("Website must start with http:// or https://");
  });

  it("accepts a valid profile payload", () => {
    expect(validateProfileInput(validInput)).toBeNull();
  });
});
