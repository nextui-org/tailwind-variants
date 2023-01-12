export const cleanArray = (array) => array.filter((item) => item);

export const falsyToString = (value) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
