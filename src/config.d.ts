import type {Config as TwMergeConfig} from "tailwind-merge";
import type {TVVariants} from "./index";
import type {TVGeneratedScreens} from "./generated";

export type TWMConfig = {
  /**
   * Whether to merge the class names with `tailwind-merge` library.
   * It's avoid to have duplicate tailwind classes. (Recommended)
   * @see https://github.com/dcastil/tailwind-merge/blob/v1.8.1/README.md
   * @default true
   */
  twMerge?: boolean;
  /**
   * The config object for `tailwind-merge` library.
   * @see https://github.com/dcastil/tailwind-merge/blob/v1.8.1/docs/configuration.md
   */
  twMergeConfig?: Partial<TwMergeConfig>;
};

export type TVConfig<
  // @ts-expect-error
  V extends TVVariants | undefined = undefined,
  // @ts-expect-error
  EV extends TVVariants | undefined = undefined,
> = {
  /**
   * Whether to enable responsive variant transform.
   * Which variants or screens(breakpoints) for responsive variant transform.
   * @default false
   */
  responsiveVariants?:
    | boolean
    | TVGeneratedScreens[]
    | {[K in keyof V | keyof EV]?: boolean | TVGeneratedScreens[]};
} & TWMConfig;
