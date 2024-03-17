import type {ClassNameValue as ClassValue} from "tailwind-merge";

import {TVConfig, TWMConfig} from "./config";
import {TVGeneratedScreens} from "./generated";

/**
 * ----------------------------------------
 * Base Types
 * ----------------------------------------
 */

export type {ClassValue};

export type ClassProp<V extends unknown = ClassValue> =
  | {class?: V; className?: never}
  | {class?: never; className?: V};

type TVBaseName = "base";

type TVScreens = "initial" | TVGeneratedScreens;

type TVSlots = Record<string, ClassValue> | undefined;

/**
 * ----------------------------------------------------------------------
 * Utils
 * ----------------------------------------------------------------------
 */

export type OmitUndefined<T> = T extends undefined ? never : T;

export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type CnOptions = ClassValue[];

export type CnReturn = string | undefined;

export declare const cnBase: <T extends CnOptions>(...classes: T) => CnReturn;

export declare const cn: <T extends CnOptions>(...classes: T) => (config?: TWMConfig) => CnReturn;

// compare if the value is true or array of values
export type isTrueOrArray<T> = T extends true | unknown[] ? true : false;

export type WithInitialScreen<T extends Array<string>> = ["initial", ...T];

/**
 * ----------------------------------------------------------------------
 * TV Types
 * ----------------------------------------------------------------------
 */

type TVSlotsWithBase<S extends TVSlots, B extends ClassValue> = B extends undefined
  ? keyof S
  : keyof S | TVBaseName;

type SlotsClassValue<S extends TVSlots, B extends ClassValue> = {
  [K in TVSlotsWithBase<S, B>]?: ClassValue;
};

type TVVariants<B extends ClassValue, S extends TVSlots> = S extends undefined
  ? {}
  : {
      [key: string]: {
        [key: string]: S extends TVSlots ? SlotsClassValue<S, B> | ClassValue : ClassValue;
      };
    };

export type TVCompoundVariants<
  B extends ClassValue,
  S extends TVSlots,
  V extends TVVariants<B, S>,
> = Array<
  {
    [K in keyof V]?:
      | (K extends keyof V ? StringToBoolean<keyof V[K]> : never)
      | (K extends keyof V ? StringToBoolean<keyof V[K]>[] : never);
  } & ClassProp<SlotsClassValue<S, B> | ClassValue>
>;

export type TVCompoundSlots<
  B extends ClassValue,
  S extends TVSlots,
  V extends TVVariants<B, S> | undefined,
> = Array<
  V extends undefined
    ? {
        slots: Array<TVSlotsWithBase<S, B>>;
      } & ClassProp
    : {
        slots: Array<TVSlotsWithBase<S, B>>;
      } & {
        [K in keyof V]?: StringToBoolean<keyof V[K]> | StringToBoolean<keyof V[K]>[];
      } & ClassProp
>;

export type TVDefaultVariants<
  B extends ClassValue,
  S extends TVSlots,
  V extends TVVariants<B, S>,
> = {
  [K in keyof V]?: K extends keyof V ? StringToBoolean<keyof V[K]> : never;
};

export type TVScreenPropsValue<
  B extends ClassValue,
  S extends TVSlots,
  V extends TVVariants<B, S>,
  K extends keyof V,
  C extends TVConfig<V>,
> = C["responsiveVariants"] extends string[]
  ? {
      [Screen in WithInitialScreen<C["responsiveVariants"]>[number]]?: StringToBoolean<keyof V[K]>;
    }
  : {
      [Screen in TVScreens]?: StringToBoolean<keyof V[K]>;
    };

export type TVProps<
  B extends ClassValue,
  V extends TVVariants<B, S>,
  S extends TVSlots,
  C extends TVConfig<V>,
> = V extends undefined
  ? ClassProp<ClassValue>
  : {
      [K in keyof V]?: isTrueOrArray<C["responsiveVariants"]> extends true
        ? StringToBoolean<keyof V[K]> | TVScreenPropsValue<B, S, V, K, C> | undefined
        : StringToBoolean<keyof V[K]> | undefined;
    } & ClassProp<ClassValue>;

export type TVVariantKeys<
  B extends ClassValue,
  S extends TVSlots,
  V extends TVVariants<B, S>,
> = V extends Object ? Array<keyof V> : undefined;

export type TVReturnProps<B extends ClassValue, S extends TVSlots, V extends TVVariants<B, S>> = {
  base: B;
  slots: S;
  variants: V;
  defaultVariants: TVDefaultVariants<B, S, V>;
  compoundVariants: TVCompoundVariants<B, S, V>;
  compoundSlots: TVCompoundSlots<B, S, V>;
  variantKeys: TVVariantKeys<B, S, V>;
};

type HasSlots<S extends TVSlots> = S extends undefined ? false : true;

type Merge<T, U> = Exclude<T | U, undefined>;

export type TVReturnType<
  B extends ClassValue,
  S extends TVSlots,
  V extends TVVariants<B, S>,
  C extends TVConfig<V>,
