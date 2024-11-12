import {relative} from "path";

import {ESLint} from "eslint";

const removeIgnoredFiles = async (files) => {
  const cwd = process.cwd();
  const eslint = new ESLint();
  const relativePaths = files.map((file) => relative(cwd, file));
  const isIgnored = await Promise.all(relativePaths.map((file) => eslint.isPathIgnored(file)));
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);

  return filteredFiles.join(" ");
};


const lintStaged = {
  // *.!(js|ts|jsx|tsx|d.ts)
  "**/*.{js,cjs,mjs,ts,jsx,tsx,json,md}": async (files) => {
    const filesToLint = await removeIgnoredFiles(files);

    return [`prettier --config .prettierrc.json --ignore-path --write ${filesToLint}`];
  },
  "**/*.{js,cjs,mjs,ts,jsx,tsx}": async (files) => {
    const filesToLint = await removeIgnoredFiles(files);

    return [`eslint -c .eslintrc.json --max-warnings=0 --fix ${filesToLint}`];
  },
};

export default lintStaged;
