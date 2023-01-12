import {cx} from "class-variance-authority";

import {cleanArray, falsyToString} from "./utils.mjs";

export const tv = (config) => (props) => {
  if (config?.variants == null) {
    return cx(config?.base, props?.class, props?.className);
  }

  const {variants, defaultVariants, slots: slotsProp = []} = config;

  const slots = Array.isArray(slotsProp)
    ? ["base", ...slotsProp.filter((part) => part !== "base")]
    : [];

  const getVariantValue = (variant) => {
    const variantProp = props?.[variant];
    const defaultVariantProp = defaultVariants?.[variant];

    if (variantProp === null) return null;

    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);

    return variants[variant][variantKey];
  };

  const getVariantClassNames = Object.keys(variants).map(getVariantValue);

  const getVariantClassNamesByPart = (part) =>
    cleanArray(
      Object.keys(variants).map((variant) => {
        const variantValue = getVariantValue(variant);

        if (typeof variantValue === "object") {
          return variantValue[part];
        }

        return null;
      }),
    );

  const propsWithoutUndefined =
    props &&
    Object.entries(props).reduce((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }

      acc[key] = value;

      return acc;
    });

  const getCompoundVariantClassNames = config?.compoundVariants?.reduce(
    (acc, {class: tvClass, className: tvClassName, ...compoundVariantOptions}) =>
      Object.entries(compoundVariantOptions).every(([key, value]) =>
        Array.isArray(value)
          ? value.includes(
              {
                ...defaultVariants,
                ...propsWithoutUndefined,
              }[key],
            )
          : {
              ...defaultVariants,
              ...propsWithoutUndefined,
            }[key] === value,
      )
        ? [...acc, tvClass, tvClassName]
        : acc,
    [],
  );

  const getCompoundVariantClassNamesByPart = (part) => {};

  // slots variants - slots.length > 1 because base is always included
  if (slots.length > 1) {
    const baseClassNames = getVariantClassNamesByPart("base");

    const slotsFns = slots.slice(1).reduce((acc, part) => {
      acc[part] = (partProps) =>
        cx(getVariantClassNamesByPart(part), partProps?.class, partProps?.className);

      return acc;
    }, {});

    return {
      base: (partProps) => cx(config?.base, baseClassNames, partProps?.class, partProps?.className),
      ...slotsFns,
    };
  }

  // normal variants
  return cx(
    config?.base,
    getVariantClassNames,
    getCompoundVariantClassNames,
    props?.class,
    props?.className,
  );
};

const menuRoot = tv({
  base: "font-bold",
  slots: ["trigger", "menu", "item"],
  variants: {
    normal: {
      true: "variants-normal-true",
      false: "variants-normal-false",
    },
    color: {
      primary: {
        base: "color-primary-base",
        trigger: "color-primary-trigger",
        menu: "color-primary-menu",
        item: "color-primary-item",
      },
      secondary: "color-secondary",
    },
    size: {
      small: "size-small",
      medium: "size-medium",
    },
  },
  compoundVariants: [
    {
      color: "primary",
      size: "medium",
      class: {
        base: "uppercase",
        trigger: "bold",
        menu: "shadow",
        item: "text-center",
      },
    },
    {
      color: "secondary",
      size: "small",
      className: {
        base: "menu-secondary-small",
        trigger: "menu-secondary-small-trigger",
        menu: "menu-secondary-small-menu",
        item: "menu-secondary-small-item",
      },
    },
  ],
  defaultVariants: {
    color: "primary",
    size: "medium",
  },
});

// console.log(menuRoot({normal: true}));

const {base, trigger, menu, item} = menuRoot({normal: true});

console.log("base ---->", base());
console.log("trigger ---->", trigger());
console.log("menu ---->", menu());
console.log("item ---->", item());
