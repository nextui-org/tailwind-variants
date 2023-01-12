import type {ClassProp, ClassValue, OmitUndefined, StringToBoolean} from "./types";

import {cx} from "class-variance-authority";

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;

const falsyToString = <T extends unknown>(value: T) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

type ConfigSchema = Record<string, Record<string, ClassValue>>;

type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null;
};
type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | StringToBoolean<keyof T[Variant]>[];
};

type Config<T> = T extends ConfigSchema
  ? {
      base?: ClassValue;
      parts?: string[];
      variants?: T;
      defaultVariants?: ConfigVariants<T>;
      compoundVariants?: (T extends ConfigSchema
        ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & ClassProp
        : ClassProp)[];
    }
  : never;

type Props<T> = T extends ConfigSchema ? ConfigVariants<T> & ClassProp : ClassProp;

export const tv =
  <T>(config?: Config<T>) =>
  (props?: Props<T>) => {
    if (config?.variants == null) {
      return cx(config?.base, props?.class, props?.className);
    }

    const {variants, defaultVariants} = config;

    const getVariantClassNames = Object.keys(variants).map((variant: keyof typeof variants) => {
      const variantProp = props?.[variant as keyof typeof props];
      const defaultVariantProp = defaultVariants?.[variant];

      if (variantProp === null) return null;

      const variantKey = (falsyToString(variantProp) ||
        falsyToString(defaultVariantProp)) as keyof (typeof variants)[typeof variant];

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
      }, {} as Record<string, unknown>);

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
      [] as ClassValue[],
    );

    return cx(
      config?.base,
      getVariantClassNames,
      getCompoundVariantClassNames,
      props?.class,
      props?.className,
    );
  };
