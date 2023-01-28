import {transformer} from "../transformer";

describe("Responsive Variants", () => {
  test("should return a transformed content", () => {
    const tvImport = 'import {tv} from "tailwind-variants";';
    const tvComponent = 'const button = tv({ variants: { color: { primary: "bg-blue-600" } } });';
    const sourceCode = tvImport.concat(tvComponent);

    const result = transformer(sourceCode);

    const transformedContent = [
      {
        color: {
          primary: {
            original: "bg-blue-600",
            xs: "xs:bg-blue-600",
            sm: "sm:bg-blue-600",
            md: "md:bg-blue-600",
            lg: "lg:bg-blue-600",
            xl: "xl:bg-blue-600",
            "2xl": "2xl:bg-blue-600",
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
