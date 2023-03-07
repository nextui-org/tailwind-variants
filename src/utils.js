export const falsyToString = (value) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

export const isEmptyObject = (obj) =>
  !obj || typeof obj !== "object" || Object.keys(obj).length === 0;

export const flatMergeArrays = (...arrays) => [...arrays].flat().filter(Boolean);

export const mergeObjects = (obj1, obj2) => {
  let result = {};

  for (let key in obj1) {
    if (obj2?.hasOwnProperty(key)) {
      result[key] =
        typeof obj1[key] === "object"
          ? mergeObjects(obj1[key], obj2[key])
          : obj2[key] + " " + obj1[key];
    } else {
      result[key] = obj1[key];
    }
  }

  for (let key in obj2) {
    if (!result.hasOwnProperty(key)) {
      result[key] = obj2[key];
    }
  }

  return result;
};

export const removeExtraSpaces = (str) => {
  if (!str || typeof str !== "string") {
    return str;
  }

  return str.replace(/\s+/g, " ").trim();
};
