import {TVConfig} from "./config";
import {TVGeneratedScreens} from "./generated";
import {ClassValue, ClassProp, OmitUndefined, StringToBoolean} from "./utils";

type TVBaseName = "base";

type TVScreens = "initial" | TVGeneratedScreens;

type TVSlots = Record<string, ClassValue> | undefined;

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

export type TVDefaultVariants<V extends TVVariants<S>, EV extends TVVariants, S extends TVSlots> = {
  [K in keyof V | keyof EV]?: StringToBoolean<keyof V[K] | keyof EV[K]>;
};

export type TVScreenPropsValue<V extends TVVariants, K extends keyof V> = {
  [Screen in TVScreens]?: StringToBoolean<keyof V[K]>;
};

export type TVProps<
  V extends TVVariants<S>,
  EV extends TVVariants,
  S extends TVSlots,
> = EV extends undefined
  ? V extends undefined
    ? ClassProp<ClassValue>
    : {
        [K in keyof V]?: StringToBoolean<keyof V[K]> | TVScreenPropsValue<V, K>;
      } & ClassProp<ClassValue>
  : V extends undefined
  ? {
      [K in keyof EV]?: StringToBoolean<keyof EV[K]> | TVScreenPropsValue<EV, K>;
    } & ClassProp<ClassValue>
  : {
      [K in keyof V | keyof EV]?:
        | StringToBoolean<keyof V[K] | keyof EV[K]>
        | TVScreenPropsValue<EV & V, K>;
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
  variantKeys: TVVariantKeys<V, S>;
};

export type TVReturnType<
  V extends TVVariants<S>,
  EV extends TVVariants,
  S extends TVSlots,
  ES extends TVSlots,
  B extends ClassValue,
> = {
  (props?: TVProps<V, EV, S>): ES extends undefined
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
    C extends TVConfig,
    B extends ClassValue = undefined,
    S extends TVSlots = undefined,
    E extends ReturnType<TV> = undefined,
    EV extends TVVariants = E["variants"] extends TVVariants ? E["variants"] : undefined,
    ES extends TVSlots = E["slots"] extends TVSlots ? E["slots"] : undefined,
  >(
    options: {
      extend?: E;
      base?: B;
      slots?: S;
      variants?: V;
      compoundVariants?: CV;
      defaultVariants?: DV;
    },
    config?: C,
  ): TVReturnType<V, EV, S, ES, B>;
};

export declare const tv: TV;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;
