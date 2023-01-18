import {tv} from "../index";

const resultArray = (result: string) => result.split(" ");

const expectTv = (result: string, expectedResult: string[]) => {
  expect(resultArray(result)).toEqual(expect.arrayContaining(expectedResult));
};

describe("Tailwind Variants (TV)", () => {
  test("should work without variants", () => {
    const h1 = tv({
      base: "text-3xl font-bold",
    });

    const expectedResult = "text-3xl font-bold";
    const result = h1();

    expect(result).toBe(expectedResult);
  });

  test("should work with variants", () => {
    const h1 = tv({
      base: "text-3xl font-bold",
      variants: {
        isBig: {
          true: "text-5xl",
          false: "text-2xl",
        },
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
      },
    });

    const result = h1({
      isBig: true,
      color: "blue",
    });

    const expectedResult = ["text-5xl", "font-bold", "text-blue-500"];

    expectTv(result, expectedResult);
  });

  test("should work with compoundVariants", () => {
    const h1 = tv({
      base: "text-3xl font-bold",
      variants: {
        isBig: {
          true: "text-5xl",
          false: "text-2xl",
        },
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
      },
      compoundVariants: [
        {
          isBig: true,
          color: "red",
          class: "bg-red-500",
        },
      ],
    });

    const result = h1({
      isBig: true,
      color: "red",
    });

    const expectedResult = ["text-5xl", "font-bold", "text-red-500", "bg-red-500"];

    expectTv(result, expectedResult);
  });

  test("should throw error if the compoundVariants is not an array", () => {
    expect(
      tv({
        base: "text-3xl font-bold",
        variants: {
          isBig: {
            true: "text-5xl",
            false: "text-2xl",
          },
          color: {
            red: "text-red-500",
            blue: "text-blue-500",
          },
        },
        // @ts-expect-error
        compoundVariants: {},
      }),
    ).toThrow();
  });

  test("should work with custom class & className", () => {
    const h1 = tv({
      base: "text-3xl font-bold",
    });

    const expectedResult = ["text-3xl", "font-bold"];

    const result1 = h1({
      className: "my-class",
    });
    const result2 = h1({
      class: "my-class",
    });

    expectTv(result1, expectedResult);
    expectTv(result2, expectedResult);
  });

  test("should work without anything", () => {
    const styles = tv({});
    const expectedResult = "";

    expect(styles()).toBe(expectedResult);
  });

  test("should work correctly with twMerge", () => {
    const h1 = tv({
      base: "text-3xl font-bold text-blue-400 text-xl text-blue-200",
    });

    const expectedResult = ["font-bold", "text-xl", "text-blue-200"];

    expectTv(h1(), expectedResult);
  });

  test("should work correctly without twMerge", () => {
    const h1 = tv(
      {
        base: "text-3xl font-bold text-blue-400 text-xl text-blue-200",
      },
      {
        twMerge: false,
      },
    );

    const expectedResult = ["text-3xl", "font-bold", "text-blue-400", "text-xl", "text-blue-200"];

    expectTv(h1(), expectedResult);
  });

  test("should work without defaultsVariants", () => {
    const button = tv({
      base: "button",
      variants: {
        variant: {
          primary: "button--primary",
          secondary: "button--secondary",
          warning: "button--warning",
          error: "button--danger",
        },
        isDisabled: {
          true: "button--disabled",
          false: "button--enabled",
        },
        size: {
          small: "button--small",
          medium: "button--medium",
          large: "button--large",
        },
      },
      compoundVariants: [
        {
          variant: "secondary",
          size: "small",
          class: "button--secondary-small",
        },
        {
          variant: "warning",
          isDisabled: false,
          class: "button--warning-enabled",
        },
        {
          variant: "warning",
          isDisabled: true,
          class: "button--warning-disabled",
        },
        {
          variant: ["warning", "error"],
          class: "button--warning-danger",
        },
        {
          variant: ["warning", "error"],
          size: "medium",
          class: "button--warning-danger-medium",
        },
      ],
    });

    const expectedResult = [
      "button",
      "button--secondary",
      "button--small",
      "button--enabled",
      "button--secondary-small",
    ];

    expectTv(button({variant: "secondary", size: "small", isDisabled: false}), expectedResult);
  });

  test("should work with simple variants", () => {
    const h1 = tv({
      base: "text-3xl font-bold underline",
      variants: {
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
          green: "text-green-500",
        },
        isUnderline: {
          true: "underline",
          false: "no-underline",
        },
      },
    });

    const expectedResult = "text-3xl font-bold text-green-500 no-underline";

    expect(h1({color: "green", isUnderline: false})).toBe(expectedResult);
  });

  test("should work with slots -- default variants", () => {
    const menu = tv({
      base: "text-3xl font-bold underline",
      slots: {
        title: "text-2xl",
        item: "text-xl",
        list: "list-none",
        wrapper: "flex flex-col",
      },
      variants: {
        color: {
          primary: "color--primary",
          secondary: {
            title: "color--primary-title",
            item: "color--primary-item",
            list: "color--primary-list",
            wrapper: "color--primary-wrapper",
          },
        },
        size: {
          xs: "size--xs",
          sm: "size--sm",
          md: {
            title: "size--md-title",
          },
        },
        isDisabled: {
          true: {
            title: "disabled--title",
          },
          false: {
            item: "enabled--item",
          },
        },
      },
      defaultVariants: {
        color: "primary",
        size: "sm",
        isDisabled: false,
      },
    });

    // with default values
    const {base, title, item, list, wrapper} = menu();

    expectTv(base(), ["text-3xl", "font-bold", "underline", "color--primary", "size--sm"]);
    expectTv(title(), ["text-2xl"]);
    expectTv(item(), ["text-xl", "enabled--item"]);
    expectTv(list(), ["list-none"]);
    expectTv(wrapper(), ["flex", "flex-col"]);
  });

  test("should work with empty slots", () => {
    const menu = tv({
      slots: {
        base: "",
        title: "",
        item: "",
        list: "",
      },
    });

    const {base, title, item, list} = menu();

    expectTv(base(), []);
    expectTv(title(), []);
    expectTv(item(), []);
    expectTv(list(), []);
  });

  test("should wotk with dark classes -- without slots", () => {
    const el = tv({
      base: "text-3xl font-bold text-gray-900",
      dark: ["text-white", "bg-gray-900"],
    });

    expectTv(el(), [
      "text-3xl",
      "font-bold",
      "text-gray-900",
      "dark:text-white",
      "dark:bg-gray-900",
    ]);
  });

  test("should wotk with dark classes -- with slots", () => {
    const el = tv({
      base: "text-3xl font-bold text-gray-900",
      slots: {
        title: "text-4xl font-bold text-gray-900",
      },
      dark: {
        base: ["text-white", "bg-gray-900"],
        title: "text-5xl font-bold text-white",
      },
    });

    const {base, title} = el();

    expectTv(base(), [
      "text-3xl",
      "font-bold",
      "text-gray-900",
      "dark:text-white",
      "dark:bg-gray-900",
    ]);
    expectTv(title(), [
      "text-4xl",
      "font-bold",
      "text-gray-900",
      "dark:text-5xl",
      "dark:text-white",
    ]);
  });

  test("should work with slots -- default variants -- custom class & className", () => {
    const menu = tv({
      base: "text-3xl font-bold underline",
      slots: {
        title: "text-2xl",
        item: "text-xl",
        list: "list-none",
        wrapper: "flex flex-col",
      },
      variants: {
        color: {
          primary: "color--primary",
          secondary: {
            title: "color--primary-title",
            item: "color--primary-item",
            list: "color--primary-list",
            wrapper: "color--primary-wrapper",
          },
        },
        size: {
          xs: "size--xs",
          sm: "size--sm",
          md: {
            title: "size--md-title",
          },
        },
        isDisabled: {
          true: {
            title: "disabled--title",
          },
          false: {
            item: "enabled--item",
          },
        },
      },
      defaultVariants: {
        color: "primary",
        size: "sm",
        isDisabled: false,
      },
    });

    // with default values
    const {base, title, item, list, wrapper} = menu();

    expectTv(base({class: "class--base"}), [
      "text-3xl",
      "font-bold",
      "underline",
      "color--primary",
      "size--sm",
      "class--base",
    ]);
    expectTv(title({className: "classname--title"}), ["text-2xl", "classname--title"]);
    expectTv(item({class: "class--item"}), ["text-xl", "enabled--item", "class--item"]);
    expectTv(list({className: "classname--list"}), ["list-none", "classname--list"]);
    expectTv(wrapper({class: "class--wrapper"}), ["flex", "flex-col", "class--wrapper"]);
  });

  test("should work with slots -- custom variants", () => {
    const menu = tv({
      base: "text-3xl font-bold underline",
      slots: {
        title: "text-2xl",
        item: "text-xl",
        list: "list-none",
        wrapper: "flex flex-col",
      },
      variants: {
        color: {
          primary: "color--primary",
          secondary: {
            base: "color--secondary-base",
            title: "color--secondary-title",
            item: "color--secondary-item",
            list: "color--secondary-list",
            wrapper: "color--secondary-wrapper",
          },
        },
        size: {
          xs: "size--xs",
          sm: "size--sm",
          md: {
            title: "size--md-title",
          },
        },
        isDisabled: {
          true: {
            title: "disabled--title",
          },
          false: {
            item: "enabled--item",
          },
        },
      },
      defaultVariants: {
        color: "primary",
        size: "sm",
        isDisabled: false,
      },
    });

    // with custom props
    const {base, title, item, list, wrapper} = menu({
      color: "secondary",
      size: "md",
    });

    expectTv(base(), ["text-3xl", "font-bold", "underline", "color--secondary-base"]);
    expectTv(title(), ["size--md-title", "color--secondary-title"]);
    expectTv(item(), ["text-xl", "color--secondary-item"]);
    expectTv(list(), ["list-none", "color--secondary-list"]);
    expectTv(wrapper(), ["flex", "flex-col", "color--secondary-wrapper"]);
  });

  test("should work with slots -- custom variants -- custom class & className", () => {
    const menu = tv({
      base: "text-3xl font-bold underline",
      slots: {
        title: "text-2xl",
        item: "text-xl",
        list: "list-none",
        wrapper: "flex flex-col",
      },
      variants: {
        color: {
          primary: "color--primary",
          secondary: {
            base: "color--secondary-base",
            title: "color--secondary-title",
            item: "color--secondary-item",
            list: "color--secondary-list",
            wrapper: "color--secondary-wrapper",
          },
        },
        size: {
          xs: "size--xs",
          sm: "size--sm",
          md: {
            title: "size--md-title",
          },
        },
        isDisabled: {
          true: {
            title: "disabled--title",
          },
          false: {
            item: "enabled--item",
          },
        },
      },
      defaultVariants: {
        color: "primary",
        size: "sm",
        isDisabled: false,
      },
    });

    // with default values
    const {base, title, item, list, wrapper} = menu({
      color: "secondary",
      size: "md",
    });

    expectTv(base({class: "class--base"}), [
      "text-3xl",
      "font-bold",
      "underline",
      "color--secondary-base",
      "class--base",
    ]);
    expectTv(
      title({
        className: "classname--title",
      }),
      ["size--md-title", "color--secondary-title", "classname--title"],
    );
    expectTv(
      item({
        class: "class--item",
      }),
      ["text-xl", "color--secondary-item", "class--item"],
    );
    expectTv(
      list({
        className: "classname--list",
      }),
      ["list-none", "color--secondary-list", "classname--list"],
    );
    expectTv(
      wrapper({
        class: "class--wrapper",
      }),
      ["flex", "flex-col", "color--secondary-wrapper", "class--wrapper"],
    );
  });

  test("should work with slots and compoundVariants", () => {
    const menu = tv({
      base: "text-3xl font-bold underline",
      slots: {
        title: "text-2xl",
        item: "text-xl",
        list: "list-none",
        wrapper: "flex flex-col",
      },
      variants: {
        color: {
          primary: "color--primary",
          secondary: {
            base: "color--secondary-base",
            title: "color--secondary-title",
            item: "color--secondary-item",
            list: "color--secondary-list",
            wrapper: "color--secondary-wrapper",
          },
        },
        size: {
          xs: "size--xs",

          sm: "size--sm",
          md: {
            title: "size--md-title",
          },
        },
        isDisabled: {
          true: {
            title: "disabled--title",
          },
          false: {
            item: "enabled--item",
          },
        },
      },
      defaultVariants: {
        color: "primary",
        size: "sm",
        isDisabled: false,
      },
      compoundVariants: [
        {
          color: "secondary",
          size: "md",
          class: {
            base: "compound--base",
            title: "compound--title",
            item: "compound--item",
            list: "compound--list",
            wrapper: "compound--wrapper",
          },
        },
      ],
    });

    const {base, title, item, list, wrapper} = menu({
      color: "secondary",
      size: "md",
    });

    expectTv(base(), [
      "text-3xl",
      "font-bold",
      "underline",
      "color--secondary-base",
      "compound--base",
    ]);
    expectTv(title(), ["size--md-title", "color--secondary-title", "compound--title"]);
    expectTv(item(), ["text-xl", "color--secondary-item", "enabled--item", "compound--item"]);
    expectTv(list(), ["list-none", "color--secondary-list", "compound--list"]);
    expectTv(wrapper(), ["flex", "flex-col", "color--secondary-wrapper", "compound--wrapper"]);
  });
});
