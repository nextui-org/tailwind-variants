import {falsyToString} from "../utils";

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
