import {CxOptions, CxReturn} from "class-variance-authority";

import {Config} from "./types";

export declare const cleanArray: (array: string[]) => string[];

export declare const falsyToString: <T extends unknown>(value: T) => string | T;

export declare const cx: <T extends CxOptions>(...classes: T) => (config: Config) => CxReturn;
