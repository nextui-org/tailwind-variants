export type ClassPropKey = "class" | "className";
export type ClassValue = string | null | undefined | ClassValue[];

export type ClassProp =
  | {
      class: ClassValue;
      className?: never;
    }
  | {class?: never; className: ClassValue}
  | {class?: never; className?: never};

export type OmitUndefined<T> = T extends undefined ? never : T;
export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

// variants: {
//   [K in keyof V["variants"]]?: keyof V["variants"][K];
// };

export type Config = {
  /**
   * Whether to merge the class names with `tailwind-merge` library.
   * It's avoid to have duplicate tailwind classes. (Recommended)
   * @default true
   */
  merge?: boolean;
};

type StylesSchema = Record<string, Record<string, ClassValue>>;

export type SlotVariants<T extends TvStyles> = {
  [Slot in keyof T["slots"]]?: ClassValue;
};

type StylesVariants<T extends StylesSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null;
};

type StylesVariantsMulti<T extends StylesSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | StringToBoolean<keyof T[Variant]>[];
};

export type TvStyles<T = {}> = T extends StylesSchema
  ? {
      base?: ClassValue;
      slots?: string[];
      variants?: T;
      defaultVariants?: StylesVariants<T>;
      compoundVariants?: (T extends StylesSchema
        ? (StylesVariants<T> | StylesVariantsMulti<T>) & ClassProp
        : ClassProp)[];
    }
  : never;

export type TvStylesProps = StylesVariants<StylesSchema> & ClassProp;
