import {defineConfig} from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  minify: true,
  treeshake: true,
  entry: ["src/*.{js,ts}", "!src/**/*.d.ts", "!src/**/*.spec.{js,ts}", "!src/setupTests.{js,ts}"],
  target: "es2019",
  format: ["cjs", "esm"],
});
