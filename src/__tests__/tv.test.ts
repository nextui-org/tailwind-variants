import {tv} from "../index";

const resultArray = (result: string) => result.split(" ");

const expectTv = (result: string, expectedResult: string[]) => {
  expect(resultArray(result)).toEqual(expect.arrayContaining(expectedResult));
};

const expectKeys = (result: string[], expectedResult: string[]) => {
  expect(result).toEqual(expect.arrayContaining(expectedResult));
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

  test("should work with variantkeys", () => {
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

    const expectedResult = ["isBig", "color"];

    expectKeys(h1.variantkeys, expectedResult);
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

  test("should work with screenVariants/initial screen", () => {
    const button = tv({
      base: "text-xs font-bold",
      variants: {
        color: {
          primary: "text-blue-500",
          secondary: "text-purple-500",
          success: "text-green-500",
          danger: "text-red-500",
        },
        size: {
          sm: "text-sm",
          md: "text-md",
          lg: "text-lg",
        },
        variant: {
          outline: "border border-blue-500",
          solid: "bg-blue-500",
          ghost: "bg-transparent hover:bg-blue-500",
        },
      },
    });

    const result = button({
      color: {
        initial: "primary",
        xs: "danger",
        sm: "success",
      },
    });

    const expectedResult = [
      "text-xs",
      "font-bold",
      "text-blue-500",
      "xs:text-red-500",
      "sm:text-green-500",
    ];

    expectTv(result, expectedResult);
  });

  test("the screenVariants/initial should override the defaultVariants", () => {
    const button = tv({
      base: "text-xs font-bold",
      variants: {
        color: {
          primary: "text-blue-500",
          secondary: "text-purple-500",
          success: "text-green-500",
          danger: "text-red-500",
        },
        size: {
          sm: "text-sm",
          md: "text-md",
          lg: "text-lg",
        },
        variant: {
          outline: "border border-blue-500",
          solid: "bg-blue-500",
          ghost: "bg-transparent hover:bg-blue-500",
        },
      },
      defaultVariants: {
        color: "primary",
        size: "sm",
      },
    });

    const result = button({
      color: {
        initial: "secondary",
      },
      size: {
        initial: "md",
      },
    });

    const expectedResult = ["font-bold", "text-purple-500", "text-md"];

    expectTv(result, expectedResult);
  });

  test("should work with multiple screenVariants single values", () => {
    const button = tv({
      base: "base--styles",
      variants: {
        color: {
          primary: "color--primary",
          secondary: "color--secondary",
          success: "color--success",
          danger: "color--danger",
        },
        size: {
          mini: "size--mini",
          small: "size--small",
          medium: "size--medium",
          large: "size--large",
        },
        variant: {
          outline: "variant--outline",
          solid: "variant--solid",
          ghost: "variant--ghost",
        },
      },
    });

    const result = button({
      color: {
        initial: "primary",
        xs: "success",
        sm: "secondary",
        md: "danger",
      },
      size: {
        initial: "medium",
        xs: "mini",
        sm: "small",
        md: "medium",
      },
      variant: {
        initial: "solid",
        xs: "outline",
        sm: "outline",
        md: "solid",
      },
    });

    const expectedResult = [
      "base--styles",
      "color--primary",
      "xs:color--success",
      "sm:color--secondary",
      "md:color--danger",
      "size--medium",
      "xs:size--mini",
      "sm:size--small",
      "md:size--medium",
      "variant--solid",
      "xs:variant--outline",
      "sm:variant--outline",
      "md:variant--solid",
    ];

    expectTv(result, expectedResult);
  });

  test("should work with multiple screenVariants multiple values (strings)", () => {
    const button = tv({
      base: "base--styles",
      variants: {
        color: {
          primary: "color--primary-1 color--primary-2 color--primary-3",
          secondary: "color--secondary-1 color--secondary-2 color--secondary-3",
          success: "color--success-1 color--success-2 color--success-3",
          danger: "color--danger color--danger-2 color--danger-3",
        },
        size: {
          mini: "size--mini-1 size--mini-2 size--mini-3",
          small: "size--small-1 size--small-2 size--small-3",
          medium: "size--medium-1 size--medium-2 size--medium-3",
          large: "size--large-1 size--large-2 size--large-3",
        },
        variant: {
          outline: "variant--outline-1 variant--outline-2 variant--outline-3",
          solid: "variant--solid-1 variant--solid-2 variant--solid-3",
          ghost: "variant--ghost-1 variant--ghost-2 variant--ghost-3",
        },
      },
    });

    const result = button({
      color: {
        initial: "primary",
        xs: "success",
        sm: "secondary",
        md: "danger",
      },
      size: {
        initial: "medium",
        xs: "mini",
        sm: "small",
        md: "medium",
      },
      variant: {
        initial: "solid",
        xs: "outline",
        sm: "outline",
        md: "solid",
      },
    });

    const expectedResult = [
      "base--styles",
      "color--primary-1",
      "color--primary-2",
      "color--primary-3",
      "xs:color--success-1",
      "xs:color--success-2",
      "xs:color--success-3",
      "sm:color--secondary-1",
      "sm:color--secondary-2",
      "sm:color--secondary-3",
      "md:color--danger",
      "md:color--danger-2",
      "md:color--danger-3",
      "size--medium-1",
      "size--medium-2",
      "size--medium-3",
      "xs:size--mini-1",
      "xs:size--mini-2",
      "xs:size--mini-3",
      "sm:size--small-1",
      "sm:size--small-2",
      "sm:size--small-3",
      "md:size--medium-1",
      "md:size--medium-2",
      "md:size--medium-3",
      "variant--solid-1",
      "variant--solid-2",
      "variant--solid-3",
      "xs:variant--outline-1",
      "xs:variant--outline-2",
      "xs:variant--outline-3",
      "sm:variant--outline-1",
      "sm:variant--outline-2",
      "sm:variant--outline-3",
      "md:variant--solid-1",
      "md:variant--solid-2",
      "md:variant--solid-3",
    ];

    expectTv(result, expectedResult);
  });

  test("should work with multiple screenVariants multiple values (array)", () => {
    const button = tv({
      base: "base--styles",
      variants: {
        color: {
          primary: ["color--primary-1", "color--primary-2", "color--primary-3"],
          secondary: ["color--secondary-1", "color--secondary-2", "color--secondary-3"],
          success: ["color--success-1", "color--success-2", "color--success-3"],
          danger: ["color--danger", "color--danger-2", "color--danger-3"],
        },
        size: {
          mini: ["size--mini-1", "size--mini-2", "size--mini-3"],
          small: ["size--small-1", "size--small-2", "size--small-3"],
          medium: ["size--medium-1", "size--medium-2", "size--medium-3"],
          large: ["size--large-1", "size--large-2", "size--large-3"],
        },
        variant: {
          outline: ["variant--outline-1", "variant--outline-2", "variant--outline-3"],
          solid: ["variant--solid-1", "variant--solid-2", "variant--solid-3"],
          ghost: ["variant--ghost-1", "variant--ghost-2", "variant--ghost-3"],
        },
      },
    });

    const result = button({
      color: {
        initial: "primary",
        xs: "success",
        sm: "secondary",
        md: "danger",
      },
      size: {
        initial: "medium",
        xs: "mini",
        sm: "small",
        md: "medium",
      },
      variant: {
        initial: "solid",
        xs: "outline",
        sm: "outline",
        md: "solid",
      },
    });

    const expectedResult = [
      "base--styles",
      "color--primary-1",
      "color--primary-2",
      "color--primary-3",
      "xs:color--success-1",
      "xs:color--success-2",
      "xs:color--success-3",
      "sm:color--secondary-1",
      "sm:color--secondary-2",
      "sm:color--secondary-3",
      "md:color--danger",
      "md:color--danger-2",
      "md:color--danger-3",
      "size--medium-1",
      "size--medium-2",
      "size--medium-3",
      "xs:size--mini-1",
      "xs:size--mini-2",
      "xs:size--mini-3",
      "sm:size--small-1",
      "sm:size--small-2",
      "sm:size--small-3",
      "md:size--medium-1",
      "md:size--medium-2",
      "md:size--medium-3",
      "variant--solid-1",
      "variant--solid-2",
      "variant--solid-3",
      "xs:variant--outline-1",
      "xs:variant--outline-2",
      "xs:variant--outline-3",
      "sm:variant--outline-1",
      "sm:variant--outline-2",
      "sm:variant--outline-3",
      "md:variant--solid-1",
      "md:variant--solid-2",
      "md:variant--solid-3",
    ];

    expectTv(result, expectedResult);
  });

  test("should work with multiple screenVariants single values and slots", () => {
    const menu = tv({
      base: "base--styles",
      slots: {
        title: "slots--title",
        item: "slots--item",
        list: "slots--list",
        wrapper: "slots--wrapper",
      },
      variants: {
        color: {
          primary: {
            title: "title--color--primary",
            item: "item--color--primary",
            list: "list--color--primary",
            wrapper: "wrapper--color--primary",
          },
          secondary: {
            title: "title--color--secondary",
            item: "item--color--secondary",
            list: "list--color--secondary",
            wrapper: "wrapper--color--secondary",
          },
        },
        size: {
          small: {
            title: "title--size--small",
            item: "item--size--small",
            list: "list--size--small",
            wrapper: "wrapper--size--small",
          },
          medium: {
            title: "title--size--medium",
            item: "item--size--medium",
            list: "list--size--medium",
            wrapper: "wrapper--size--medium",
          },
        },
      },
    });

    const {base, title, item, list, wrapper} = menu({
      color: {
        initial: "primary",
        xs: "secondary",
        sm: "primary",
        md: "secondary",
      },
      size: {
        initial: "medium",
        xs: "small",
        sm: "medium",
        md: "medium",
      },
    });

    expectTv(base(), ["base--styles"]);
    expectTv(title(), [
      "slots--title",
      "xs:title--color--secondary",
      "sm:title--color--primary",
      "md:title--color--secondary",
      "title--color--primary",
      "xs:title--size--small",
      "sm:title--size--medium",
      "md:title--size--medium",
      "title--size--medium",
    ]);
    expectTv(item(), [
      "slots--item",
      "xs:item--color--secondary",
      "sm:item--color--primary",
      "md:item--color--secondary",
      "item--color--primary",
      "xs:item--size--small",
      "sm:item--size--medium",
      "md:item--size--medium",
      "item--size--medium",
    ]);
    expectTv(list(), [
      "slots--list",
      "xs:list--color--secondary",
      "sm:list--color--primary",
      "md:list--color--secondary",
      "list--color--primary",
      "xs:list--size--small",
      "sm:list--size--medium",
      "md:list--size--medium",
      "list--size--medium",
    ]);
    expectTv(wrapper(), [
      "slots--wrapper",
      "xs:wrapper--color--secondary",
      "sm:wrapper--color--primary",
      "md:wrapper--color--secondary",
      "wrapper--color--primary",
      "xs:wrapper--size--small",
      "sm:wrapper--size--medium",
      "md:wrapper--size--medium",
      "wrapper--size--medium",
    ]);
  });
});
