import {twMerge as twMergeBase, extendTailwindMerge} from "tailwind-merge";

import {
  isEmptyObject,
  falsyToString,
  mergeObjects,
  removeExtraSpaces,
  flatMergeArrays,
  flatArray,
} from "./utils.js";

export const defaultConfig = {
  twMerge: true,
  twMergeConfig: {},
  responsiveVariants: false,
};

export const voidEmpty = (value) => (!!value ? value : undefined);

export const cnBase = (...classes) => voidEmpty(flatArray(classes).filter(Boolean).join(" "));

let cachedTwMerge = null;

export const cn =
  (...classes) =>
  (config) => {
    if (!config.twMerge) {
      return cnBase(classes);
    }

    if (!cachedTwMerge) {
      cachedTwMerge = !isEmptyObject(config.twMergeConfig)
        ? extendTailwindMerge(config.twMergeConfig)
        : twMergeBase;
    }

    return voidEmpty(cachedTwMerge(cnBase(classes)));
  };

const joinObjects = (obj1, obj2) => {
  for (const key in obj2) {
    if (obj1.hasOwnProperty(key)) {
      obj1[key] = cnBase(obj1[key], obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  }

  return obj1;
};

export const tv = (options, configProp) => {
  const {
    slots: slotProps = {},
    variants: variantsProps = {},
    compoundVariants = [],
    compoundSlots = [],
    defaultVariants: defaultVariantsProps = {},
  } = options;

  const config = {...defaultConfig, ...configProp};

  const base = cnBase(options?.extend?.base, options?.base);
  const variants = mergeObjects(variantsProps, options?.extend?.variants);
  const defaultVariants = {...options?.extend?.defaultVariants, ...defaultVariantsProps};

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
      return cn(base, props?.class, props?.className)(config);
    }

    if (compoundVariants && !Array.isArray(compoundVariants)) {
      throw new TypeError(
        `The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`,
      );
    }

    if (compoundSlots && !Array.isArray(compoundSlots)) {
      throw new TypeError(
        `The "compoundSlots" prop must be an array. Received: ${typeof compoundSlots}`,
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

      const responsiveVarsEnabled =
        (Array.isArray(config.responsiveVariants) && config.responsiveVariants.length > 0) ||
        config.responsiveVariants === true;

      if (typeof variantKey === "object" && responsiveVarsEnabled) {
        screenValues = Object.keys(variantKey).reduce((acc, screen) => {
          const screenVariantKey = variantKey[screen];
          const screenVariantValue = variantObj?.[screenVariantKey];

          if (screen === "initial") {
            defaultVariantProp = screenVariantKey;

            return acc;
          }

          // if the screen is not in the responsiveVariants array, skip it
          if (
            Array.isArray(config.responsiveVariants) &&
            !config.responsiveVariants.includes(screen)
          ) {
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

    const getCompleteProps = (key) => {
      const initialProp =
        typeof props?.[key] === "object"
          ? {
              [key]: props[key]?.initial,
            }
          : {};

      return {
        ...defaultVariants,
        ...propsWithoutUndefined,
        ...initialProp,
      };
    };

    const getCompoundVariantsValue = (cv = []) =>
      cv
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ?.filter(({class: tvClass, className: tvClassName, ...compoundVariantOptions}) =>
          Object.entries(compoundVariantOptions).every(([key, value]) => {
            const completeProps = getCompleteProps(key);

            return Array.isArray(value)
              ? value.includes(completeProps[key])
              : completeProps[key] === value;
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
          acc.base = cn(acc.base, className)(config);
        }

        if (typeof className === "object") {
          const classNameKeys = Object.keys(className);

          for (const slot of classNameKeys) {
            acc[slot] = cn(acc[slot], className[slot])(config);
          }
        }

        return acc;
      }, {});
    };

    const getCompoundSlotClassNameBySlot = () => {
      if (compoundSlots.length < 1) {
        return null;
      }

      return compoundSlots.reduce((acc, slot) => {
        const {slots = [], class: slotClass, className: slotClassName, ...slotVariants} = slot;

        if (!isEmptyObject(slotVariants)) {
          const slotVariantsKeys = Object.keys(slotVariants);

          for (const key of slotVariantsKeys) {
            const completePropsValue = getCompleteProps(key)[key];

            // if none of the slot variant keys are included in props or default variants then skip the slot
            // if the included slot variant key is not equal to the slot variant value then skip the slot
            if (!completePropsValue || completePropsValue !== slotVariants[key]) {
              return acc;
            }
          }
        }

        for (const slotName of slots) {
          if (!acc[slotName]) {
            acc[slotName] = [];
          }

          acc[slotName].push([slotClass, slotClassName]);
        }

        return acc;
      }, {});
    };

    // with slots
    if (!isEmptyObject(slotProps) || !isEmptyObject(options?.extend?.slots)) {
      const compoundClassNames = getCompoundVariantClassNamesBySlot() ?? [];
      const compoundSlotClassNames = getCompoundSlotClassNameBySlot() ?? [];

      const slotsFns =
        typeof slots === "object" && !isEmptyObject(slots)
          ? Object.keys(slots).reduce((acc, slotKey) => {
              acc[slotKey] = (slotProps) =>
                cn(
                  slots[slotKey],
                  getVariantClassNamesBySlotKey(slotKey),
                  compoundClassNames?.[slotKey],
                  compoundSlotClassNames?.[slotKey],
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
    return cn(
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
  component.compoundSlots = compoundSlots;
  component.compoundVariants = compoundVariants;

  return component;
};
