import {CxOptions, CxReturn} from "class-variance-authority";

import {TVConfig} from "./config";

export declare const cleanArray: (array: string[]) => string[];

export declare const falsyToString: <T extends unknown>(value: T) => string | T;

export declare const cx: <T extends CxOptions>(...classes: T) => (config: TVConfig) => CxReturn;

export type ClassPropKey = "class" | "className";
export type ClassValue = string | string[] | null | undefined;

export type ClassProp<V extends unknown = ClassValue> =
  | {
      class: V;
      className?: never;
    }
  | {class?: never; className: V}
  | {class?: never; className?: never};

export type OmitUndefined<T> = T extends undefined ? never : T;
export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type StringArrayToFunctions<T extends string[], Props = {}> = {
  [K in T[number]]: (props?: Props) => string;
};

type Slots = ["trigger", "item", "list"];

type SlotsReturnType = StringArrayToFunctions<Slots>;
