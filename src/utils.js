import {twMerge as twMergeBase, extendTailwindMerge} from "tailwind-merge";

export const cxBase = (...classes) => classes.flat(Infinity).filter(Boolean).join(" ");

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

export const joinObjects = (obj1, obj2) => {
  const result = {};

  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return result;
  }

  Object.keys(obj1).forEach((key) => {
    if (obj2[key]) {
      result[key] = cxBase([obj1[key], obj2[key]]);
    } else {
      result[key] = obj1[key];
    }
  });

  return result;
};

export const removeExtraSpaces = (str) => {
  if (!str || typeof str !== "string") {
    return str;
  }

  return str.replace(/\s+/g, " ").trim();
};
