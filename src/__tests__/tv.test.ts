import {tv, cn} from "../index";

const resultArray = (result: string) => result.split(" ");

const expectTv = (result: string, expectedResult: string[]) => {
  expect(resultArray(result)).toEqual(expect.arrayContaining(expectedResult));
};

const expectKeys = (result: string[], expectedResult: string[]) => {
  expect(result).toEqual(expect.arrayContaining(expectedResult));
};

const COMMON_UNITS = ["small", "medium", "large"];

const twMergeConfig = {
  theme: {
    opacity: ["disabled"],
    spacing: ["divider", "unit", "unit-2", "unit-4", "unit-6"],
    borderWidth: COMMON_UNITS,
    borderRadius: COMMON_UNITS,
  },
  classGroups: {
    shadow: [{shadow: COMMON_UNITS}],
    "font-size": [{text: ["tiny", ...COMMON_UNITS]}],
    "bg-image": ["bg-stripe-gradient"],
    "min-w": [
      {
        "min-w": ["unit", "unit-2", "unit-4", "unit-6"],
      },
    ],
  },
};

describe("Tailwind Variants (TV) - Default", () => {
  test("should work with nested arrays", () => {
    const menu = tv({
      base: ["base--styles-1", ["base--styles-2", ["base--styles-3"]]],
      slots: {
        item: ["slots--item-1", ["slots--item-2", ["slots--item-3"]]],
      },
      variants: {
        color: {
          primary: {
            item: [
              "item--color--primary-1",
              ["item--color--primary-2", ["item--color--primary-3"]],
            ],
          },
        },
      },
    });

    const popover = tv({
      variants: {
        isOpen: {
          true: ["isOpen--true-1", ["isOpen--true-2", ["isOpen--true-3"]]],
          false: ["isOpen--false-1", ["isOpen--false-2", ["isOpen--false-3"]]],
        },
      },
    });

    const {base, item} = menu({color: "primary"});

    expectTv(base(), ["base--styles-1", "base--styles-2", "base--styles-3"]);
    expectTv(item(), [
      "item--color--primary-1",
      "item--color--primary-2",
      "item--color--primary-3",
    ]);
    expectTv(popover({isOpen: true}), ["isOpen--true-1", "isOpen--true-2", "isOpen--true-3"]);
    expectTv(popover({isOpen: false}), ["isOpen--false-1", "isOpen--false-2", "isOpen--false-3"]);
  });

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

  test("should work with variantKeys", () => {
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

    expectKeys(h1.variantKeys, expectedResult);
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

    const expectedResult = ["text-xl", "font-bold"];

    const result1 = h1({
      className: "text-xl",
    });

    const result2 = h1({
      class: "text-xl",
    });

    expectTv(result1, expectedResult);
    expectTv(result2, expectedResult);
  });

  test("should work without anything", () => {
    const styles = tv({});
    const expectedResult = undefined;

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
});

describe("Tailwind Variants (TV) - Slots", () => {
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

    const expectedResult = undefined;

    expect(base()).toBe(expectedResult);
    expect(title()).toBe(expectedResult);
    expect(item()).toBe(expectedResult);
    expect(list()).toBe(expectedResult);
  });

  test("should work with slots -- default variants -- custom class & className", () => {
    const menu = tv({
      slots: {
        base: "text-3xl font-bold underline",
        title: "text-2xl",
        item: "text-xl",
        list: "list-none",
        wrapper: "flex flex-col",
      },
      variants: {
        color: {
          primary: {
            base: "bg-blue-500",
          },
          secondary: {
            title: "text-white",
            item: "bg-purple-100",
            list: "bg-purple-200",
            wrapper: "bg-transparent",
          },
        },
        size: {
          xs: {
            base: "text-xs",
          },
          sm: {
            base: "text-sm",
          },
          md: {
            title: "text-md",
          },
        },
        isDisabled: {
          true: {
            title: "opacity-50",
          },
          false: {
            item: "opacity-100",
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

    // base
    expectTv(base({class: "text-lg"}), ["font-bold", "underline", "bg-blue-500", "text-lg"]);
    expectTv(base({className: "text-lg"}), ["font-bold", "underline", "bg-blue-500", "text-lg"]);
    // title
    expectTv(title({class: "text-2xl"}), ["text-2xl"]);
    expectTv(title({className: "text-2xl"}), ["text-2xl"]);
    // item
    expectTv(item({class: "text-sm"}), ["text-sm", "opacity-100"]);
    expectTv(list({className: "bg-blue-50"}), ["list-none", "bg-blue-50"]);
    // list
    expectTv(wrapper({class: "flex-row"}), ["flex", "flex-row"]);
    expectTv(wrapper({className: "flex-row"}), ["flex", "flex-row"]);
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
      slots: {
        base: "text-3xl font-bold underline",
        title: "text-2xl",
        item: "text-xl",
        list: "list-none",
        wrapper: "flex flex-col",
      },
      variants: {
        color: {
          primary: {
            base: "bg-blue-500",
          },
          secondary: {
            title: "text-white",
            item: "bg-purple-100",
            list: "bg-purple-200",
            wrapper: "bg-transparent",
          },
        },
        size: {
          xs: {
            base: "text-xs",
          },
          sm: {
            base: "text-sm",
          },
          md: {
            base: "text-md",
            title: "text-md",
          },
        },
        isDisabled: {
          true: {
            title: "opacity-50",
          },
          false: {
            item: "opacity-100",
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

    // base
    expectTv(base({class: "text-xl"}), ["text-xl", "font-bold", "underline"]);
    expectTv(base({className: "text-xl"}), ["text-xl", "font-bold", "underline"]);
    // title
    expectTv(
      title({
        class: "text-2xl",
      }),
      ["text-2xl", "text-white"],
    );
    expectTv(
      title({
        className: "text-2xl",
      }),
      ["text-2xl", "text-white"],
    );
    //item
    expectTv(
      item({
        class: "bg-purple-50",
      }),
      ["text-xl", "bg-purple-50", "opacity-100"],
    );
    expectTv(
      item({
        className: "bg-purple-50",
      }),
      ["text-xl", "bg-purple-50", "opacity-100"],
    );
    // list
    expectTv(
      list({
        class: "bg-purple-100",
      }),
      ["list-none", "bg-purple-100"],
    );
    expectTv(
      list({
        className: "bg-purple-100",
      }),
      ["list-none", "bg-purple-100"],
    );
    // wrapper
    expectTv(
      wrapper({
        class: "bg-purple-900 flex-row",
      }),
      ["flex", "bg-purple-900", "flex-row"],
    );
    expectTv(
      wrapper({
        className: "bg-purple-900 flex-row",
      }),
      ["flex", "bg-purple-900", "flex-row"],
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

  test("should support slot level variant overrides", () => {
    const menu = tv({
      base: "text-3xl",
      slots: {
        title: "text-2xl",
      },
      variants: {
        color: {
          primary: {
            base: "color--primary-base",
            title: "color--primary-title",
          },
          secondary: {
            base: "color--secondary-base",
            title: "color--secondary-title",
          },
        },
      },
      defaultVariants: {
        color: "primary",
      },
    });

    const {base, title} = menu();

    expectTv(base(), ["text-3xl", "color--primary-base"]);
    expectTv(title(), ["text-2xl", "color--primary-title"]);
    expectTv(base({color: "secondary"}), ["text-3xl", "color--secondary-base"]);
    expectTv(title({color: "secondary"}), ["text-2xl", "color--secondary-title"]);
  });

  test("should support slot level variant overrides - compoundSlots", () => {
    const menu = tv({
      base: "text-3xl",
      slots: {
        title: "text-2xl",
        subtitle: "text-xl",
      },
      variants: {
        color: {
          primary: {
            base: "color--primary-base",
            title: "color--primary-title",
            subtitle: "color--primary-subtitle",
          },
          secondary: {
            base: "color--secondary-base",
            title: "color--secondary-title",
            subtitle: "color--secondary-subtitle",
          },
        },
      },
      compoundSlots: [
        {
          slots: ["title", "subtitle"],
          color: "secondary",
          class: ["truncate"],
        },
      ],
      defaultVariants: {
        color: "primary",
      },
    });

    const {base, title, subtitle} = menu();

    expectTv(base(), ["text-3xl", "color--primary-base"]);
    expectTv(title(), ["text-2xl", "color--primary-title"]);
    expectTv(subtitle(), ["text-xl", "color--primary-subtitle"]);
    expectTv(base({color: "secondary"}), ["text-3xl", "color--secondary-base"]);
    expectTv(title({color: "secondary"}), ["text-2xl", "color--secondary-title", "truncate"]);
    expectTv(subtitle({color: "secondary"}), ["text-xl", "color--secondary-subtitle", "truncate"]);
  });

  test("should support slot level variant overrides - compoundVariants", () => {
    const menu = tv({
      base: "text-3xl",
      slots: {
        title: "text-2xl",
      },
      variants: {
        color: {
          primary: {
            base: "color--primary-base",
            title: "color--primary-title",
          },
          secondary: {
            base: "color--secondary-base",
            title: "color--secondary-title",
          },
        },
      },
      compoundVariants: [
        {
          color: "secondary",
          class: {
            title: "truncate",
          },
        },
      ],
      defaultVariants: {
        color: "primary",
      },
    });

    const {base, title} = menu();

    expectTv(base(), ["text-3xl", "color--primary-base"]);
    expectTv(title(), ["text-2xl", "color--primary-title"]);
    expectTv(base({color: "secondary"}), ["text-3xl", "color--secondary-base"]);
    expectTv(title({color: "secondary"}), ["text-2xl", "color--secondary-title", "truncate"]);
  });
});

describe("Tailwind Variants (TV) - Compound Slots", () => {
  test("should work with compound slots -- without variants", () => {
    const pagination = tv({
      slots: {
        base: "flex flex-wrap relative gap-1 max-w-fit",
        item: "",
        prev: "",
        next: "",
        cursor: ["absolute", "flex", "overflow-visible"],
      },
      compoundSlots: [
        {
          slots: ["item", "prev", "next"],
          class: ["flex", "flex-wrap", "truncate"],
        },
      ],
    });
    // with default values
    const {base, item, prev, next, cursor} = pagination();

    expectTv(base(), ["flex", "flex-wrap", "relative", "gap-1", "max-w-fit"]);
    expectTv(item(), ["flex", "flex-wrap", "truncate"]);
    expectTv(prev(), ["flex", "flex-wrap", "truncate"]);
    expectTv(next(), ["flex", "flex-wrap", "truncate"]);
    expectTv(cursor(), ["absolute", "flex", "overflow-visible"]);
  });

  test("should work with compound slots -- with a single variant -- defaultVariants", () => {
    const pagination = tv({
      slots: {
        base: "flex flex-wrap relative gap-1 max-w-fit",
        item: "",
        prev: "",
        next: "",
        cursor: ["absolute", "flex", "overflow-visible"],
      },
      variants: {
        size: {
          xs: {},
          sm: {},
          md: {},
          lg: {},
          xl: {},
        },
      },
      compoundSlots: [
        {
          slots: ["item", "prev", "next"],
          class: ["flex", "flex-wrap", "truncate"],
        },
        {
          slots: ["item", "prev", "next"],
          size: "xs",
          class: "w-7 h-7 text-xs",
        },
      ],
      defaultVariants: {
        size: "xs",
      },
    });
    // with default values
    const {base, item, prev, next, cursor} = pagination();

    expectTv(base(), ["flex", "flex-wrap", "relative", "gap-1", "max-w-fit"]);
    expectTv(item(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(prev(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(next(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(cursor(), ["absolute", "flex", "overflow-visible"]);
  });

  test("should work with compound slots -- with a single variant -- prop variant", () => {
    const pagination = tv({
      slots: {
        base: "flex flex-wrap relative gap-1 max-w-fit",
        item: "",
        prev: "",
        next: "",
        cursor: ["absolute", "flex", "overflow-visible"],
      },
      variants: {
        size: {
          xs: {},
          sm: {},
          md: {},
          lg: {},
          xl: {},
        },
      },
      compoundSlots: [
        {
          slots: ["item", "prev", "next"],
          class: ["flex", "flex-wrap", "truncate"],
        },
        {
          slots: ["item", "prev", "next"],
          size: "xs",
          class: "w-7 h-7 text-xs",
        },
      ],
      defaultVariants: {
        size: "sm",
      },
    });
    // with default values
    const {base, item, prev, next, cursor} = pagination({
      size: "xs",
    });

    expectTv(base(), ["flex", "flex-wrap", "relative", "gap-1", "max-w-fit"]);
    expectTv(item(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(prev(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(next(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(cursor(), ["absolute", "flex", "overflow-visible"]);
  });

  test("should work with compound slots -- with multiple variants -- defaultVariants", () => {
    const pagination = tv({
      slots: {
        base: "flex flex-wrap relative gap-1 max-w-fit",
        item: "",
        prev: "",
        next: "",
        cursor: ["absolute", "flex", "overflow-visible"],
      },
      variants: {
        size: {
          xs: {},
          sm: {},
          md: {},
          lg: {},
          xl: {},
        },
        color: {
          primary: {},
          secondary: {},
        },
        isBig: {
          true: {},
        },
      },
      compoundSlots: [
        {
          slots: ["item", "prev", "next"],
          class: ["flex", "flex-wrap", "truncate"],
        },
        {
          slots: ["item", "prev", "next"],
          size: "xs",
          color: "primary",
          isBig: false,
          class: "w-7 h-7 text-xs",
        },
      ],
      defaultVariants: {
        size: "xs",
        color: "primary",
        isBig: false,
      },
    });
    // with default values
    const {base, item, prev, next, cursor} = pagination();

    expectTv(base(), ["flex", "flex-wrap", "relative", "gap-1", "max-w-fit"]);
    expectTv(item(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(prev(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(next(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(cursor(), ["absolute", "flex", "overflow-visible"]);
  });

  test("should work with compound slots -- with multiple variants -- prop variants", () => {
    const pagination = tv({
      slots: {
        base: "flex flex-wrap relative gap-1 max-w-fit",
        item: "",
        prev: "",
        next: "",
        cursor: ["absolute", "flex", "overflow-visible"],
      },
      variants: {
        size: {
          xs: {},
          sm: {},
          md: {},
          lg: {},
          xl: {},
        },
        color: {
          primary: {},
          secondary: {},
        },
        isBig: {
          true: {},
        },
      },
      compoundSlots: [
        {
          slots: ["item", "prev", "next"],
          class: ["flex", "flex-wrap", "truncate"],
        },
        {
          slots: ["item", "prev", "next"],
          size: "xs",
          color: "primary",
          isBig: true,
          class: "w-7 h-7 text-xs",
        },
      ],
      defaultVariants: {
        size: "sm",
        color: "secondary",
        isBig: false,
      },
    });
    // with default values
    const {base, item, prev, next, cursor} = pagination({
      size: "xs",
      color: "primary",
      isBig: true,
    });

    expectTv(base(), ["flex", "flex-wrap", "relative", "gap-1", "max-w-fit"]);
    expectTv(item(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(prev(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(next(), ["flex", "flex-wrap", "truncate", "w-7", "h-7", "text-xs"]);
    expectTv(cursor(), ["absolute", "flex", "overflow-visible"]);
  });
});

describe("Tailwind Variants (TV) - Screen Variants", () => {
  test("should work with screenVariants/initial screen", () => {
    const button = tv(
      {
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
      },
      {
        responsiveVariants: ["sm", "md"],
      },
    );

    const result = button({
      color: {
        initial: "primary",
        sm: "danger",
        md: "success",
      },
    });

    const expectedResult = [
      "text-xs",
      "font-bold",
      "text-blue-500",
      "sm:text-red-500",
      "md:text-green-500",
    ];

    expectTv(result, expectedResult);
  });

  test("the screenVariants/initial should override the defaultVariants", () => {
    const button = tv(
      {
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
      },
      {
        responsiveVariants: ["md"],
      },
    );

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
    const button = tv(
      {
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
      },
      {
        responsiveVariants: ["sm", "md", "lg"],
      },
    );

    const result = button({
      color: {
        initial: "primary",
        sm: "success",
        md: "secondary",
        lg: "danger",
      },
      size: {
        initial: "medium",
        sm: "mini",
        md: "small",
        lg: "medium",
      },
      variant: {
        initial: "solid",
        sm: "outline",
        md: "outline",
        lg: "solid",
      },
    });

    const expectedResult = [
      "base--styles",
      "color--primary",
      "sm:color--success",
      "md:color--secondary",
      "lg:color--danger",
      "size--medium",
      "sm:size--mini",
      "md:size--small",
      "lg:size--medium",
      "variant--solid",
      "sm:variant--outline",
      "md:variant--outline",
      "lg:variant--solid",
    ];

    expectTv(result, expectedResult);
  });

  test("should work with multiple screenVariants multiple values (strings)", () => {
    const button = tv(
      {
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
      },
      {
        responsiveVariants: ["sm", "md", "lg"],
      },
    );

    const result = button({
      color: {
        initial: "primary",
        sm: "success",
        md: "secondary",
        lg: "danger",
      },
      size: {
        initial: "medium",
        sm: "mini",
        md: "small",
        lg: "medium",
      },
      variant: {
        initial: "solid",
        sm: "outline",
        md: "outline",
        lg: "solid",
      },
    });

    const expectedResult = [
      "base--styles",
      "color--primary-1",
      "color--primary-2",
      "color--primary-3",
      "sm:color--success-1",
      "sm:color--success-2",
      "sm:color--success-3",
      "md:color--secondary-1",
      "md:color--secondary-2",
      "md:color--secondary-3",
      "lg:color--danger",
      "lg:color--danger-2",
      "lg:color--danger-3",
      "size--medium-1",
      "size--medium-2",
      "size--medium-3",
      "sm:size--mini-1",
      "sm:size--mini-2",
      "sm:size--mini-3",
      "md:size--small-1",
      "md:size--small-2",
      "md:size--small-3",
      "lg:size--medium-1",
      "lg:size--medium-2",
      "lg:size--medium-3",
      "variant--solid-1",
      "variant--solid-2",
      "variant--solid-3",
      "sm:variant--outline-1",
      "sm:variant--outline-2",
      "sm:variant--outline-3",
      "md:variant--outline-1",
      "md:variant--outline-2",
      "md:variant--outline-3",
      "lg:variant--solid-1",
      "lg:variant--solid-2",
      "lg:variant--solid-3",
    ];

    expectTv(result, expectedResult);
  });

  test("should work with multiple screenVariants multiple values (array)", () => {
    const button = tv(
      {
        base: "base--styles",
        variants: {
          color: {
            primary: ["color--primary-1", "color--primary-2", "color--primary-3"],
            secondary: ["color--secondary-1", "color--secondary-2", "color--secondary-3"],
            success: ["color--success-1", "color--success-2", "color--success-3"],
            danger: ["color--danger-1", "color--danger-2", "color--danger-3"],
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
      },
      {
        responsiveVariants: ["sm", "md", "lg"],
      },
    );

    const result = button({
      color: {
        initial: "primary",
        sm: "success",
        md: "secondary",
        lg: "danger",
      },
      size: {
        initial: "medium",
        sm: "mini",
        md: "small",
        lg: "medium",
      },
      variant: {
        initial: "solid",
        sm: "outline",
        md: "outline",
        lg: "solid",
      },
    });

    const expectedResult = [
      "base--styles",
      "color--primary-1",
      "color--primary-2",
      "color--primary-3",
      "sm:color--success-1",
      "sm:color--success-2",
      "sm:color--success-3",
      "md:color--secondary-1",
      "md:color--secondary-2",
      "md:color--secondary-3",
      "lg:color--danger-1",
      "lg:color--danger-2",
      "lg:color--danger-3",
      "size--medium-1",
      "size--medium-2",
      "size--medium-3",
      "sm:size--mini-1",
      "sm:size--mini-2",
      "sm:size--mini-3",
      "md:size--small-1",
      "md:size--small-2",
      "md:size--small-3",
      "lg:size--medium-1",
      "lg:size--medium-2",
      "lg:size--medium-3",
      "variant--solid-1",
      "variant--solid-2",
      "variant--solid-3",
      "sm:variant--outline-1",
      "sm:variant--outline-2",
      "sm:variant--outline-3",
      "md:variant--outline-1",
      "md:variant--outline-2",
      "md:variant--outline-3",
      "lg:variant--solid-1",
      "lg:variant--solid-2",
      "lg:variant--solid-3",
    ];

    expectTv(result, expectedResult);
  });

  test("should work with multiple screenVariants single values and slots", () => {
    const menu = tv(
      {
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
      },
      {
        responsiveVariants: ["sm", "md", "lg"],
      },
    );

    const {base, title, item, list, wrapper} = menu({
      color: {
        initial: "primary",
        sm: "secondary",
        md: "primary",
        lg: "secondary",
      },
      size: {
        initial: "medium",
        sm: "small",
        md: "medium",
        lg: "medium",
      },
    });

    expectTv(base(), ["base--styles"]);
    expectTv(title(), [
      "slots--title",
      "sm:title--color--secondary",
      "md:title--color--primary",
      "lg:title--color--secondary",
      "title--color--primary",
      "sm:title--size--small",
      "md:title--size--medium",
      "lg:title--size--medium",
      "title--size--medium",
    ]);
    expectTv(item(), [
      "slots--item",
      "sm:item--color--secondary",
      "md:item--color--primary",
      "lg:item--color--secondary",
      "item--color--primary",
      "sm:item--size--small",
      "md:item--size--medium",
      "lg:item--size--medium",
      "item--size--medium",
    ]);
    expectTv(list(), [
      "slots--list",
      "sm:list--color--secondary",
      "md:list--color--primary",
      "lg:list--color--secondary",
      "list--color--primary",
      "sm:list--size--small",
      "md:list--size--medium",
      "lg:list--size--medium",
      "list--size--medium",
    ]);
    expectTv(wrapper(), [
      "slots--wrapper",
      "sm:wrapper--color--secondary",
      "md:wrapper--color--primary",
      "lg:wrapper--color--secondary",
      "wrapper--color--primary",
      "sm:wrapper--size--small",
      "md:wrapper--size--medium",
      "lg:wrapper--size--medium",
      "wrapper--size--medium",
    ]);
  });

  test("should not include a variant if it is not defined in the responsiveVariants key", () => {
    const menu = tv(
      {
        base: "base--styles",
        variants: {
          color: {
            primary: "primary--color--variant",
            secondary: "secondary--color--variant",
            success: "success--color--variant",
          },
          size: {
            small: "small--size--variant",
            medium: "medium--size--variant",
          },
        },
      },
      {
        responsiveVariants: ["sm", "md", "lg"],
      },
    );

    const styles = menu({
      color: {
        initial: "primary",
        sm: "secondary",
        md: "primary",
        lg: "secondary",
        // @ts-ignore
        xl: "success",
      },
      size: {
        initial: "medium",
        sm: "small",
        md: "medium",
        lg: "medium",
      },
    });

    expect(styles).not.toContain("xl:success--color--variant");
  });
});

describe("Tailwind Variants (TV) - Extends", () => {
  test("should include the extended classes", () => {
    const p = tv({
      base: "text-base text-green-500",
    });

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
    });

    const result = h1();
    const expectedResult = ["text-3xl", "font-bold", "text-green-500"];

    expectTv(result, expectedResult);
  });

  test("should include the extended classes with variants", () => {
    const p = tv({
      base: "p--base text-base text-green-500",
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

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          purple: "text-purple-500",
          green: "text-green-500",
        },
      },
    });

    const result = h1({
      isBig: true,
      color: "red",
    });

    const expectedResult = ["font-bold", "text-red-500", "text-5xl", "p--base"];

    expectTv(result, expectedResult);
  });

  test("should include nested the extended classes", () => {
    const base = tv({
      base: "text-base",
      variants: {
        color: {
          red: "color--red",
        },
      },
    });

    const p = tv({
      extend: base,
      base: "text-green-500",
      variants: {
        color: {
          blue: "color--blue",
          yellow: "color--yellow",
        },
      },
    });

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          green: "color--green",
        },
      },
    });

    const result = h1({
      // @ts-ignore TODO: should have the grand parent variants
      color: "red",
    });

    const expectedResult = ["text-3xl", "font-bold", "text-green-500", "color--red"];

    expectTv(result, expectedResult);

    const result2 = h1({
      color: "blue",
    });

    const expectedResult2 = ["text-3xl", "font-bold", "text-green-500", "color--blue"];

    expectTv(result2, expectedResult2);

    const result3 = h1({
      color: "green",
    });

    const expectedResult3 = ["text-3xl", "font-bold", "text-green-500", "color--green"];

    expectTv(result3, expectedResult3);
  });

  test("should override the extended classes with variants", () => {
    const p = tv({
      base: "text-base text-green-500",
      variants: {
        isBig: {
          true: "text-5xl",
          false: "text-2xl",
        },
        color: {
          red: "text-red-500 bg-red-100",
          blue: "text-blue-500",
        },
      },
    });

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          red: "text-red-200",
          green: "text-green-500",
        },
      },
    });

    const result = h1({
      isBig: true,
      color: "red",
    });

    const expectedResult = ["font-bold", "text-red-200", "bg-red-100", "text-5xl"];

    expectTv(result, expectedResult);
  });

  test("should include the extended classes with defaultVariants - parent", () => {
    const p = tv({
      base: "text-base text-green-500",
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
      defaultVariants: {
        isBig: true,
        color: "red",
      },
    });

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          purple: "text-purple-500",
          green: "text-green-500",
        },
      },
    });

    const result = h1();

    const expectedResult = ["font-bold", "text-red-500", "text-5xl"];

    expectTv(result, expectedResult);
  });

  test("should include the extended classes with defaultVariants - children", () => {
    const p = tv({
      base: "text-base text-green-500",
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

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          purple: "text-purple-500",
          green: "text-green-500",
        },
      },
      defaultVariants: {
        isBig: true,
        color: "red",
      },
    });

    const result = h1();

    const expectedResult = ["font-bold", "text-red-500", "text-5xl"];

    expectTv(result, expectedResult);
  });

  test("should override the extended defaultVariants - children", () => {
    const p = tv({
      base: "text-base text-green-500",
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
      defaultVariants: {
        isBig: true,
        color: "blue",
      },
    });

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          purple: "text-purple-500",
          green: "text-green-500",
        },
      },
      defaultVariants: {
        isBig: false,
        color: "red",
      },
    });

    const result = h1();

    const expectedResult = ["font-bold", "text-red-500", "text-2xl"];

    expectTv(result, expectedResult);
  });

  test("should include the extended classes with compoundVariants - parent", () => {
    const p = tv({
      base: "text-base text-green-500",
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
      defaultVariants: {
        isBig: true,
        color: "red",
      },
      compoundVariants: [
        {
          isBig: true,
          color: "red",
          class: "bg-red-500",
        },
      ],
    });

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          purple: "text-purple-500",
          green: "text-green-500",
        },
      },
    });

    const result = h1();

    const expectedResult = ["font-bold", "text-red-500", "bg-red-500", "text-5xl"];

    expectTv(result, expectedResult);
  });

  test("should include the extended classes with compoundVariants - children", () => {
    const p = tv({
      base: "text-base text-green-500",
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
      defaultVariants: {
        isBig: true,
        color: "red",
      },
    });

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          purple: "text-purple-500",
          green: "text-green-500",
        },
      },
      defaultVariants: {
        color: "green",
      },
      compoundVariants: [
        {
          isBig: true,
          color: "green",
          class: "bg-green-500",
        },
      ],
    });

    const result = h1();

    const expectedResult = ["font-bold", "bg-green-500", "text-green-500", "text-5xl"];

    expectTv(result, expectedResult);
  });

  test("should override the extended classes with compoundVariants - children", () => {
    const p = tv({
      base: "text-base text-green-500",
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
      defaultVariants: {
        isBig: true,
        color: "red",
      },
      compoundVariants: [
        {
          isBig: true,
          color: "red",
          class: "bg-red-500",
        },
      ],
    });

    const h1 = tv({
      extend: p,
      base: "text-3xl font-bold",
      variants: {
        color: {
          purple: "text-purple-500",
          green: "text-green-500",
        },
      },
      compoundVariants: [
        {
          isBig: true,
          color: "red",
          class: "bg-red-600",
        },
      ],
    });

    const result = h1();

    const expectedResult = ["font-bold", "bg-red-600", "text-red-500", "text-5xl"];

    expectTv(result, expectedResult);
  });

  test("should include the extended classes with screenVariants single values", () => {
    const p = tv({
      base: "text-base text-green-500",
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

    const h1 = tv(
      {
        extend: p,
        base: "text-3xl font-bold",
        variants: {
          color: {
            purple: "text-purple-500",
            green: "text-green-500",
          },
        },
      },
      {
        responsiveVariants: ["sm", "md", "lg", "xl"],
      },
    );

    const result = h1({
      isBig: true,
      color: {
        sm: "blue",
        md: "red",
        lg: "purple",
        xl: "green",
      },
    });

    const expectedResult = [
      "font-bold",
      "lg:text-purple-500",
      "xl:text-green-500",
      "text-5xl",
      "sm:text-blue-500",
      "md:text-red-500",
    ];

    expectTv(result, expectedResult);
  });

  test("should include the extended classes with screenVariants multiple values", () => {
    const p = tv({
      base: "text-base text-green-500",
      variants: {
        isBig: {
          true: "text-5xl",
          false: "text-2xl",
        },
        color: {
          red: "text-red-500 bg-red-500",
          blue: "text-blue-500 bg-blue-500",
        },
      },
    });

    const h1 = tv(
      {
        extend: p,
        base: "text-3xl font-bold",
        variants: {
          color: {
            purple: "text-purple-500 bg-purple-500",
            green: "text-green-500 bg-green-500",
          },
        },
      },
      {
        responsiveVariants: ["sm", "md", "lg", "xl"],
      },
    );

    const result = h1({
      isBig: true,
      color: {
        sm: "blue",
        md: "red",
        lg: "purple",
        xl: "green",
      },
    });

    const expectedResult = [
      "font-bold",
      "lg:text-purple-500",
      "lg:bg-purple-500",
      "xl:text-green-500",
      "xl:bg-green-500",
      "text-5xl",
      "sm:text-blue-500",
      "sm:bg-blue-500",
      "md:text-red-500",
      "md:bg-red-500",
    ];

    expectTv(result, expectedResult);
  });

  test("should include the extended slots w/o children slots", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
    });

    // with default values
    const {base, title, item, list, wrapper} = menu();

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), ["title--menuBase"]);
    expectTv(item(), ["item--menuBase"]);
    expectTv(list(), ["list--menuBase"]);
    expectTv(wrapper(), ["wrapper--menuBase"]);
  });

  test("should include the extended slots w/ variants -- parent", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
      variants: {
        isBig: {
          true: {
            title: "title--isBig--menu",
            item: "item--isBig--menu",
            list: "list--isBig--menu",
            wrapper: "wrapper--isBig--menu",
          },
          false: "isBig--menu",
        },
      },
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
    });

    const {base, title, item, list, wrapper} = menu({
      isBig: true,
    });

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), ["title--menuBase", "title--isBig--menu"]);
    expectTv(item(), ["item--menuBase", "item--isBig--menu"]);
    expectTv(list(), ["list--menuBase", "list--isBig--menu"]);
    expectTv(wrapper(), ["wrapper--menuBase", "wrapper--isBig--menu"]);
  });

  test("should include the extended slots w/ variants -- children", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
      variants: {
        isBig: {
          true: {
            title: "title--isBig--menu",
            item: "item--isBig--menu",
            list: "list--isBig--menu",
            wrapper: "wrapper--isBig--menu",
          },
          false: "isBig--menu",
        },
      },
    });

    const {base, title, item, list, wrapper} = menu({
      isBig: true,
    });

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), ["title--menuBase", "title--isBig--menu"]);
    expectTv(item(), ["item--menuBase", "item--isBig--menu"]);
    expectTv(list(), ["list--menuBase", "list--isBig--menu"]);
    expectTv(wrapper(), ["wrapper--menuBase", "wrapper--isBig--menu"]);
  });

  test("should include the extended slots w/ children slots (same names)", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
      slots: {
        title: "title--menu",
        item: "item--menu",
        list: "list--menu",
        wrapper: "wrapper--menu",
      },
    });

    // with default values
    const {base, title, item, list, wrapper} = menu();

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), ["title--menuBase", "title--menu"]);
    expectTv(item(), ["item--menuBase", "item--menu"]);
    expectTv(list(), ["list--menuBase", "list--menu"]);
    expectTv(wrapper(), ["wrapper--menuBase", "wrapper--menu"]);
  });

  test("should include the extended slots w/ children slots (additional)", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
      slots: {
        title: "title--menu",
        item: "item--menu",
        list: "list--menu",
        wrapper: "wrapper--menu",
        extra: "extra--menu",
      },
    });

    // with default values
    const {base, title, item, list, wrapper, extra} = menu();

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), ["title--menuBase", "title--menu"]);
    expectTv(item(), ["item--menuBase", "item--menu"]);
    expectTv(list(), ["list--menuBase", "list--menu"]);
    expectTv(wrapper(), ["wrapper--menuBase", "wrapper--menu"]);
    expectTv(extra(), ["extra--menu"]);
  });

  test("should include the extended variants w/slots and defaultVariants -- parent", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
      variants: {
        isBig: {
          true: {
            title: "isBig--title--menuBase",
            item: "isBig--item--menuBase",
            list: "isBig--list--menuBase",
            wrapper: "isBig--wrapper--menuBase",
          },
        },
      },
      defaultVariants: {
        isBig: true,
      },
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
      slots: {
        title: "title--menu",
        item: "item--menu",
        list: "list--menu",
        wrapper: "wrapper--menu",
      },
    });

    // with default values
    const {base, title, item, list, wrapper} = menu();

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), ["title--menuBase", "title--menu", "isBig--title--menuBase"]);
    expectTv(item(), ["item--menuBase", "item--menu", "isBig--item--menuBase"]);
    expectTv(list(), ["list--menuBase", "list--menu", "isBig--list--menuBase"]);
    expectTv(wrapper(), ["wrapper--menuBase", "wrapper--menu", "isBig--wrapper--menuBase"]);
  });

  test("should include the extended variants w/slots and defaultVariants -- children", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
      variants: {
        isBig: {
          true: {
            title: "isBig--title--menuBase",
            item: "isBig--item--menuBase",
            list: "isBig--list--menuBase",
            wrapper: "isBig--wrapper--menuBase",
          },
        },
      },
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
      slots: {
        title: "title--menu",
        item: "item--menu",
        list: "list--menu",
        wrapper: "wrapper--menu",
      },
      defaultVariants: {
        isBig: true,
      },
    });

    // with default values
    const {base, title, item, list, wrapper} = menu();

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), ["title--menuBase", "title--menu", "isBig--title--menuBase"]);
    expectTv(item(), ["item--menuBase", "item--menu", "isBig--item--menuBase"]);
    expectTv(list(), ["list--menuBase", "list--menu", "isBig--list--menuBase"]);
    expectTv(wrapper(), ["wrapper--menuBase", "wrapper--menu", "isBig--wrapper--menuBase"]);
  });

  test("should include the extended variants w/slots and compoundVariants -- parent", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
      variants: {
        color: {
          red: {
            title: "color--red--title--menuBase",
            item: "color--red--item--menuBase",
            list: "color--red--list--menuBase",
            wrapper: "color--red--wrapper--menuBase",
          },
          blue: {
            title: "color--blue--title--menuBase",
            item: "color--blue--item--menuBase",
            list: "color--blue--list--menuBase",
            wrapper: "color--blue--wrapper--menuBase",
          },
        },
        isBig: {
          true: {
            title: "isBig--title--menuBase",
            item: "isBig--item--menuBase",
            list: "isBig--list--menuBase",
            wrapper: "isBig--wrapper--menuBase",
          },
        },
      },
      defaultVariants: {
        isBig: true,
        color: "blue",
      },
      compoundVariants: [
        {
          color: "red",
          isBig: true,
          class: {
            title: "color--red--isBig--title--menuBase",
            item: "color--red--isBig--item--menuBase",
            list: "color--red--isBig--list--menuBase",
            wrapper: "color--red--isBig--wrapper--menuBase",
          },
        },
      ],
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
      slots: {
        title: "title--menu",
        item: "item--menu",
        list: "list--menu",
        wrapper: "wrapper--menu",
      },
    });

    // with default values
    const {base, title, item, list, wrapper} = menu({
      color: "red",
    });

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), [
      "title--menuBase",
      "title--menu",
      "isBig--title--menuBase",
      "color--red--title--menuBase",
      "color--red--isBig--title--menuBase",
    ]);
    expectTv(item(), [
      "item--menuBase",
      "item--menu",
      "isBig--item--menuBase",
      "color--red--item--menuBase",
      "color--red--isBig--item--menuBase",
    ]);
    expectTv(list(), [
      "list--menuBase",
      "list--menu",
      "isBig--list--menuBase",
      "color--red--list--menuBase",
      "color--red--isBig--list--menuBase",
    ]);
    expectTv(wrapper(), [
      "wrapper--menuBase",
      "wrapper--menu",
      "isBig--wrapper--menuBase",
      "color--red--wrapper--menuBase",
      "color--red--isBig--wrapper--menuBase",
    ]);
  });

  test("should include the extended variants w/slots and compoundVariants -- children", () => {
    const menuBase = tv({
      base: "base--menuBase",
      slots: {
        title: "title--menuBase",
        item: "item--menuBase",
        list: "list--menuBase",
        wrapper: "wrapper--menuBase",
      },
      variants: {
        color: {
          red: {
            title: "color--red--title--menuBase",
            item: "color--red--item--menuBase",
            list: "color--red--list--menuBase",
            wrapper: "color--red--wrapper--menuBase",
          },
          blue: {
            title: "color--blue--title--menuBase",
            item: "color--blue--item--menuBase",
            list: "color--blue--list--menuBase",
            wrapper: "color--blue--wrapper--menuBase",
          },
        },
        isBig: {
          true: {
            title: "isBig--title--menuBase",
            item: "isBig--item--menuBase",
            list: "isBig--list--menuBase",
            wrapper: "isBig--wrapper--menuBase",
          },
        },
      },
      defaultVariants: {
        isBig: true,
        color: "blue",
      },
    });

    const menu = tv({
      extend: menuBase,
      base: "base--menu",
      slots: {
        title: "title--menu",
        item: "item--menu",
        list: "list--menu",
        wrapper: "wrapper--menu",
      },
      compoundVariants: [
        {
          color: "red",
          isBig: true,
          class: {
            title: "color--red--isBig--title--menuBase",
            item: "color--red--isBig--item--menuBase",
            list: "color--red--isBig--list--menuBase",
            wrapper: "color--red--isBig--wrapper--menuBase",
          },
        },
      ],
    });

    // with default values
    const {base, title, item, list, wrapper} = menu({
      color: "red",
    });

    expectTv(base(), ["base--menuBase", "base--menu"]);
    expectTv(title(), [
      "title--menuBase",
      "title--menu",
      "isBig--title--menuBase",
      "color--red--title--menuBase",
      "color--red--isBig--title--menuBase",
    ]);
    expectTv(item(), [
      "item--menuBase",
      "item--menu",
      "isBig--item--menuBase",
      "color--red--item--menuBase",
      "color--red--isBig--item--menuBase",
    ]);
    expectTv(list(), [
      "list--menuBase",
      "list--menu",
      "isBig--list--menuBase",
      "color--red--list--menuBase",
      "color--red--isBig--list--menuBase",
    ]);
    expectTv(wrapper(), [
      "wrapper--menuBase",
      "wrapper--menu",
      "isBig--wrapper--menuBase",
      "color--red--wrapper--menuBase",
      "color--red--isBig--wrapper--menuBase",
    ]);
  });

  test("should work with cn", () => {
    const tvResult = ["w-fit", "h-fit"];
    const custom = ["w-full"];

    const resultWithoutMerge = cn(tvResult.concat(custom))({twMerge: false});
    const resultWithMerge = cn(tvResult.concat(custom))({twMerge: true});
    const emptyResultWithoutMerge = cn([].concat([]))({twMerge: false});
    const emptyResultWithMerge = cn([].concat([]))({twMerge: true});

    expect(resultWithoutMerge).toBe("w-fit h-fit w-full");
    expect(resultWithMerge).toBe("h-fit w-full");
    expect(emptyResultWithoutMerge).toBe(undefined);
    expect(emptyResultWithMerge).toBe(undefined);
  });
});

describe("Tailwind Variants (TV) - Tailwind Merge", () => {
  it("should merge the tailwind classes correctly", () => {
    const styles = tv({
      base: "text-base text-yellow-400",
      variants: {
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
      },
    });

    const result = styles({
      color: "red",
    });

    expectTv(result, ["text-base", "text-red-500"]);
  });

  it("should support custom config", () => {
    const styles = tv(
      {
        base: "text-small text-yellow-400 w-unit",
        variants: {
          size: {
            small: "text-small w-unit-2",
            medium: "text-medium w-unit-4",
            large: "text-large w-unit-6",
          },
          color: {
            red: "text-red-500",
            blue: "text-blue-500",
          },
        },
      },
      {
        twMergeConfig,
      },
    );

    const result = styles({
      size: "medium",
      color: "blue",
    });

    expectTv(result, ["text-medium", "text-blue-500", "w-unit-4"]);
  });
});
