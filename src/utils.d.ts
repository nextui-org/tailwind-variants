import {CxOptions, CxReturn} from "class-variance-authority";

import {TVConfig} from "./config";

export declare const cleanArray: (array: string[]) => string[] | undefined;

export declare const falsyToString: <T extends unknown>(value: T) => string | T;

export declare const isNotEmptyObject: (obj: object) => boolean;

export declare const cx: <T extends CxOptions>(...classes: T) => (config: TVConfig) => CxReturn;

export declare const removeDuplicates: <T extends unknown>(array: T[]) => T[];

export declare type ClassPropKey = "class" | "className";
export declare type ClassValue = string | string[] | null | undefined;

export declare type ClassProp<V extends unknown = ClassValue> =
  | {
      class: V;
      className?: never;
    }
  | {class?: never; className: V}
  | {class?: never; className?: never};

export declare type OmitUndefined<T> = T extends undefined ? never : T;

export declare type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export declare type StringArrayToFunctions<T extends string[], Props = {}> = {
  [K in T[number]]: (props?: Props) => string;
};

export declare type AddItemToArray<T extends unknown[], V> = [V, ...T];
