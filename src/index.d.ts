import {TVConfig} from "./config";
import {ClassValue, ClassProp, OmitUndefined, StringToBoolean} from "./utils";

type TVBaseName = "base";

type TVSlots = Record<string, ClassValue> | undefined;

type TVSlotsWithBase<S extends TVSlots, B extends ClassValue> = B extends undefined
  ? keyof S
  : keyof S | TVBaseName;

type SlotsClassValue<S extends TVSlots, B extends ClassValue> = {
  [K in TVSlotsWithBase<S, B>]?: ClassValue;
};

export type TVVariants<S extends TVSlots, B extends ClassValue> = {
  [key: string]: {
    [key: string]: S extends TVSlots ? SlotsClassValue<S, B> | ClassValue : ClassValue;
  };
};

export type TVCompoundVariants<
  V extends TVVariants<S>,
  S extends TVSlots,
  B extends ClassValue,
> = Array<
  {
    [K in keyof V]?: StringToBoolean<keyof V[K]> | StringToBoolean<keyof V[K]>[];
  } & ClassProp<SlotsClassValue<S, B> | ClassValue>
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
      [K in TVSlotsWithBase<S, B>]: (slotProps?: ClassProp) => string;
    };

export type TVDark<S extends TVSlots, B extends ClassValue> =
  | {
      [K in TVSlotsWithBase<S, B>]?: ClassValue;
    }
  | ClassValue;

export function tv<
  V extends TVVariants<S>,
  DV extends TVDefaultVariants<V, S>,
  CV extends TVCompoundVariants<V, S, B>,
  C extends TVConfig,
  B extends ClassValue = undefined,
  S extends TVSlots = undefined,
>(
  options: {
    base?: B;
    slots?: S;
    dark?: TVDark<S, B>;
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
