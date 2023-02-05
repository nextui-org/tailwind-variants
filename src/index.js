import {
  cx,
  cxBase,
  isEmptyObject,
  falsyToString,
  mergeObjects,
  joinObjects,
  removeExtraSpaces,
  flatMergeArrays,
} from "./utils.js";

export const tv = (
  options,
  config = {
    twMerge: true,
    twMergeConfig: {},
  },
) => {
  const {
    slots: slotProps = {},
    variants: variantsProps = {},
    compoundVariants = [],
    defaultVariants: defaultVariantsProps = {},
  } = options;

  const base = cxBase(options?.extend?.base, options?.base);
  const variants = mergeObjects(variantsProps, options?.extend?.variants);
  const defaultVariants = Object.assign({}, options?.extend?.defaultVariants, defaultVariantsProps);

  const componentSlots = !isEmptyObject(slotProps)
    ? {
        // add "base" to the slots object
        base: options?.base,
        ...slotProps,
      }
    : {};

  // merge slots with the "extended" slots
  const slots = isEmptyObject(options?.extend?.slots)
    ? componentSlots
    : joinObjects(
        options?.extend?.slots,
        isEmptyObject(componentSlots) ? {base: options?.base} : componentSlots,
      );

  const component = (props) => {
    if (
      isEmptyObject(variants) &&
      isEmptyObject(slotProps) &&
      isEmptyObject(options?.extend?.slots)
    ) {
      return cx(base, props?.class, props?.className)(config);
    }

    if (compoundVariants && !Array.isArray(compoundVariants)) {
      throw new TypeError(
        `The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`,
      );
    }

    const getScreenVariantValues = (screen, screenVariantValue, acc = [], slotKey) => {
      let result = acc;

      if (typeof screenVariantValue === "string") {
        result.push(
          removeExtraSpaces(screenVariantValue)
            .split(" ")
            .map((v) => `${screen}:${v}`),
        );
      } else if (Array.isArray(screenVariantValue)) {
        result.push(screenVariantValue.flatMap((v) => `${screen}:${v}`));
      } else if (typeof screenVariantValue === "object" && typeof slotKey === "string") {
        const value = screenVariantValue?.[slotKey];

        if (value && typeof value === "string") {
          const fixedValue = removeExtraSpaces(value);

          result[slotKey] = result[slotKey]
            ? [...result[slotKey], ...fixedValue.split(" ").map((v) => `${screen}:${v}`)]
            : fixedValue.split(" ").map((v) => `${screen}:${v}`);
        } else if (Array.isArray(value) && value.length > 0) {
          result[slotKey] = value.flatMap((v) => `${screen}:${v}`);
        }
      }

      return result;
    };

    const getVariantValue = (variant, vrs = variants, slotKey = null) => {
      const variantObj = vrs?.[variant];

      if (typeof variantObj !== "object" || isEmptyObject(variantObj)) {
        return null;
      }

      const variantProp = props?.[variant];
      let defaultVariantProp = defaultVariants?.[variant];
      let screenValues = [];

      if (variantProp === null) return null;

      const variantKey = falsyToString(variantProp);

      // responsive variants
      if (typeof variantKey === "object") {
        screenValues = Object.keys(variantKey).reduce((acc, screen) => {
          const screenVariantKey = variantKey[screen];
          const screenVariantValue = variantObj?.[screenVariantKey];

          if (screen === "initial") {
            defaultVariantProp = screenVariantKey;

            return acc;
          }

          return getScreenVariantValues(screen, screenVariantValue, acc, slotKey);
        }, []);
      }

      const value = variantObj[variantKey] || variantObj[falsyToString(defaultVariantProp)];

      if (
        typeof screenValues === "object" &&
        typeof slotKey === "string" &&
        screenValues[slotKey]
      ) {
        return joinObjects(screenValues, value);
      }

      return screenValues.length > 0 ? [value, ...screenValues] : value;
    };

    const getVariantClassNames = () =>
      variants ? Object.keys(variants).map((vk) => getVariantValue(vk, variants)) : null;

    const getVariantClassNamesBySlotKey = (slotKey) => {
      if (!variants || typeof variants !== "object") {
        return null;
      }

      return Object.keys(variants)
        .map((variant) => {
          const variantValue = getVariantValue(variant, variants, slotKey);

          return slotKey === "base" && typeof variantValue === "string"
            ? variantValue
            : variantValue && variantValue[slotKey];
        })
        .filter(Boolean);
    };

    const propsWithoutUndefined =
      props && Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));

    const getCompoundVariantsValue = (cv = []) =>
      cv
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ?.filter(({class: tvClass, className: tvClassName, ...compoundVariantOptions}) =>
          Object.entries(compoundVariantOptions).every(([key, value]) => {
            const initialProp = typeof props?.[key] === "object" ? props[key]?.initial : {};
            const compoundProps = {
              ...defaultVariants,
              ...initialProp,
              ...propsWithoutUndefined,
            };

            return Array.isArray(value)
              ? value.includes(compoundProps[key])
              : compoundProps[key] === value;
          }),
        )
        .flatMap(({class: tvClass, className: tvClassName}) => [tvClass, tvClassName]);

    const getCompoundVariantClassNames = () => {
      const cvValues = getCompoundVariantsValue(compoundVariants);
      const ecvValues = getCompoundVariantsValue(options?.extend?.compoundVariants);

      return flatMergeArrays(ecvValues, cvValues);
    };

    const getCompoundVariantClassNamesBySlot = () => {
      const compoundClassNames = getCompoundVariantClassNames(compoundVariants);

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
    if (!isEmptyObject(slotProps) || !isEmptyObject(options?.extend?.slots)) {
      const compoundClassNames = getCompoundVariantClassNamesBySlot() ?? [];

      const slotsFns =
        typeof slots === "object" && !isEmptyObject(slots)
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
      base,
      getVariantClassNames(),
      getCompoundVariantClassNames(),
      props?.class,
      props?.className,
    )(config);
  };

  const getVariantKeys = () => {
    if (!variants || typeof variants !== "object") return;

    return Object.keys(variants);
  };

  component.variantKeys = getVariantKeys();
  component.base = base;
  component.slots = slots;
  component.variants = variants;
  component.defaultVariants = defaultVariants;
  component.compoundVariants = compoundVariants;

  return component;
};
