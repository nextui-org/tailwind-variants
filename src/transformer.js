// Ignore the `initial`
// TODO: respect tailwind config
const screens = ["xs", "sm", "md", "lg", "xl", "2xl"];

const regExp = {
  tv: /tv\({[\s\S]*?}\)/g,
  tvContent: /\({[\s\S]*?}\)/g,
  comment: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,
  blankLine: /^\s*$(?:\r\n?|\n)/gm,
  ext: /\.\w+/g,
};

const isArray = (param) => Array.isArray(param);

const isString = (param) => typeof param === "string";

const isObject = (param) => typeof param === "object";

const isFunction = (param) => typeof param === "function";

const isEmpty = (param) => {
  if (!param) return true;
  if (isArray(param) && param.length === 0) return true;
  if (isString(param) && param.length === 0) return true;
  if (isObject(param) && Object.keys(param).length === 0) return true;

  return false;
};

const pipeline = (...funcs) => {
  return (input) => funcs.reduce((acc, func) => func(acc), input);
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
    // TODO: avoid potential security issues
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
  if (isString(classNames)) return classNames.split(" ");
  if (isArray(classNames)) return flatClassNames(classNames);
  if (isObject(classNames)) return getSlots(classNames);

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

export const tvTransformer = (content) => {
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

const getExtensions = (files) => {
  const extensions = files
    .map((file) => {
      if (isObject(file) && file.extension) return file.extension;

      let fileExt = file.match(regExp.ext);

      if (!fileExt) {
        fileExt = file.split("{");
        fileExt = fileExt.pop().replace("}", "").split(",");
      }

      return fileExt.map((ext) => ext.replace(".", "").split(".")).flat();
    })
    .flatMap((ext) => ext);

  return Array.from(new Set(extensions)).filter((ext) => ext !== "html");
};

export const withTV = (tailwindConfig) => {
  let config = Object.assign({}, tailwindConfig);

  // invalid content
  if (isEmpty(config?.content) || isString(config.content)) return config;

  if (isArray(config.content)) {
    const extensions = getExtensions(config.content);
    const transformEntries = extensions.map((ext) => [ext, tvTransformer]);

    config.content = {};
    config.content.files = tailwindConfig.content;
    config.content.transform = Object.fromEntries(transformEntries);

    return config;
  }

  if (isObject(config.content)) {
    // invalid content files
    if (isEmpty(config.content?.files) || isString(config.content.files)) return config;

    if (isEmpty(config.content?.transform)) {
      const extensions = getExtensions(config.content.files);
      const transformEntries = extensions.map((ext) => [ext, tvTransformer]);

      config.content.transform = Object.fromEntries(transformEntries);

      return config;
    }

    // extend transform function
    if (isFunction(config.content.transform)) {
      const {transform: inputTransform} = tailwindConfig.content;
      const extensions = getExtensions(config.content.files);
      const transformEntries = extensions.map((ext) => [
        ext,
        pipeline(tvTransformer, inputTransform),
      ]);

      config.content.transform = Object.fromEntries(transformEntries);

      return config;
    }

    // extend transform object
    if (isObject(config.content.transform)) {
      const {transform: inputTransform} = tailwindConfig.content;
      const extensions = getExtensions(config.content.files);
      const transformEntries = extensions.map((ext) => [
        ext,
        pipeline(tvTransformer, inputTransform[ext] && inputTransform[ext]),
      ]);

      config.content.transform = Object.fromEntries(transformEntries);

      return config;
    }

    return config;
  }

  return config;
};
