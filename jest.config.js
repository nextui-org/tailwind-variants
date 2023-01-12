const config = {
  rootDir: "src",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  transform: {
    "^.+\\.(t|j)sx?$": "@swc-node/jest",
  },
};

export default config;
