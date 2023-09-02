export const falsyToString = (value) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

export const isEmptyObject = (obj) =>
  !obj || typeof obj !== "object" || Object.keys(obj).length === 0;

export const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

function flat(arr, target) {
  arr.forEach(function (el) {
    if (Array.isArray(el)) flat(el, target);
    else target.push(el);
  });
}

export function flatArray(arr) {
  const flattened = [];

  flat(arr, flattened);

  return flattened;
}

export const flatMergeArrays = (...arrays) => flatArray(arrays).filter(Boolean);

export const mergeObjects = (obj1, obj2) => {
  const result = {};
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  for (const key of keys1) {
    if (keys2.includes(key)) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (typeof val1 === "object" && typeof val2 === "object") {
        result[key] = mergeObjects(val1, val2);
      } else {
        result[key] = val2 + " " + val1;
      }
    } else {
      result[key] = obj1[key];
    }
  }

  for (const key of keys2) {
    if (!keys1.includes(key)) {
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
