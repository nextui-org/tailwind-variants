import {cx, isNotEmptyObject, falsyToString} from "./utils.js";

export const tv =
  (
    options,
    config = {
      twMerge: true,
      twMergeConfig: {},
    },
  ) =>
  (props) => {
    const {
      slots: slotProps = {},
      variants = {},
      defaultVariants = {},
      compoundVariants = [],
    } = options;

    if (variants == null && !isNotEmptyObject(slotProps)) {
      return cx(options?.base, props?.class, props?.className)(config);
    }

    if (compoundVariants && !Array.isArray(compoundVariants)) {
      throw new TypeError(
        `The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`,
      );
    }

    // add "base" to the slots object
    const slots = {
      base: options?.base,
      ...slotProps,
    };

    const getVariantValue = (variant) => {
      const variantProp = props?.[variant];
      const defaultVariantProp = defaultVariants?.[variant];

      if (variantProp === null) return null;

      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);

      return variants[variant][variantKey];
    };

    const getVariantClassNames = variants ? Object.keys(variants).map(getVariantValue) : null;

    const getVariantClassNamesBySlotKey = (slotKey) => {
      if (!variants || typeof variants !== "object") {
        return null;
      }

      return Object.keys(variants).map((variant) => {
        const variantValue = getVariantValue(variant);

        if (slotKey === "base" && typeof variantValue === "string") {
          return variantValue;
        }

        if (!variantValue || typeof variantValue !== "object") {
          return null;
        }

        return variantValue[slotKey];
      });
    };

    const propsWithoutUndefined =
      props &&
      Object.entries(props).reduce((acc, [key, value]) => {
        if (value === undefined) {
          return acc;
        }

        acc[key] = value;

        return acc;
      }, {});

    const getCompoundVariantClassNames = compoundVariants?.reduce(
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
      const compoundClassNames = getCompoundVariantClassNames;

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

    const getDarkClassNames = (darkClasses = options?.dark) => {
      if (typeof darkClasses === "string") {
        return darkClasses?.split(" ")?.map((c) => `dark:${c}`);
      }

      if (Array.isArray(darkClasses)) {
        return darkClasses?.map((c) => `dark:${c}`);
      }

      return null;
    };

    const getDarkClassNamesBySlotKey = (slotKey) => {
      if (typeof options?.dark === "object") {
        return options?.dark?.[slotKey] ? getDarkClassNames(options?.dark?.[slotKey]) : null;
      }
    };

    // slots variants
    if (isNotEmptyObject(slotProps)) {
      const compoundClassNames = getCompoundVariantClassNamesBySlot() ?? [];

      const slotsFns =
        typeof slots === "object" && isNotEmptyObject(slots)
          ? Object.keys(slots).reduce((acc, slotKey) => {
              acc[slotKey] = (slotProps) =>
                cx(
                  slotKey === "base" ? options?.base : [],
                  slots[slotKey], // className from "slots" prop
                  getDarkClassNamesBySlotKey(slotKey),
                  getVariantClassNamesBySlotKey(slotKey),
                  compoundClassNames?.[slotKey],
                  slotProps?.class,
                  slotProps?.className,
                )(config);

              return acc;
            }, {})
          : {};

      return {
        ...slotsFns,
      };
    }

    // normal variants
    return cx(
      options?.base,
      getDarkClassNames(),
      getVariantClassNames,
      getCompoundVariantClassNames,
      props?.class,
      props?.className,
    )(config);
  };
