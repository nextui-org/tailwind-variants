import {twMerge as twMergeBase, extendTailwindMerge} from "tailwind-merge";

import {
  isEqual,
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
let cachedTwMergeConfig = {};
let didTwMergeConfigChange = false;

export const cn =
  (...classes) =>
  (config) => {
    if (!config.twMerge) {
      return cnBase(classes);
    }

    if (!cachedTwMerge || didTwMergeConfigChange) {
      didTwMergeConfigChange = false;
      cachedTwMerge = isEmptyObject(cachedTwMergeConfig)
        ? twMergeBase
        : extendTailwindMerge(cachedTwMergeConfig);
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
    extend = null,
    slots: slotProps = {},
    variants: variantsProps = {},
    compoundVariants = [],
    compoundSlots = [],
    defaultVariants: defaultVariantsProps = {},
  } = options;

  const config = {...defaultConfig, ...configProp};

  const base = extend?.base ? cnBase(extend.base, options?.base) : options?.base;
  const variants =
    extend?.variants && !isEmptyObject(extend.variants)
      ? mergeObjects(variantsProps, extend.variants)
      : variantsProps;
  const defaultVariants =
    extend?.defaultVariants && !isEmptyObject(extend.defaultVariants)
      ? {...extend.defaultVariants, ...defaultVariantsProps}
      : defaultVariantsProps;

  // save twMergeConfig to the cache
  if (!isEmptyObject(config.twMergeConfig) && !isEqual(config.twMergeConfig, cachedTwMergeConfig)) {
    didTwMergeConfigChange = true;
    cachedTwMergeConfig = config.twMergeConfig;
  }

  const componentSlots = !isEmptyObject(slotProps)
    ? {
        // add "base" to the slots object
        base: options?.base,
        ...slotProps,
      }
    : {};

  // merge slots with the "extended" slots
  const slots = isEmptyObject(extend?.slots)
    ? componentSlots
    : joinObjects(
        extend?.slots,
        isEmptyObject(componentSlots) ? {base: options?.base} : componentSlots,
      );

  const component = (props) => {
    if (isEmptyObject(variants) && isEmptyObject(slotProps) && isEmptyObject(extend?.slots)) {
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

    const getVariantValue = (variant, vrs = variants, slotKey = null, slotProps = null) => {
      const variantObj = vrs?.[variant];

      if (!variantObj || isEmptyObject(variantObj)) {
        return null;
      }

      const variantProp = slotProps?.[variant] ?? props?.[variant];

      if (variantProp === null) return null;

      const variantKey = falsyToString(variantProp);

      // responsive variants
      const responsiveVarsEnabled =
        (Array.isArray(config.responsiveVariants) && config.responsiveVariants.length > 0) ||
        config.responsiveVariants === true;

      let defaultVariantProp = defaultVariants?.[variant];
      let screenValues = [];

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

    const getVariantClassNames = () => {
      if (!variants) {
        return null;
      }

      return Object.keys(variants).map((vk) => getVariantValue(vk, variants));
    };

    const getVariantClassNamesBySlotKey = (slotKey, slotProps) => {
      if (!variants || typeof variants !== "object") {
        return null;
      }

      return Object.keys(variants).reduce((acc, variant) => {
        const variantValue = getVariantValue(variant, variants, slotKey, slotProps);

        const value =
          slotKey === "base" && typeof variantValue === "string"
            ? variantValue
            : variantValue && variantValue[slotKey];

        if (value) {
          acc.push(value);
        }

        return acc;
      }, []);
    };

    const propsWithoutUndefined =
      props && Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));

    const getCompleteProps = (key, slotProps) => {
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
        ...slotProps,
      };
    };

    const getCompoundVariantsValue = (cv = [], slotProps) =>
      cv
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ?.filter(({class: tvClass, className: tvClassName, ...compoundVariantOptions}) =>
          Object.entries(compoundVariantOptions).every(([key, value]) => {
            const completeProps = getCompleteProps(key, slotProps);

            return Array.isArray(value)
              ? value.includes(completeProps[key])
              : completeProps[key] === value;
          }),
        )
        .flatMap(({class: tvClass, className: tvClassName}) => [tvClass, tvClassName]);

    const getCompoundVariantClassNames = (slotProps) => {
      const cvValues = getCompoundVariantsValue(compoundVariants, slotProps);
      const ecvValues = getCompoundVariantsValue(extend?.compoundVariants, slotProps);

      return flatMergeArrays(ecvValues, cvValues);
    };

    const getCompoundVariantClassNamesBySlot = (slotProps) => {
      const compoundClassNames = getCompoundVariantClassNames(slotProps);

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

    const getCompoundSlotClassNameBySlot = (slotProps) => {
      if (compoundSlots.length < 1) {
        return null;
      }

      return compoundSlots.reduce((acc, slot) => {
        const {slots = [], class: slotClass, className: slotClassName, ...slotVariants} = slot;

        if (!isEmptyObject(slotVariants)) {
          const slotVariantsKeys = Object.keys(slotVariants);

          for (const key of slotVariantsKeys) {
            const completePropsValue = getCompleteProps(key, slotProps)[key];

            // if none of the slot variant keys are included in props or default variants then skip the slot
            // if the included slot variant key is not equal to the slot variant value then skip the slot
            if (completePropsValue === undefined || completePropsValue !== slotVariants[key]) {
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
    if (!isEmptyObject(slotProps) || !isEmptyObject(extend?.slots)) {
      const slotsFns =
        typeof slots === "object" && !isEmptyObject(slots)
          ? Object.keys(slots).reduce((acc, slotKey) => {
              acc[slotKey] = (slotProps) =>
                cn(
                  slots[slotKey],
                  getVariantClassNamesBySlotKey(slotKey, slotProps),
                  (getCompoundVariantClassNamesBySlot(slotProps) ?? [])[slotKey],
                  (getCompoundSlotClassNameBySlot(slotProps) ?? [])[slotKey],
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
  component.extend = extend;
  component.base = base;
  component.slots = slots;
  component.variants = variants;
  component.defaultVariants = defaultVariants;
  component.compoundSlots = compoundSlots;
  component.compoundVariants = compoundVariants;

  return component;
};
