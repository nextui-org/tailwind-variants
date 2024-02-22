import type {Config, FilePath, RawFile, ThemeConfig} from "tailwindcss/types/config";
import type {DefaultTheme} from "tailwindcss/types/generated/default-theme";
import type {TVVariants} from "./indexTypes";

import resolveConfig from "tailwindcss/resolveConfig";

import {generateTypes} from "./generator";

const regExp = {
  tv: /tv\s*\(((\([^\)]*?\)|\[[^\]]*?\]|.)*?)\)/gs,
  tvExtend: /extend:\s*\w+(,| )\s*/,
  comment: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,
  blankLine: /^\s*$(?:\r\n?|\n)/gm,
  extension: /\.\w+/g,
};

const isArray = (param: unknown): param is any[] => Array.isArray(param);

const isString = (param: unknown): param is string => typeof param === "string";

const isObject = <T = Object>(param: unknown): param is T =>
  typeof param === "object" && param !== null && !Array.isArray(param);

const isBoolean = (param: unknown): param is boolean => typeof param === "boolean";

const isFunction = (param: unknown): param is Function => typeof param === "function";

const isEmpty = (param: unknown): boolean => {
  if (!param) return true;
  if (isArray(param) && param.length === 0) return true;
  if (isString(param) && param.length === 0) return true;

  return isObject(param) && Object.keys(param).length === 0;
};

const pickByKeys = (target, keys) => {
  const result = {};
  const length = keys.length;
  const hasOwnProp = Object.prototype.hasOwnProperty;

  for (let i = 0; i < length; i++) {
    const key = keys[i];

    if (hasOwnProp.call(target, key)) result[key] = target[key];
  }

  return result;
};

const printError = (message, error) => {
  const newIssueLink = "https://github.com/nextui-org/tailwind-variants/issues/new/choose";

  /* eslint-disable no-console */
  console.log("\x1b[31m%s\x1b[0m", `${message}: ${error.message}`);
  console.log(`If you think this is an issue, please submit it at ${newIssueLink}`);
  /* eslint-enable no-console */
};

const pipeline = (...funcs) => {
  return (input) => funcs.reduce((acc, func) => func(acc), input);
};

const getCleanContent = (content: string): string[] => {
  const removeComment = content.replace(regExp.comment, "$1").toString();
  const removeBlankLine = removeComment.replace(regExp.blankLine, "").toString();

  // TODO: support inline tv
  const removeExtend = (match: RegExpMatchArray) =>
    match[1].replace(regExp.tvExtend, "").toString();

  return Array.from(removeBlankLine.matchAll(regExp.tv), removeExtend);
};

const getTVObjects = (content: string): Array<{options: any; config: any}> => {
  const tvs = getCleanContent(content);

  if (isEmpty(tvs)) return [];

  return tvs.map((tv) => {
    if (!tv.includes("responsiveVariants")) return {};

    /**
     * avoid direct eval
     * @see https://esbuild.github.io/content-types/#direct-eval
     */
    return new Function(`
      const [options, config] = [${tv.toString()}];
      return {options, config};
    `)();
  });
};

const flatClassNames = (classNames: string[]): string[] => {
  return classNames
    .flatMap((classNameSet) => classNameSet)
    .toString()
    .replaceAll(",", " ")
    .split(" ");
};

const getSlots = (classNames: any, screens: string[]) => {
  // responsive slot
  let rs = {};

  for (const [slotName, slotClassNames] of Object.entries(classNames)) {
    rs[slotName] = {};
    rs[slotName].original = slotClassNames;

    if (isEmpty(slotClassNames)) continue;

    rs.temp = isArray(slotClassNames) ? flatClassNames(slotClassNames) : slotClassNames.split(" ");

    screens.forEach((screen) => {
      let tempClassNames = "";

      rs.temp.forEach((className) => {
        tempClassNames += `${screen}:${className} `;
      });

      rs[slotName][screen] = tempClassNames.trimEnd();
    });

    delete rs.temp;
  }

  return rs;
};

const getVariants = (classNames: unknown, screens: string[]): string[] | {} => {
  if (isString(classNames)) return classNames.split(" ");
  if (isArray(classNames)) return flatClassNames(classNames);
  if (isObject(classNames)) return getSlots(classNames, screens);

  return classNames;
};

type TransformVariantsByScreens = {
  (variants: TVVariants<any>, screens: string[] | DefaultScreens[]): void;
};

type VariantTypeStructure = Record<string, string>;

interface ResponsiveStructure {
  [variantName: string]: {
    [variantType: string]: VariantTypeStructure | string[] | undefined;
  };
}

