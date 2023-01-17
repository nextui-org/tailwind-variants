import {cleanArray, falsyToString} from "../utils";

describe("cleanArray", () => {
  it("returns null if array is null", () => {
    // @ts-ignore
    expect(cleanArray(null)).toBeNull();
  });

  it("returns null if array is undefined", () => {
    // @ts-ignore
    expect(cleanArray(undefined)).toBeNull();
  });

  it("returns an empty array if array is empty", () => {
    // @ts-ignore
    expect(cleanArray([])).toEqual([]);
  });

  test("should filter out items that are not strings that contain only whitespace, letters, and numbers", () => {
    const array = ["text", "", 3, "text3", "3text", null, "&"];

    const result = cleanArray(array as string[]);

    expect(result).toEqual(["text", "3", "text3", "3text"]);
  });

  it("returns an array of clean strings", () => {
    const array = ["string 1", "string2", "string 3", "root", "!@#$%^&*", "string 4"];
    const result = cleanArray(array);

    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining(["string2", "root"]));
  });
});

describe("falsyToString", () => {
  test("should return a string when given a boolean", () => {
    expect(falsyToString(true)).toBe("true");
    expect(falsyToString(false)).toBe("false");
  });

  test("should return 0 when given 0", () => {
    expect(falsyToString(0)).toBe("0");
  });

  test("should return the original value when given a value other than 0 or a boolean", () => {
    expect(falsyToString("test")).toBe("test");
    expect(falsyToString(4)).toBe(4);
    expect(falsyToString(null)).toBe(null);
  });
});
