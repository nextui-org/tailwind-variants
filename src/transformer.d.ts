import type {Config} from "tailwindcss/types/config";

export type WithTV = {
  <C extends Config = {}>(tvConfig: Config): C;
};

export declare const withTV: WithTV;

export type TVTransformer = {(content: string): string};

export declare const tvTransformer: TVTransformer;
