import {TVConfig} from "./config";
import {
  ClassValue,
  ClassProp,
  OmitUndefined,
  StringToBoolean,
  StringArrayToFunctions,
} from "./utils";

type TVDefaultSlot = "";

export type TVVariants<S extends string[]> = {
  [key: string]: {
    [key: string]: S extends TVDefaultSlot
      ? ClassValue
      : {[P in S[number]]?: ClassValue} | ClassValue;
  };
};

export type TVCompoundVariants<V extends TVVariants<S>, S extends string[]> = Array<
  {
    [K in keyof V]?: StringToBoolean<keyof V[K]>;
  } & ClassProp<{[K in S[number]]?: ClassValue} | ClassValue>
>;

export type TVDefaultVariants<V extends TVVariants<S>, S extends string[]> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>;
};

export type TVProps<V extends TVVariants<S>, S extends string[]> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>;
} & ClassProp;

export type TVReturnType<V extends TVVariants<S>, S extends string> = (
  props?: TVProps<V, S[]>,
) => S extends TVDefaultSlot ? string : StringArrayToFunctions<S[], ClassProp>;

export declare function tv<
  V extends TVVariants<S[]>,
  CV extends TVCompoundVariants<V, S[]>,
  DV extends TVDefaultVariants<V, S[]>,
  C extends TVConfig,
  S extends string = TVDefaultSlot,
>(
  options: {
    base?: ClassValue;
    slots?: S[];
    variants?: V;
    compoundVariants?: CV;
    defaultVariants?: DV;
  },
  config?: C,
): TVReturnType<V, S>;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;
