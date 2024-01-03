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
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};

export default config;
