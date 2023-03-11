import type {WithTV, TVTransformer} from "../transformer";

import {tvTransformer, withTV} from "../transformer";

type Mock = {
  withTV: WithTV;
  transformer: TVTransformer;
};

const defaultScreens = ["sm", "md", "lg", "xl", "2xl"];

const mock: Mock = {
  withTV: withTV,
  transformer: (content) => `tv transformer: ${tvTransformer(content, defaultScreens)}`,
};

const expectedContent = (sourceCode: string, transformed: (object | null)[]) => {
  const prefix = "\n/* Tailwind Variants Transformed Content Start\n\n";
  const suffix = "\n\nTailwind Variants Transformed Content End */\n";

  return sourceCode.concat(prefix + JSON.stringify(transformed, undefined, 2) + suffix);
};

describe("Responsive Variants", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should return a transformed content (string)", () => {
    const sourceCode = `
      import {tv} from "tailwind-variants";

      const button = tv(
        {
          variants: {
            color: {
              primary: "text-blue-50 bg-blue-600 rounded"
            }
          }
        },
        {
          responsiveVariants: true
        }
      );
    `;

    const result = tvTransformer(sourceCode, defaultScreens);

    const transformedContent = [
      {
        color: {
          primary: {
            original: "text-blue-50 bg-blue-600 rounded",
            sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            md: "md:text-blue-50 md:bg-blue-600 md:rounded",
            lg: "lg:text-blue-50 lg:bg-blue-600 lg:rounded",
            xl: "xl:text-blue-50 xl:bg-blue-600 xl:rounded",
            "2xl": "2xl:text-blue-50 2xl:bg-blue-600 2xl:rounded",
          },
        },
      },
    ];

    expect(result).toBe(expectedContent(sourceCode, transformedContent));
  });

  test("should return a transformed content (array)", () => {
    const sourceCode = `
      import {tv} from "tailwind-variants";

      const button = tv(
        {
          variants: {
            color: {
              primary: ["text-blue-50", "bg-blue-600", "rounded"]
            }
          }
        },
        {
          responsiveVariants: true
        }
      );
    `;

    const result = tvTransformer(sourceCode, defaultScreens);

    const transformedContent = [
      {
        color: {
          primary: {
            original: ["text-blue-50", "bg-blue-600", "rounded"],
            sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            md: "md:text-blue-50 md:bg-blue-600 md:rounded",
            lg: "lg:text-blue-50 lg:bg-blue-600 lg:rounded",
            xl: "xl:text-blue-50 xl:bg-blue-600 xl:rounded",
            "2xl": "2xl:text-blue-50 2xl:bg-blue-600 2xl:rounded",
          },
        },
      },
    ];

    expect(result).toBe(expectedContent(sourceCode, transformedContent));
  });

  test("should return a transformed content (nested array)", () => {
    const sourceCode = `
      import {tv} from "tailwind-variants";

      const button = tv(
        {
          variants: {
            color: {
              primary: [["text-blue-50", "bg-blue-600"], "rounded"]
            }
          }
        },
        {
          responsiveVariants: true
        }
      );
    `;

    const result = tvTransformer(sourceCode, defaultScreens);

    const transformedContent = [
      {
        color: {
          primary: {
            original: [["text-blue-50", "bg-blue-600"], "rounded"],
            sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            md: "md:text-blue-50 md:bg-blue-600 md:rounded",
            lg: "lg:text-blue-50 lg:bg-blue-600 lg:rounded",
            xl: "xl:text-blue-50 xl:bg-blue-600 xl:rounded",
            "2xl": "2xl:text-blue-50 2xl:bg-blue-600 2xl:rounded",
          },
        },
      },
    ];

    expect(result).toBe(expectedContent(sourceCode, transformedContent));
  });

  test("should return a transformed content (responsive slot variant)", () => {
    const sourceCode = `
      import {tv} from "tailwind-variants";

      const button = tv(
        {
          slots: {
            base: "flex"
          },
          variants: {
            color: {
              primary: {
                base: ["bg-blue-50 text-blue-900", ["dark:bg-blue-900", "dark:text-blue-50"]]
              }
            }
          }
        },
        {
          responsiveVariants: true
        }
      );
    `;

    const result = tvTransformer(sourceCode, defaultScreens);

    const transformedContent = [
      {
        color: {
          primary: {
            base: {
              original: ["bg-blue-50 text-blue-900", ["dark:bg-blue-900", "dark:text-blue-50"]],
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

    expect(result).toBe(expectedContent(sourceCode, transformedContent));
  });

  test("should return a transformed content (on-demand responsive variants - screens)", () => {
    const sourceCode = `
      import {tv} from "tailwind-variants";

      const button = tv(
        {
          variants: {
            color: {
              primary: "text-blue-50 bg-blue-600 rounded"
            }
          }
        },
        {
          responsiveVariants: ["sm", "md"]
        }
      );
    `;

    const result = tvTransformer(sourceCode, defaultScreens);

    const transformedContent = [
      {
        color: {
          primary: {
            original: "text-blue-50 bg-blue-600 rounded",
            sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            md: "md:text-blue-50 md:bg-blue-600 md:rounded",
          },
        },
      },
    ];

    expect(result).toBe(expectedContent(sourceCode, transformedContent));
  });

  test("should return a transformed content (on-demand responsive variants - variants)", () => {
    const sourceCode = `
      import {tv} from "tailwind-variants";

      const button = tv(
        {
          variants: {
            color: {
              primary: "text-blue-50 bg-blue-600 rounded"
            }
          }
        },
        {
          responsiveVariants: {
            color: ["sm"]
          }
        }
      );
    `;

    const result = tvTransformer(sourceCode, defaultScreens);

    const transformedContent = [
      [
        {
          color: {
            primary: {
              original: "text-blue-50 bg-blue-600 rounded",
              sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            },
          },
        },
      ],
    ];

    expect(result).toBe(expectedContent(sourceCode, transformedContent));
  });

  test("should return a transformed content (with extend)", () => {
    const sourceCode = `
      import {tv} from "tailwind-variants";

      const baseButton = tv({
        base: "px-2"
      });

      const button = tv(
        {
          extend: baseButton,
          variants: {
            color: {
              primary: "text-blue-50 bg-blue-600 rounded"
            }
          }
        },
        {
          responsiveVariants: true
        }
      );
    `;

    const result = tvTransformer(sourceCode, defaultScreens);

    const transformedContent = [
      null,
      {
        color: {
          primary: {
            original: "text-blue-50 bg-blue-600 rounded",
            sm: "sm:text-blue-50 sm:bg-blue-600 sm:rounded",
            md: "md:text-blue-50 md:bg-blue-600 md:rounded",
            lg: "lg:text-blue-50 lg:bg-blue-600 lg:rounded",
            xl: "xl:text-blue-50 xl:bg-blue-600 xl:rounded",
            "2xl": "2xl:text-blue-50 2xl:bg-blue-600 2xl:rounded",
          },
        },
      },
    ];

    expect(result).toBe(expectedContent(sourceCode, transformedContent));
  });

  test("should return tailwind config with built-in transformer (withTV content array)", () => {
    const expectedResult = {
      content: {
        files: ["./src/**/*.{ts,tsx}"],
        transform: {
          ts: mock.transformer,
          tsx: mock.transformer,
        },
      },
    };

    jest.spyOn(mock, "withTV").mockReturnValue(expectedResult);

    const mockResult = mock.withTV({
      content: ["./src/**/*.{ts,tsx}"],
    });

    expect(mock.withTV).toHaveBeenCalledTimes(1);
    expect(mockResult).toMatchObject(expectedResult);
  });

  test("should return tailwind config with built-in transformer (withTV content object)", () => {
    const expectedResult = {
      content: {
        files: ["./src/**/*.{vue,svelte}"],
        transform: {
          vue: mock.transformer,
          svelte: mock.transformer,
        },
      },
    };

    jest.spyOn(mock, "withTV").mockReturnValue(expectedResult);

    const mockResult = mock.withTV({
      content: {
        files: ["./src/**/*.{vue,svelte}"],
      },
    });

    expect(mock.withTV).toHaveBeenCalledTimes(1);
    expect(mockResult).toMatchObject(expectedResult);
  });

  test("should ignore the html file extension (withTV)", () => {
    const expectedResult = {
      content: {
        files: ["./src/**/*.{js,jsx}"],
        transform: {
          ts: mock.transformer,
          tsx: mock.transformer,
        },
      },
    };

    jest.spyOn(mock, "withTV").mockReturnValue(expectedResult);

    const mockResult = mock.withTV({
      content: ["./index.html", "./src/**/*.{js,jsx}"],
    });

    expect(mock.withTV).toHaveBeenCalledTimes(1);
    expect(mockResult).toMatchObject(expectedResult);
  });
});