const transformVariantsByScreens: TransformVariantsByScreens = (variants, screens) => {
  let responsive: ResponsiveStructure = {};

  Object.entries(variants).forEach(([variantName, variant]) => {
    if (isEmpty(variant)) return;

    responsive[variantName] = {};

    Object.entries(variant).forEach(([variantType, variantClassNames]) => {
      if (isEmpty(variantClassNames)) return;

      const formattedClassNames = getVariants(variantClassNames, screens);

      if (isEmpty(formattedClassNames)) return;

      responsive[variantName][variantType] = isArray(formattedClassNames)
        ? formattedClassNames
        : screens.reduce((acc, screen) => {
            acc[screen] = formattedClassNames
              .map((className) => `${screen}:${className}`)
              .join(" ");

            return acc;
          }, {});
    });
  });

  return responsive;
};

type TransformContent = {
  ({options, config}: {options: any; config: any}, screens?: string[] | DefaultScreens): void;
};

const transformContent: TransformContent = ({options, config}, screens) => {
  const variants = options?.variants ?? {};
  const responsiveVariants = config?.responsiveVariants ?? false;

  if (!responsiveVariants || isEmpty(variants)) return;

  // responsiveVariants: true
  if (isBoolean(responsiveVariants)) {
    return transformVariantsByScreens(variants, screens);
  }

  // responsiveVariants: [...]
  if (isArray(responsiveVariants)) {
    return transformVariantsByScreens(variants, responsiveVariants);
  }

  // responsiveVariants: {...}
  if (isObject(responsiveVariants)) {
    const onDemand = [];

    for (const [variantName, onDemandConfig] of Object.entries(responsiveVariants)) {
      if (!onDemandConfig || isEmpty(onDemandConfig)) continue;

      const onDemandVariants = pickByKeys(variants, [variantName]);

      const tv = {
        options: {variants: onDemandVariants},
        config: {responsiveVariants: onDemandConfig},
      };

      onDemand.push(transformContent(tv, screens));
    }

    return onDemand;
  }
};

export type DefaultScreens = keyof DefaultTheme["screens"];

export type TVTransformer = {
  (content: string, screens?: string[] | DefaultScreens[]): string;
};

export const tvTransformer: TVTransformer = (content, screens) => {
  try {
    // TODO: support package alias
    if (!content.includes("tailwind-variants")) return content;

    const tvs = getTVObjects(content);

    if (isEmpty(tvs)) return content;

    const transformed = JSON.stringify(
      tvs?.map((tv) => transformContent(tv, screens)),
      undefined,
      2,
    );

    const prefix = "\n/* Tailwind Variants Transformed Content Start\n\n";
    const suffix = "\n\nTailwind Variants Transformed Content End */\n";

    return content.concat(prefix + transformed + suffix);
  } catch (error) {
    printError("Tailwind Variants Transform Failed", error);

    return content;
  }
};

// Helper function to extract an extension from a string
const extractExtensionFromString = (file: string): string[] => {
  let fileExt: RegExpMatchArray | null | string[] = file.match(regExp.extension);

  if (!fileExt) {
    fileExt = file.split("{");
    fileExt = fileExt?.pop()?.replace("}", "").split(",") ?? [];
  }

  return fileExt.map((ext) => ext.replace(".", "").split(".")).flat();
};

// Main function to get extensions
const getExtensions = (files: (FilePath | RawFile)[]): string[] => {
  const extensions = files.flatMap((file) => {
    if (isObject<RawFile>(file) && file?.extension) {
      return file.extension;
    }

    if (isString(file)) {
      return extractExtensionFromString(file);
    }

    return [];
  });

  return Array.from(new Set(extensions)).filter((ext) => ext !== "html");
};

type ResolvedConfig<T extends Config> = ReturnType<typeof resolveConfig<T>>;

export type WithTV = {
  <C extends Config>(tvConfig: C): ResolvedConfig<C>;
};

export const withTV: WithTV = (tailwindConfig) => {
  let config = resolveConfig(tailwindConfig);

  // generate types
  generateTypes(config.theme);

  const contentFiles = config?.content?.files;

  // invalid content files
  if (isEmpty(contentFiles) || !isArray(contentFiles)) return config;

  // with tailwind configured screens
  const transformer = (content: string) => {
    return tvTransformer(content, Object.keys((config.theme as ThemeConfig)?.screens ?? {}));
  };

  // custom transform
  const customTransform = config.content.transform;

  // extend transform
  if (isEmpty(customTransform)) {
    const extensions = getExtensions(config.content.files);
    const transformEntries = extensions.map((ext) => [ext, transformer]);

    config.content.transform = Object.fromEntries(transformEntries);

    return config;
  }

  // extend transform function
  if (isFunction(customTransform)) {
    const extensions = getExtensions(config.content.files);
    const transformEntries = extensions.map((ext) => [ext, pipeline(transformer, customTransform)]);

    config.content.transform = Object.fromEntries(transformEntries);

    return config;
  }

  // extend transform object
  if (isObject(customTransform)) {
    const extensions = getExtensions(contentFiles);
    const transformEntries = extensions.map((ext) => {
      const validTransform = isFunction(customTransform[ext]);

      return validTransform
        ? [ext, pipeline(transformer, customTransform[ext])]
        : [ext, transformer];
    });

    config.content.transform = Object.fromEntries(transformEntries);

    return config;
  }

  return config;
};