> = {
  (props?: TVProps<B, V, S, C>): HasSlots<S> extends true
    ? {
        [K in keyof (S extends undefined ? {} : S)]: (slotProps?: TVProps<B, V, S, C>) => string;
      } & {
        [K in TVSlotsWithBase<{}, B>]: (slotProps?: TVProps<B, V, S, C>) => string;
      }
    : string;
  extend<
    EB extends ClassValue,
    ES extends TVSlots,
    EV extends TVVariants<EB, ES>,
    EC extends TVConfig<EV>,
    ECV extends TVCompoundVariants<EB, ES, EV>,
    EDV extends TVDefaultVariants<EB, ES, EV>,
  >(
    options: {
      /**
       * Base allows you to set a base class for a component.
       */
      base?: EB;
      /**
       * Slots allow you to separate a component into multiple parts.
       * @see https://www.tailwind-variants.org/docs/slots
       */
      slots?: ES;
      /**
       * Variants allow you to create multiple versions of the same component.
       * @see https://www.tailwind-variants.org/docs/variants#adding-variants
       */
      variants?: EV;
      /**
       * Compound variants allow you to apply classes to multiple variants at once.
       * @see https://www.tailwind-variants.org/docs/variants#compound-variants
       */
      compoundVariants?: ECV;
      /**
       * Compound slots allow you to apply classes to multiple slots at once.
       */
      compoundSlots?: TVCompoundSlots<EB, ES, EV>;
      /**
       * Default variants allow you to set default variants for a component.
       * @see https://www.tailwind-variants.org/docs/variants#default-variants
       */
      defaultVariants?: EDV;
    },
    /**
     * The config object allows you to modify the default configuration.
     * @see https://www.tailwind-variants.org/docs/api-reference#config-optional
     */
    config?: EC,
  ): TVReturnType<Merge<B, EB>, Merge<S, ES>, Merge<V, EV>, Merge<C, EC>>;
} & TVReturnProps<B, S, V>;

export type TV = {
  <
    V extends TVVariants<B, S>,
    CV extends TVCompoundVariants<B, S, V>,
    DV extends TVDefaultVariants<B, S, V>,
    C extends TVConfig<V>,
    B extends ClassValue = undefined,
    S extends TVSlots = undefined,
  >(
    options: {
      /**
       * Base allows you to set a base class for a component.
       */
      base?: B;
      /**
       * Slots allow you to separate a component into multiple parts.
       * @see https://www.tailwind-variants.org/docs/slots
       */
      slots?: S;
      /**
       * Variants allow you to create multiple versions of the same component.
       * @see https://www.tailwind-variants.org/docs/variants#adding-variants
       */
      variants?: V;
      /**
       * Compound variants allow you to apply classes to multiple variants at once.
       * @see https://www.tailwind-variants.org/docs/variants#compound-variants
       */
      compoundVariants?: CV;
      /**
       * Compound slots allow you to apply classes to multiple slots at once.
       */
      compoundSlots?: TVCompoundSlots<B, S, V>;
      /**
       * Default variants allow you to set default variants for a component.
       * @see https://www.tailwind-variants.org/docs/variants#default-variants
       */
      defaultVariants?: DV;
    },
    /**
     * The config object allows you to modify the default configuration.
     * @see https://www.tailwind-variants.org/docs/api-reference#config-optional
     */
    config?: C,
  ): TVReturnType<B, S, V, C>;
};

export type CreateTV<RV extends TVConfig["responsiveVariants"] = undefined> = {
  <
    V extends TVVariants<B, S>,
    CV extends TVCompoundVariants<B, S, V>,
    DV extends TVDefaultVariants<B, S, V>,
    C extends TVConfig<V>,
    B extends ClassValue = undefined,
    S extends TVSlots = undefined,
  >(
    options: {
      /**
       * Base allows you to set a base class for a component.
       */
      base?: B;
      /**
       * Slots allow you to separate a component into multiple parts.
       * @see https://www.tailwind-variants.org/docs/slots
       */
      slots?: S;
      /**
       * Variants allow you to create multiple versions of the same component.
       * @see https://www.tailwind-variants.org/docs/variants#adding-variants
       */
      variants?: V;
      /**
       * Compound variants allow you to apply classes to multiple variants at once.
       * @see https://www.tailwind-variants.org/docs/variants#compound-variants
       */
      compoundVariants?: CV;
      /**
       * Compound slots allow you to apply classes to multiple slots at once.
       */
      compoundSlots?: TVCompoundSlots<B, S, V>;
      /**
       * Default variants allow you to set default variants for a component.
       * @see https://www.tailwind-variants.org/docs/variants#default-variants
       */
      defaultVariants?: DV;
    },
    /**
     * The config object allows you to modify the default configuration.
     * @see https://www.tailwind-variants.org/docs/api-reference#config-optional
     */
    config?: C,
  ): TVReturnType<B, S, V, C & RV>;
};

// main function
export declare const tv: TV;

export declare function createTV<T extends TVConfig["responsiveVariants"]>(
  config: TVConfig & T,
): CreateTV<T>;

export declare const defaultConfig: TVConfig;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;
