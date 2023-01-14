import type {Config as TwMergeConfig} from "tailwind-merge";

export type TVConfig = {
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
  twMergeConfig?: TwMergeConfig;
};
