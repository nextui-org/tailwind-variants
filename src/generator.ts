import type {Config} from "tailwindcss/types/config";

import fs from "fs";
import path from "path";

export type GenerateTypes = {
  (theme: Config["theme"]): void;
};

type GenerateScreens = {
  (screens: Config["screens"]): string;
};

type WriteFileSyncType = {
  (content: string): void;
};

const writeFileSync: WriteFileSyncType = (content) => {
  fs.writeFileSync(path.join(__dirname, "generated.d.ts"), content);
};

const generateScreensType: GenerateScreens = (screens) => {
  return `export type TVGeneratedScreens = ${Object.keys(screens)
    .map((screen) => `"${screen}"`)
    .join(" | ")};\n`;
};

export const generateTypes: GenerateTypes = (theme) => {
  queueMicrotask(() => {
    if (theme?.screens) {
      const screens = generateScreensType(theme.screens);

      writeFileSync(screens);
    }
  });
};
