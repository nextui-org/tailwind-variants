import {cx, isNotEmptyObject, falsyToString, joinObjects} from "./utils.js";

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

    const getScreenVariantValues = (screen, screenVariantValue, slotKey, acc = []) => {
      let result = acc;

      if (typeof screenVariantValue === "string") {
        result.push(screenVariantValue.split(" ").map((v) => `${screen}:${v}`));
      } else if (Array.isArray(screenVariantValue)) {
        result.push(screenVariantValue.flatMap((v) => `${screen}:${v}`));
      } else if (typeof screenVariantValue === "object" && typeof slotKey === "string") {
        const value = screenVariantValue?.[slotKey];

        if (value && typeof value === "string") {
          result[slotKey] = result[slotKey]
            ? [...result[slotKey], ...value.split(" ").map((v) => `${screen}:${v}`)]
            : value.split(" ").map((v) => `${screen}:${v}`);
        } else if (Array.isArray(value) && value.length > 0) {
          result[slotKey] = value.flatMap((v) => `${screen}:${v}`);
        }
      }

      return result;
    };

    const getVariantValue = (variant, slotKey = null) => {
      const variantProp = props?.[variant];
      const variantObj = variants?.[variant];
      const defaultVariantProp = screenVariants?.initial?.[variant] || defaultVariants?.[variant];

      const screenValues = Object.keys(screenVariants).reduce((acc, screen) => {
        if (screen === "initial") return acc;

        const screenVariantKey = screenVariants[screen]?.[variant];
        const screenVariantValue = variantObj?.[screenVariantKey];

        const result = getScreenVariantValues(screen, screenVariantValue, slotKey, acc);

        return result;
      }, []);

      if (typeof variantObj !== "object" || !isNotEmptyObject(variantObj)) {
        return null;
      }

      if (variantProp === null) return null;

      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);

      if (
        typeof screenValues === "object" &&
        typeof slotKey === "string" &&
        screenValues[slotKey]
      ) {
        return joinObjects(screenValues, variantObj[variantKey]);
      }

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
          const variantValue = getVariantValue(variant, slotKey);

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
                  slots[slotKey],
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
