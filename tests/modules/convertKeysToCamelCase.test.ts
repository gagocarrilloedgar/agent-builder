import { convertKeysToCamelCase } from "@/shared/lib/convertKeysToCamelCase";
import { describe, expect, it } from "vitest";
describe("convertKeysToCamelCase", () => {
  it("should convert nested object keys from snake_case to camelCase", () => {
    const input = {
      user_info: {
        first_name: "Jane",
        last_name: "Doe",
      },
    };
    const expected = {
      userInfo: {
        firstName: "Jane",
        lastName: "Doe",
      },
    };

    const result = convertKeysToCamelCase(input);
    expect(result).toEqual(expected);
  });

  it("should convert keys of objects inside an array", () => {
    const input = [{ first_name: "Alice" }, { first_name: "Bob" }];
    const expected = [{ firstName: "Alice" }, { firstName: "Bob" }];

    const result = convertKeysToCamelCase(input);
    expect(result).toEqual(expected);
  });

  it('should replace "node_type" with "type"', () => {
    const input = { node_type: "example" };
    const expected = { type: "example" };

    const result = convertKeysToCamelCase(input);
    expect(result).toEqual(expected);
  });

  it("should handle mixed data types", () => {
    const input = {
      first_name: "Chris",
      age: 30,
      hobbies: ["running", "reading"],
      preferences: {
        likes_coffee: true,
      },
    };
    const expected = {
      firstName: "Chris",
      age: 30,
      hobbies: ["running", "reading"],
      preferences: {
        likesCoffee: true,
      },
    };

    const result = convertKeysToCamelCase(input);
    expect(result).toEqual(expected);
  });

  it("should return null or non-object values as is", () => {
    expect(convertKeysToCamelCase(null)).toBe(null);
    expect(convertKeysToCamelCase(123)).toBe(123);
    expect(convertKeysToCamelCase("string")).toBe("string");
  });
});
