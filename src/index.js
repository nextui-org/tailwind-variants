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
      compoundVariants = [],
      defaultVariants = {},
      screenVariants = {
        initial: {},
      },
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
      const variantObj = variants?.[variant];
      const defaultVariantProp = screenVariants?.initial?.[variant] || defaultVariants?.[variant];

      const screenValues = Object.keys(screenVariants).reduce((acc, screen) => {
        if (screen === "initial") return acc;
        const screenVariantKey = screenVariants[screen]?.[variant];

        if (screenVariantKey && variantObj?.[screenVariantKey]) {
          acc.push(`${screen}:${variantObj[screenVariantKey]}`);
        }

        return acc;
      }, []);

      if (typeof variantObj !== "object" || !isNotEmptyObject(variantObj)) {
        return null;
      }

      if (variantProp === null) return null;

      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);

      return screenValues.length > 0
        ? [variantObj[variantKey], ...screenValues]
        : variantObj[variantKey];
    };

    const getVariantClassNames = variants ? Object.keys(variants).map(getVariantValue) : null;

    const getVariantClassNamesBySlotKey = (slotKey) => {
      if (!variants || typeof variants !== "object") {
        return null;
      }

      return Object.keys(variants)
        .map((variant) => {
          const variantValue = getVariantValue(variant);

          return slotKey === "base" && typeof variantValue === "string"
            ? variantValue
            : variantValue && variantValue[slotKey];
        })
        .filter(Boolean);
    };

    const propsWithoutUndefined =
      props && Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));

    const getCompoundVariantClassNames = compoundVariants
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ?.filter(({class: tvClass, className: tvClassName, ...compoundVariantOptions}) =>
        Object.entries(compoundVariantOptions).every(([key, value]) => {
          const props = {...defaultVariants, ...screenVariants.initial, ...propsWithoutUndefined};

          return Array.isArray(value) ? value.includes(props[key]) : props[key] === value;
        }),
      )
      .flatMap(({class: tvClass, className: tvClassName}) => [tvClass, tvClassName]);

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
      getVariantClassNames,
      getCompoundVariantClassNames,
      props?.class,
      props?.className,
    )(config);
  };

// const menu = tv({
//   base: "text-3xl font-bold underline",
//   slots: {
//     title: "text-2xl",
//     item: "text-xl",
//     list: "list-none",
//     wrapper: "flex flex-col",
//   },
//   variants: {
//     color: {
//       primary: "color--primary",
//       secondary: {
//         base: "color--secondary-base",
//         title: "color--secondary-title",
//         item: "color--secondary-item",
//         list: "color--secondary-list",
//         wrapper: "color--secondary-wrapper",
//       },
//     },
//     size: {
//       xs: "size--xs",
//       sm: "size--sm",
//       md: {
//         title: "size--md-title",
//       },
//     },
//     isDisabled: {
//       true: {
//         title: "disabled--title",
//       },
//       false: {
//         item: "enabled--item",
//       },
//     },
//   },
//   defaultVariants: {
//     color: "primary",
//     size: "sm",
//     isDisabled: false,
//   },
// });

// console.time("menu");
// with custom props
// const {base, title, item, list, wrapper} = menu({
//   color: "secondary",
//   size: "md",
// });

// console.log(base(), title(), item(), list(), wrapper());
// console.log("------------------");
// console.timeEnd("menu");

/**
 * Result1: text-3xl font-bold underline color--secondary-base text-2xl color--secondary-title size--md-title
 * text-xl color--secondary-item enabled--item list-none color--secondary-list flex flex-col color--secondary-wrapper
 */
