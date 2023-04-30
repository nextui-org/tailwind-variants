import type {Config} from "tailwindcss/types/config";
import type {DefaultTheme} from "tailwindcss/types/generated/default-theme";

export type DefaultScreens = keyof DefaultTheme["screens"];

export type WithTV = {
  <C extends Config>(tvConfig: C): C;
};

export declare const withTV: WithTV;

export type TVTransformer = {
  (content: string, screens?: string[] | DefaultScreens[]): string;
};

export declare const tvTransformer: TVTransformer;
