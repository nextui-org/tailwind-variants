import {expect, describe, test} from "@jest/globals";

import {createTV} from "../index";

describe("createTV", () => {
  test("should use config in tv calls", () => {
    const tv = createTV({twMerge: false});
    const h1 = tv({base: "text-3xl font-bold text-blue-400 text-xl text-blue-200"});

    expect(h1()).toHaveClass("text-3xl font-bold text-blue-400 text-xl text-blue-200");
  });

  test("should override config", () => {
    const tv = createTV({twMerge: false});
    const h1 = tv(
      {base: "text-3xl font-bold text-blue-400 text-xl text-blue-200"},
      {twMerge: true},
    );

    expect(h1()).toHaveClass("font-bold text-xl text-blue-200");
  });
});

describe("CreateTV - ResponsiveVariants", () => {
  test("should work with multiple screenVariants single values", () => {
    const tv = createTV({
      responsiveVariants: ["sm", "md", "lg"],
    });
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

    expect(result).toHaveClass(expectedResult);
  });

  test("should work with multiple screenVariants multiple values (strings)", () => {
    const tv = createTV({
      responsiveVariants: ["sm", "md", "lg"],
    });

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

    expect(result).toHaveClass(expectedResult);
  });

  test("should work with multiple screenVariants multiple values (array)", () => {
    const tv = createTV({
      responsiveVariants: ["sm", "md", "lg"],
    });

    const button = tv({
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
    });

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

    expect(result).toHaveClass(expectedResult);
  });

  test("should work with multiple screenVariants single values and slots", () => {
    const tv = createTV({
      responsiveVariants: ["sm", "md", "lg"],
    });
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

    expect(base()).toHaveClass(["base--styles"]);
    expect(title()).toHaveClass([
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
    expect(item()).toHaveClass([
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
    expect(list()).toHaveClass([
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
    expect(wrapper()).toHaveClass([
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
    const tv = createTV({
      responsiveVariants: ["sm", "md", "lg"],
    });

    const menu = tv({
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
    });

    const styles = menu({
      color: {
        initial: "primary",
        sm: "secondary",
        md: "primary",
        lg: "secondary",
        // @ts-expect-error `xl` is not a valid screen variant
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
