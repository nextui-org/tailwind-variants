import type {Config} from "tailwindcss/types/config";
import type {DefaultTheme} from "tailwindcss/types/generated/default-theme";

export type DefaultScreens = keyof DefaultTheme["screens"];

export type WithTV = {
  <C extends Config>(tvConfig: C, config?: TVTransformerConfig): C;
};

export declare const withTV: WithTV;

export type TVTransformerConfig = {
  /**
   * Optional array of custom aliases where Tailwind Variants might be resolved.
   * This can be useful if you're using a custom path to import Tailwind Variants.
   *
   * @example ["@/lib/tv"]
   */
  aliases?: string[];
};

export type TVTransformer = {
  (content: string, screens?: string[] | DefaultScreens[], config?: TVTransformerConfig): string;
};

export declare const tvTransformer: TVTransformer;
