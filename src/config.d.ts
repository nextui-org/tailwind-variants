import type {extendTailwindMerge} from "tailwind-merge";
import type {TVVariants} from "./index";
import type {TVGeneratedScreens} from "./generated";

type MergeConfig = Parameters<typeof extendTailwindMerge>[0];
type LegacyMergeConfig = Extract<MergeConfig, {extend?: unknown}>["extend"];

export type TWMConfig = {
  /**
   * Whether to merge the class names with `tailwind-merge` library.
   * It's avoid to have duplicate tailwind classes. (Recommended)
   * @see https://github.com/dcastil/tailwind-merge/blob/v2.2.0/README.md
   * @default true
   */
  twMerge?: boolean;
  /**
   * The config object for `tailwind-merge` library.
   * @see https://github.com/dcastil/tailwind-merge/blob/v2.2.0/docs/configuration.md
   */
  twMergeConfig?: MergeConfig & LegacyMergeConfig;
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
