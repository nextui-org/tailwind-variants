import {TVConfig} from "./config";
import {ClassValue, ClassProp, OmitUndefined, StringToBoolean, AddItemToArray} from "./utils";

type TVDefaultSlot = "";
type TVBaseName = "base";

type SlotsWithBase<S extends string[]> = AddItemToArray<S, TVBaseName>;

type SlotsClassValue<S extends string[]> = {
  [K in SlotsWithBase<S>[number]]: ClassValue;
};

export declare type TVVariants<S extends string[]> = {
  [key: string]: {
    [key: string]: S extends TVDefaultSlot ? ClassValue : SlotsClassValue<S> | ClassValue;
  };
};

export declare type TVCompoundVariants<V extends TVVariants<S>, S extends string[]> = Array<
  {
    [K in keyof V]?: StringToBoolean<keyof V[K]>;
  } & ClassProp<SlotsClassValue<S> | ClassValue>
>;

export declare type TVDefaultVariants<V extends TVVariants<S>, S extends string[]> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>;
};

export declare type TVProps<V extends TVVariants<S>, S extends string[]> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>;
} & ClassProp;

export declare type TVReturnType<V extends TVVariants<S>, S extends string> = (
  props?: TVProps<V, S[]>,
) => S extends TVDefaultSlot
  ? string
  : {
      [K in SlotsWithBase<S[]>[number]]: (props?: ClassProp) => string;
    };

export declare function tv<
  V extends TVVariants<S[]>,
  DV extends TVDefaultVariants<V, S[]>,
  CV extends TVCompoundVariants<V, S[]>,
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
