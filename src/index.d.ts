import {TVConfig, TWMConfig} from "./config";
import {TVGeneratedScreens} from "./generated";

/**
 * ----------------------------------------
 * Base Types
 * ----------------------------------------
 */

export type ClassValue = string | string[] | null | undefined | ClassValue[];

export type ClassProp<V extends unknown = ClassValue> =
  | {
      class: V;
      className?: never;
    }
  | {class?: never; className: V}
  | {class?: never; className?: never};

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

export type CnReturn = string;

export declare const cnBase: <T extends CnOptions>(...classes: T) => CnReturn;

export declare const cn: <T extends CnOptions>(...classes: T) => (config?: TWMConfig) => CnReturn;

// compare if the value is true or array of values
export type isTrueOrArray<T> = T extends true | (infer U)[] ? true : false;

export type isStringArray<T> = T extends Array<string> ? true : false;

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

type TVVariantsDefault<S extends TVSlots, B extends ClassValue> = {
  [key: string]: {
    [key: string]: S extends TVSlots ? SlotsClassValue<S, B> | ClassValue : ClassValue;
  };
};

export type TVVariants<
  S extends TVSlots,
  B extends ClassValue,
  EV extends TVVariants = undefined,
> = EV extends undefined
  ? TVVariantsDefault<S, B>
  :
      | {
          [K in keyof EV]?:
            | {
                [K2 in keyof EV[K]]?: S extends TVSlots
                  ? SlotsClassValue<S, B> | ClassValue
                  : ClassValue;
              };
        }
      | TVVariantsDefault<S, B>;

export type TVCompoundVariants<
  V extends TVVariants<S>,
  EV extends TVVariants,
  S extends TVSlots,
  B extends ClassValue,
> = Array<
  {
    [K in keyof V | keyof EV]?:
      | StringToBoolean<keyof V[K] | keyof EV[K]>
      | StringToBoolean<keyof V[K]>[];
  } & ClassProp<SlotsClassValue<S, B> | ClassValue>
>;

export type TVCompoundSlots<
  V extends TVVariants<S>,
  S extends TVSlots,
  B extends ClassValue,
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

export type TVDefaultVariants<V extends TVVariants<S>, EV extends TVVariants, S extends TVSlots> = {
  [K in keyof V | keyof EV]?: StringToBoolean<keyof V[K] | keyof EV[K]>;
};

export type TVScreenPropsValue<
  V extends TVVariants,
  K extends keyof V,
  C extends TVConfig,
> = isStringArray<C["responsiveVariants"]> extends true
  ? {
      [Screen in WithInitialScreen<C["responsiveVariants"]>[number]]?: StringToBoolean<keyof V[K]>;
    }
  : {
      [Screen in TVScreens]?: StringToBoolean<keyof V[K]>;
    };

export type TVProps<
  V extends TVVariants<S>,
  EV extends TVVariants,
  S extends TVSlots,
  C extends TVConfig<V, EV>,
> = EV extends undefined
  ? V extends undefined
    ? ClassProp<ClassValue>
    : {
        [K in keyof V]?: isTrueOrArray<C["responsiveVariants"]> extends true
          ? StringToBoolean<keyof V[K]> | TVScreenPropsValue<V, K, C>
          : StringToBoolean<keyof V[K]>;
      } & ClassProp<ClassValue>
  : V extends undefined
  ? {
      [K in keyof EV]?: isTrueOrArray<C["responsiveVariants"]> extends true
        ? StringToBoolean<keyof EV[K]> | TVScreenPropsValue<EV, K, C>
        : StringToBoolean<keyof EV[K]>;
    } & ClassProp<ClassValue>
  : {
      [K in keyof V | keyof EV]?: isTrueOrArray<C["responsiveVariants"]> extends true
        ? StringToBoolean<keyof V[K] | keyof EV[K]> | TVScreenPropsValue<EV & V, K, C>
        : StringToBoolean<keyof V[K] | keyof EV[K]>;
    } & ClassProp<ClassValue>;

export type TVVariantKeys<V extends TVVariants<S>, S extends TVSlots> = V extends Object
  ? Array<keyof V>
  : undefined;

export type TVReturnProps<V extends TVVariants<S>, S extends TVSlots, B extends ClassValue> = {
  base: B;
  slots: S;
  variants: V;
  defaultVariants: TVDefaultVariants<V, S>;
  compoundVariants: TVCompoundVariants<V, S, B>;
  compoundSlots: TVCompoundSlots<V, S, B>;
  variantKeys: TVVariantKeys<V, S>;
};

export type TVReturnType<
  V extends TVVariants<S>,
  EV extends TVVariants,
  S extends TVSlots,
  ES extends TVSlots,
  B extends ClassValue,
  C extends TVConfig<V, EV>,
> = {
  (props?: TVProps<V, EV, S, C>): ES extends undefined
    ? S extends undefined
      ? string
      : {[K in TVSlotsWithBase<S, B>]: (slotProps?: ClassProp) => string}
    : {[K in TVSlotsWithBase<ES & S, B>]: (slotProps?: ClassProp) => string};
} & TVReturnProps<V, S, B>;

export type TV = {
  <
    V extends TVVariants<S, B, EV> = undefined,
    CV extends TVCompoundVariants<V, EV, S, B> = undefined,
    DV extends TVDefaultVariants<V, EV, S> = undefined,
    C extends TVConfig<V, EV> = undefined,
    B extends ClassValue = undefined,
    S extends TVSlots = undefined,
    E extends ReturnType<TV> = undefined,
    EV extends TVVariants = E["variants"] extends TVVariants ? E["variants"] : undefined,
    ES extends TVSlots = E["slots"] extends TVSlots ? E["slots"] : undefined,
  >(
    options: {
      /**
       * Extend allows easily compose components.
       * @see https://www.tailwind-variants.org/docs/composing-components
       */
      extend?: E;
      /**
       * Base allows you to set a base class for a component.
       */
      base?: B;
      /**
       * Slots allows you to separate an component into multiple parts.
       * @see https://www.tailwind-variants.org/docs/slots
       */
      slots?: S;
      /**
       * Variants allows you to create multiple versions of the same component.
       * @see https://www.tailwind-variants.org/docs/variants#adding-variants
       */
      variants?: V;
      /**
       * Compound variants allow apply classes to multiple variants at once.
       * @see https://www.tailwind-variants.org/docs/variants#compound-variants
       */
      compoundVariants?: CV;
      /**
       * Compound slots allow apply classes to multiple slots at once.
       */
      compoundSlots?: TVCompoundSlots<V, S, B>;
      /**
       * Default variants allow you to set default variants for a component.
       * @see https://www.tailwind-variants.org/docs/variants#default-variants
       */
      defaultVariants?: DV;
    },
    /**
     * The config object to modify the default configuration.
     * @see https://www.tailwind-variants.org/docs/api-reference#config-optional
     */
    config?: C,
  ): TVReturnType<V, EV, S, ES, B, C>;
};

// main function
export declare const tv: TV;

export declare const defaultConfig: TVConfig;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;
