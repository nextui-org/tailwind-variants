import fs from "fs";
import path from "path";

export const generateTypes = (theme) => {
  if (!theme?.screens) return;

  const dynamicTypeDeclarationPath = path.join(__dirname, "dynamic.d.ts");

  const content = `export type TVDynamicScreens = ${Object.keys(theme.screens)
    .map((screen) => `"${screen}"`)
    .join(" | ")};`;

  fs.writeFileSync(dynamicTypeDeclarationPath, content);
};
