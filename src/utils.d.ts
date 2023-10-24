export declare const falsyToString: <T>(value: T) => T | string;

export declare const isEmptyObject: (obj: unknown) => boolean;

export declare const flatArray: <T extends unknown[]>(array: T) => T;

export declare const flatMergeArrays: <T extends unknown[]>(...arrays: T[]) => T;

export declare const mergeObjects: (obj1: unknown, obj2: unknown) => unknown;

export declare const removeExtraSpaces: (str: string) => string;

export declare const isEqual: (obj1: object, obj2: object) => boolean;

export declare const isBoolean: (value: unknown) => boolean;
