const writeFileSync = (content) => {
  const fs = require("fs");
  const path = require("path");

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

      if (typeof window === "undefined") {
        writeFileSync(screens);
      }
    }
  });
};
