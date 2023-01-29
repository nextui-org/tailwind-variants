// Ignore the `initial`
// TODO: should respect tailwind config;
const screens = ["xs", "sm", "md", "lg", "xl", "2xl"];

const regExp = {
  tv: new RegExp(/tv\({[\s\S]*?}\)/g),
  tvContent: new RegExp(/\({[\s\S]*?}\)/g),
  comment: new RegExp(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm),
  blankLine: new RegExp(/^\s*$(?:\r\n?|\n)/gm),
};

const isEmpty = (content) => {
  if (!content) return true;
  if (Array.isArray(content) && content.length === 0) return true;
  if (typeof content === "string" && content.length === 0) return true;
  if (typeof content === "object" && Object.keys(content).length === 0) return true;

  return false;
};

const getCleanContent = (content) => {
  const removeComment = content.replace(regExp.comment, "$1").toString();
  const removeBlankLine = removeComment.replace(regExp.blankLine, "").toString();

  return removeBlankLine.match(regExp.tv);
};

const getTVObjects = (content) => {
  const tvStrArray = getCleanContent(content);

  if (isEmpty(tvStrArray)) return;

  return tvStrArray.map((item) => {
    const str = item.toString();
    const tv = str.match(regExp.tvContent).toString();

    // TODO: `eval` should be avoided
    return eval(
      tv
        .replaceAll("`", '"')
        .replaceAll("'", '"')
        .replaceAll(/\s{2,}/g, " ")
        .replaceAll(/(\r\n|\n|\r)/gm, "")
        .trim(),
    );
  });
};

const transformContent = (tv) => {
  const {variants = {}} = tv;

  if (isEmpty(variants)) return;

  let responsive = {};

  for (const [variantKey, variant] of Object.entries(variants)) {
    if (isEmpty(variant)) continue;

    responsive[variantKey] = {};

    for (const [variantType, original] of Object.entries(variant)) {
      if (isEmpty(original)) continue;

      const originalClasses = original.split(" ");

      if (isEmpty(originalClasses)) continue;

      responsive[variantKey][variantType] = {};

      for (const screen of screens.values()) {
        let responsiveClasses = ``;

        originalClasses.forEach((item) => {
          responsiveClasses += `${screen}:${item} `;
        });

        responsive[variantKey][variantType].original = original;
        responsive[variantKey][variantType][screen] = responsiveClasses.trimEnd();
      }
    }
  }

  return responsive;
};

const tvTransformer = (content) => {
  try {
    // TODO: support package alias
    const isIncluded = content.includes("tailwind-variants");

    if (!isIncluded) return content;

    const tvs = getTVObjects(content);

    if (isEmpty(tvs)) return content;

    const transformedContent = tvs.map((tv) => {
      return transformContent(tv);
    });

    const concatedContent = content.concat(
      `\n/*\n\n${JSON.stringify(transformedContent, undefined, 2)}\n\n*/\n`,
    );

    return concatedContent;
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
