import {cx, cleanArray, falsyToString} from "./utils.js";

export const tv =
  (
    styles,
    config = {
      twMerge: true,
      twMergeConfig: {},
    },
  ) =>
  (props) => {
    if (styles?.variants == null) {
      return cx(styles?.base, props?.class, props?.className)(config);
    }

    const {slots: slotsProp = [], variants, defaultVariants} = styles;

    const slots = Array.isArray(slotsProp)
      ? new Set(["base", ...slotsProp.filter((slot) => slot !== "base")])
      : [];

    const getVariantValue = (variant) => {
      const variantProp = props?.[variant];
      const defaultVariantProp = defaultVariants?.[variant];

      if (variantProp === null) return null;

      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);

      return variants[variant][variantKey];
    };

    const getVariantClassNames = Object.keys(variants).map(getVariantValue);

    const getVariantClassNamesBySlot = (slot) =>
      cleanArray(
        Object.keys(variants).map((variant) => {
          const variantValue = getVariantValue(variant);

          if (!variantValue || typeof variantValue !== "object") {
            return null;
          }

          return variantValue[slot];
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

    const getCompoundVariantClassNamesBySlot = () => {
      const compoundClassNames = cleanArray(getCompoundVariantClassNames);

      if (!Array.isArray(compoundClassNames)) {
        return compoundClassNames;
      }

      return compoundClassNames.reduce((acc, className) => {
        if (typeof className === "string") {
          acc.base = cx(acc.base, className)(config);
        }

        if (typeof className === "object") {
          Object.entries(className).forEach(([slot, className]) => {
            acc[slot] = cx(acc[slot], className)(config);
          });
        }

        return acc;
      }, {});
    };

    // slots variants - slots.length > 1 because base is always included
    if (slots.length > 1) {
      const baseClassNames = getVariantClassNamesBySlot("base");
      const compoundClassNames = getCompoundVariantClassNamesBySlot();

      const slotsFns = slots.slice(1).reduce((acc, slot) => {
        acc[slot] = (slotProps) =>
          cx(
            getVariantClassNamesBySlot(slot),
            compoundClassNames[slot],
            slotProps?.class,
            slotProps?.className,
          )(config);

        return acc;
      }, {});

      return {
        base: (slotProps) =>
          cx(
            styles?.base,
            baseClassNames,
            compoundClassNames["base"],
            slotProps?.class,
            slotProps?.className,
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
