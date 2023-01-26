import {TVConfig} from "./config";

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

export type CxOptions = ClassValue[];

export type CxReturn = string;

export declare const cx: <T extends CxOptions>(...classes: T) => (config: TVConfig) => CxReturn;

export declare const falsyToString: <T extends unknown>(value: T) => string | T;

export declare const isNotEmptyObject: (obj: object) => boolean;

export declare const joinObjects: (obj1: object, obj2: object) => object;

export declare const removeExtraSpaces: (str: string) => string;
