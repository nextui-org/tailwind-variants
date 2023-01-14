import {TVConfig} from "./config";
import {ClassValue, ClassProp, OmitUndefined} from "./utils";

type TVSlots = string[];
// type TVSlots = ["trigger", "menu", "item"];

type TVVariants<S extends TVSlots> = {
  [key: string]: {
    [key: string]: {[P in S[number]]?: ClassValue} | ClassValue;
  };
};

type TVCompoundVariants<V extends TVVariants<S>, S extends TVSlots> = Array<
  {
    [K in keyof V]?: keyof V[K];
  } & ClassProp<{[K in S[number]]?: ClassValue} | ClassValue>
>;

type TVDefaultVariants<V extends TVVariants<S>, S extends TVSlots> = {
  [K in keyof V]?: keyof V[K];
};

type TVReturnType<S extends TVSlots> = S extends undefined
  ? {[K in S[number]]: (slotProps: ClassProp) => string}
  : (slotProps: ClassProp) => string;

export declare function tv<
  V extends TVVariants<S>,
  CV extends TVCompoundVariants<V, S>,
  DV extends TVDefaultVariants<V, S>,
  C extends TVConfig,
  S extends TVSlots = TVSlots,
>(
  options: {
    base?: ClassValue;
    slots?: S;
    variants?: V;
    compoundVariants?: CV;
    defaultVariants?: DV;
  },
  config?: C,
): TVReturnType<S>;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;
