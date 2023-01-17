import {TVConfig} from "./config";
import {ClassValue, ClassProp, OmitUndefined, StringToBoolean} from "./utils";

type TVBaseName = "base";

type TVSlots = Record<string, ClassValue> | undefined;

type SlotsClassValue<S extends TVSlots> = {
  [K in keyof S]?: ClassValue;
};

export type TVVariants<S extends TVSlots> = {
  [key: string]: {
    [key: string]: S extends TVSlots ? SlotsClassValue<S> | ClassValue : ClassValue;
  };
};

export type TVCompoundVariants<V extends TVVariants<S>, S extends TVSlots> = Array<
  {
    [K in keyof V]?: StringToBoolean<keyof V[K]> | StringToBoolean<keyof V[K]>[];
  } & ClassProp<SlotsClassValue<S> | ClassValue>
>;

export type TVDefaultVariants<V extends TVVariants<S>, S extends TVSlots> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>;
};

export type TVProps<V extends TVVariants<S>, S extends TVSlots> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>;
} & ClassProp;

export type TVReturnType<V extends TVVariants<S>, S extends TVSlots, B extends ClassValue> = (
  props?: TVProps<V, S>,
) => S extends undefined
  ? string
  : {
      [K in B extends undefined ? keyof S : keyof S | TVBaseName]: (
        slotProps?: ClassProp,
      ) => string;
    };

export function tv<
  DV extends TVDefaultVariants<V, S>,
  CV extends TVCompoundVariants<V, S>,
  C extends TVConfig,
  V extends TVVariants<S>,
  B extends ClassValue = undefined,
  S extends TVSlots = undefined,
>(
  options: {
    base?: B;
    slots?: S;
    variants?: V;
    compoundVariants?: CV;
    defaultVariants?: DV;
  },
  config?: C,
): TVReturnType<V, S, B>;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;
