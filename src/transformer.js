// Ignore the `initial`
// TODO: respect tailwind config
const screens = ["xs", "sm", "md", "lg", "xl", "2xl"];

const regExp = {
  tv: /tv\({[\s\S]*?}\)/g,
  tvContent: /\({[\s\S]*?}\)/g,
  comment: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,
  blankLine: /^\s*$(?:\r\n?|\n)/gm,
};

const isArray = (param) => Array.isArray(param);

const isEmpty = (param) => {
  if (!param) return true;
  if (isArray(param) && param.length === 0) return true;
  if (typeof param === "string" && param.length === 0) return true;
  if (typeof param === "object" && Object.keys(param).length === 0) return true;

  return false;
};

const getCleanContent = (content) => {
  const removeComment = content.replace(regExp.comment, "$1").toString();
  const removeBlankLine = removeComment.replace(regExp.blankLine, "").toString();

  return removeBlankLine.match(regExp.tv);
};

const getTVObjects = (content) => {
  const tvs = getCleanContent(content);

  if (isEmpty(tvs)) return;

  return tvs.map((tv) => {
    // TODO: should be improved to avoid potential security issues
    return new Function(`return ${tv.match(regExp.tvContent).toString()}`)();
  });
};

const flatClassNames = (classNames) => {
  return classNames
    .flatMap((classNameSet) => classNameSet)
    .toString()
    .replaceAll(",", " ")
    .split(" ");
};

const getSlots = (classNames) => {
  // responsive slot
  let rs = {};

  for (const [slotName, slotClassNames] of Object.entries(classNames)) {
    rs[slotName] = {};
    rs[slotName].original = slotClassNames;

    if (isEmpty(slotClassNames)) continue;

    rs.temp = isArray(slotClassNames) ? flatClassNames(slotClassNames) : slotClassNames.split(" ");

    screens.forEach((screen) => {
      let tempClassNames = "";

      rs.temp.forEach((className) => {
        tempClassNames += `${screen}:${className} `;
      });

      rs[slotName][screen] = tempClassNames.trimEnd();
    });

    delete rs.temp;
  }

  return rs;
};

const getVariants = (classNames) => {
  if (typeof classNames === "string") return classNames.split(" ");
  if (isArray(classNames)) return flatClassNames(classNames);
  if (classNames instanceof Object) return getSlots(classNames);

  return classNames;
};

const transformContent = (tv) => {
  const {variants = {}} = tv;

  if (isEmpty(variants)) return;

  let responsive = {};

  for (const [variantName, variant] of Object.entries(variants)) {
    responsive[variantName] = {};
    if (isEmpty(variant)) continue;

    for (const [variantType, variantClassNames] of Object.entries(variant)) {
      responsive[variantName][variantType] = {};
      responsive[variantName][variantType].original = variantClassNames;

      if (isEmpty(variantClassNames)) continue;

      const formattedClassNames = getVariants(variantClassNames);

      if (isEmpty(formattedClassNames)) continue;

      // slots
      if (!isArray(formattedClassNames)) {
        responsive[variantName][variantType] = formattedClassNames;
        continue;
      }

      // variants
      screens.forEach((screen) => {
        let tempClassNames = "";

        formattedClassNames.forEach((className) => {
          tempClassNames += `${screen}:${className} `;
        });

        responsive[variantName][variantType][screen] = tempClassNames.trimEnd();
      });
    }
  }

  return responsive;
};

const tvTransformer = (content) => {
  try {
    // TODO: support package alias
    if (!content.includes("tailwind-variants")) return content;

    const tvs = getTVObjects(content);

    if (isEmpty(tvs)) return content;

    const transformed = JSON.stringify(
      tvs.map((tv) => transformContent(tv)),
      undefined,
      2,
    );

    return content.concat(`\n/*\n\n${transformed}\n\n*/\n`);
  } catch (error) {
    return content;
  }
};

export const transformer = {
  tsx: (content) => tvTransformer(content),
  ts: (content) => tvTransformer(content),
  jsx: (content) => tvTransformer(content),
  js: (content) => tvTransformer(content),
};
