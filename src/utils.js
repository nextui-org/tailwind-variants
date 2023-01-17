import {cx as cxBase} from "class-variance-authority";
import {twMerge as twMergeBase, extendTailwindMerge} from "tailwind-merge";

// regex to remove all non-word characters
const nonWordRegex = /[\W_]+/g;

export const cleanArray = (array) => {
  if (!array || !Array.isArray(array)) return null;

  return array.filter?.((item) => item && !String(item).match(nonWordRegex)).map(String);
};

export const falsyToString = (value) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

export const isNotEmptyObject = (obj) => obj && Object.keys(obj).length > 0;

export const cx =
  (...classes) =>
  (config = {}) => {
    if (!config.twMerge) {
      return cxBase(classes);
    }

    const twMerge = isNotEmptyObject(config.twMergeConfig)
      ? extendTailwindMerge(config.twMergeConfig)
      : twMergeBase;

    return twMerge(cxBase(classes));
  };
