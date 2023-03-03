import {TVConfig} from "./config";

export type ClassValue = string | string[] | null | undefined | ClassValue[];

export type ClassProp<V extends unknown = ClassValue> =
  | {
      class: V;
      className?: never;
    }
  | {class?: never; className: V}
  | {class?: never; className?: never};

export type OmitUndefined<T> = T extends undefined ? never : T;

export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type CxOptions = ClassValue[];

export type CxReturn = string;

export declare const cx: <T extends CxOptions>(...classes: T) => (config: TVConfig) => CxReturn;

export declare const falsyToString: <T extends unknown>(value: T) => string | T;

export declare const isEmptyObject: (obj: object) => boolean;

export declare const joinObjects: (obj1: object, obj2: object) => object;

export declare const mergeObjects: (obj1: object, obj2: object) => object;

export declare const removeExtraSpaces: (str: string) => string;

export declare const flatMergeArrays: <T>(...arrays: T[]) => T;
