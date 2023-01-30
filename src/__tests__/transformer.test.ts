import {transformer} from "../transformer";

describe("Responsive Variants", () => {
  test("should return a transformed content (string)", () => {
    const tvImport = 'import {tv} from "tailwind-variants";';
    const tvComponent =
      'const button = tv({ variants: { color: { primary: "text-blue-50 bg-blue-600 rounded" } } });';
    const sourceCode = tvImport.concat(tvComponent);

    const result = transformer.js(sourceCode);

    const transformedContent = [
      {
        color: {
          primary: {
            original: "text-blue-50 bg-blue-600 rounded",
            xs: "xs:text-blue-50 xs:bg-blue-600 xs:rounded",
            sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            md: "md:text-blue-50 md:bg-blue-600 md:rounded",
            lg: "lg:text-blue-50 lg:bg-blue-600 lg:rounded",
            xl: "xl:text-blue-50 xl:bg-blue-600 xl:rounded",
            "2xl": "2xl:text-blue-50 2xl:bg-blue-600 2xl:rounded",
          },
        },
      },
    ];

    const expectedResult = sourceCode.concat(
      `\n/*\n\n${JSON.stringify(transformedContent, undefined, 2)}\n\n*/\n`,
    );

    expect(result).toBe(expectedResult);
  });

  test("should return a transformed content (array)", () => {
    const tvImport = 'import {tv} from "tailwind-variants";';
    const tvComponent =
      'const button = tv({ variants: { color: { primary: ["text-blue-50", "bg-blue-600", "rounded"] } } });';
    const sourceCode = tvImport.concat(tvComponent);

    const result = transformer.js(sourceCode);

    const transformedContent = [
      {
        color: {
          primary: {
            original: ["text-blue-50", "bg-blue-600", "rounded"],
            xs: "xs:text-blue-50 xs:bg-blue-600 xs:rounded",
            sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            md: "md:text-blue-50 md:bg-blue-600 md:rounded",
            lg: "lg:text-blue-50 lg:bg-blue-600 lg:rounded",
            xl: "xl:text-blue-50 xl:bg-blue-600 xl:rounded",
            "2xl": "2xl:text-blue-50 2xl:bg-blue-600 2xl:rounded",
          },
        },
      },
    ];

    const expectedResult = sourceCode.concat(
      `\n/*\n\n${JSON.stringify(transformedContent, undefined, 2)}\n\n*/\n`,
    );

    expect(result).toBe(expectedResult);
  });

  test("should return a transformed content (nested array)", () => {
    const tvImport = 'import {tv} from "tailwind-variants";';
    const tvComponent =
      'const button = tv({ variants: { color: { primary: [["text-blue-50", "bg-blue-600"], "rounded"] } } });';
    const sourceCode = tvImport.concat(tvComponent);

    const result = transformer.js(sourceCode);

    const transformedContent = [
      {
        color: {
          primary: {
            original: [["text-blue-50", "bg-blue-600"], "rounded"],
            xs: "xs:text-blue-50 xs:bg-blue-600 xs:rounded",
            sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            md: "md:text-blue-50 md:bg-blue-600 md:rounded",
            lg: "lg:text-blue-50 lg:bg-blue-600 lg:rounded",
            xl: "xl:text-blue-50 xl:bg-blue-600 xl:rounded",
            "2xl": "2xl:text-blue-50 2xl:bg-blue-600 2xl:rounded",
          },
        },
      },
    ];

    const expectedResult = sourceCode.concat(
      `\n/*\n\n${JSON.stringify(transformedContent, undefined, 2)}\n\n*/\n`,
    );

    expect(result).toBe(expectedResult);
  });

  test("should return a transformed content (responsive slot variant)", () => {
    const tvImport = 'import {tv} from "tailwind-variants";';
    const tvComponent =
      'const button = tv({ slots: { base: "flex" }, variants: { color: { primary: { base: ["bg-blue-50 text-blue-900", ["dark:bg-blue-900", "dark:text-blue-50"]] } } } });';
    const sourceCode = tvImport.concat(tvComponent);

    const result = transformer.js(sourceCode);

    const transformedContent = [
      {
        color: {
          primary: {
            base: {
              original: ["bg-blue-50 text-blue-900", ["dark:bg-blue-900", "dark:text-blue-50"]],
              xs: "xs:bg-blue-50 xs:text-blue-900 xs:dark:bg-blue-900 xs:dark:text-blue-50",
              sm: "sm:bg-blue-50 sm:text-blue-900 sm:dark:bg-blue-900 sm:dark:text-blue-50",
              md: "md:bg-blue-50 md:text-blue-900 md:dark:bg-blue-900 md:dark:text-blue-50",
              lg: "lg:bg-blue-50 lg:text-blue-900 lg:dark:bg-blue-900 lg:dark:text-blue-50",
              xl: "xl:bg-blue-50 xl:text-blue-900 xl:dark:bg-blue-900 xl:dark:text-blue-50",
              "2xl": "2xl:bg-blue-50 2xl:text-blue-900 2xl:dark:bg-blue-900 2xl:dark:text-blue-50",
            },
          },
        },
      },
    ];

    const expectedResult = sourceCode.concat(
      `\n/*\n\n${JSON.stringify(transformedContent, undefined, 2)}\n\n*/\n`,
    );

    expect(result).toBe(expectedResult);
  });
});
