import {TailwindConfig} from "./transformer";

export type GenerateTypes = {
  (theme: TailwindConfig["theme"]): void;
};

export declare const generateTypes: GenerateTypes;
