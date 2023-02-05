import fs from "fs";
import path from "path";

const writeFileSync = (content) => {
  fs.writeFileSync(path.join(__dirname, "generated.d.ts"), content);
};

const generateScreensType = (screens) => {
  return `export type TVGeneratedScreens = ${Object.keys(screens)
    .map((screen) => `"${screen}"`)
    .join(" | ")};\n`;
};

export const generateTypes = (theme) => {
  queueMicrotask(() => {
    if (theme?.screens) {
      const screens = generateScreensType(theme.screens);

      writeFileSync(screens);
    }
  });
};
