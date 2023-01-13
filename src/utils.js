import {cx as cxBase} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

export const cleanArray = (array) => array.filter((item) => item);

export const falsyToString = (value) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

export const cx =
  (...classes) =>
  (config = {}) =>
    config.merge ? twMerge(cxBase(classes)) : cxBase(classes);
