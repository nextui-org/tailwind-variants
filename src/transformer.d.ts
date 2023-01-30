import type {Config} from "tailwindcss/types/config";

export type TailwindConfig = Config;

export type WithTV = {
  <TC extends TailwindConfig>(tvConfig: TailwindConfig): TC;
};

export declare const withTV: WithTV;

export type TVTransformer = {(content: string): string};

export declare const tvTransformer: TVTransformer;
