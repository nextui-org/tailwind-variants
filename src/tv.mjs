import {cx as cxBase} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

import {cleanArray, falsyToString} from "./utils.mjs";

const cx =
  (...classes) =>
  (config = {}) =>
    config.merge ? twMerge(cxBase(classes)) : cxBase(classes);

export const tv =
  (
    styles,
    config = {
      merge: true,
    },
  ) =>
  (props) => {
    if (styles?.variants == null) {
      return cx(styles?.base, props?.class, props?.className)(config);
    }

    const {variants, defaultVariants, slots: slotsProp = []} = styles;

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
      }, {});

    const getCompoundVariantClassNames = styles?.compoundVariants?.reduce(
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

    const getCompoundVariantClassNamesByPart = () => {
      const compoundClassNames = cleanArray(getCompoundVariantClassNames);

      if (!Array.isArray(compoundClassNames)) {
        return compoundClassNames;
      }

      return compoundClassNames.reduce((acc, className) => {
        if (typeof className === "string") {
          acc.base = cx(acc.base, className)(config);
        }

        if (typeof className === "object") {
          Object.entries(className).forEach(([part, className]) => {
            acc[part] = cx(acc[part], className)(config);
          });
        }

        return acc;
      }, {});
    };

    // slots variants - slots.length > 1 because base is always included
    if (slots.length > 1) {
      const baseClassNames = getVariantClassNamesByPart("base");
      const compoundClassNames = getCompoundVariantClassNamesByPart();

      const slotsFns = slots.slice(1).reduce((acc, part) => {
        acc[part] = (partProps) =>
          cx(
            getVariantClassNamesByPart(part),
            compoundClassNames[part],
            partProps?.class,
            partProps?.className,
          )(config);

        return acc;
      }, {});

      return {
        base: (partProps) =>
          cx(
            styles?.base,
            baseClassNames,
            compoundClassNames["base"],
            partProps?.class,
            partProps?.className,
          )(config),
        ...slotsFns,
      };
    }

    // normal variants
    return cx(
      styles?.base,
      getVariantClassNames,
      getCompoundVariantClassNames,
      props?.class,
      props?.className,
    )(config);
  };

const menuRoot = tv(
  {
    base: "base-styles",
    slots: ["trigger", "menu", "item"],
    variants: {
      normal: {
        true: "variants-normal-true",
        false: "variants-normal-false",
      },
      color: {
        primary: {
          base: "variants-color-primary-base",
          trigger: "variants-color-primary-trigger",
          menu: "variants-color-primary-menu",
          item: "variants-color-primary-item",
        },
        secondary: "variants-color-secondary",
      },
      size: {
        small: "variants-size-small",
        medium: "variants-size-medium",
      },
    },
    compoundVariants: [
      {
        normal: true,
        color: "primary",
        class: "compound-normal-primary",
      },
      {
        color: "primary",
        size: "medium",
        class: {
          base: "compound-primary-medium-base",
          trigger: "compound-primary-medium-trigger",
          menu: "compound-primary-medium-menu",
          item: "compound-primary-medium-item",
        },
      },
      {
        color: "secondary",
        size: "small",
        className: {
          base: "compound-secondary-small-base",
          trigger: "compound-secondary-small-trigger",
          menu: "compound-secondary-small-menu",
          item: "compound-secondary-small-item",
        },
      },
    ],
    defaultVariants: {
      color: "primary",
      size: "medium",
    },
  },
  // config
  {
    merge: true,
  },
);

const menuWithoutSlots = tv({
  base: "font-bold",
  variants: {
    normal: {
      true: "variants-normal-true",
      false: "variants-normal-false",
    },
    color: {
      primary: "color-primary-base",
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
      class: "compound-primary-medium",
    },
    {
      color: "secondary",
      size: "small",
      class: "compound-secondary-small",
    },
    {
      normal: true,
      size: "medium",
      class: "compound-normal-medium",
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

console.log("--------------------");

const menuWoSlots = menuWithoutSlots({normal: true});

console.log("menuWoSlots ---->", menuWoSlots);
