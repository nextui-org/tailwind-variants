import {cx} from "class-variance-authority";

const falsyToString = (value) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

export const tv = (config) => (props) => {
  if (config?.variants == null) {
    return cx(config?.base, props?.class, props?.className);
  }

  const {variants, defaultVariants} = config;

  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props?.[variant];
    const defaultVariantProp = defaultVariants?.[variant];

    if (variantProp === null) return null;

    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);

    return variants[variant][variantKey];
  });

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

  return cx(
    config?.base,
    getVariantClassNames,
    getCompoundVariantClassNames,
    props?.class,
    props?.className,
  );
};

const result = tv({
  base: "flex",
  parts: [],
  variants: {
    color: {
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
    size: {
      xs: "w-4 h-4",
      sm: "w-8 h-8",
      md: "w-12 h-12",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

console.log(result());
