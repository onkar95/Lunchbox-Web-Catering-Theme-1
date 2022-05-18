const loadValidationHelpers = (themeData) => {
  const {
    fonts,
    colors,
    elements: {buttons, labels, views, cells, dialogues, inputs, segmentViews},
  } = themeData;
  /**
   * This is transforming each of the Types into testable regex like
   * /(baseBlack\b)|(baseWhite\b)|(baseGray\b)|(alternateGray\b)|(backgroundGray\b)|(baseWarning\b)|(accentLight\b)|(baseLink\b)/
   * for example. Where \b allows us to match the entire word
   *
   * @param obj
   */
  const objToRegex = (obj) =>
    new RegExp([...Object.keys(obj)].map((key) => `(${key}\\b)`).join("|"));

  return {
    buttonTypes: objToRegex(buttons),
    cellTypes: objToRegex(cells),
    colorTypes: objToRegex(colors),
    dialogueTypes: objToRegex(dialogues),
    fontTypes: objToRegex(fonts),
    inputTypes: objToRegex(inputs),
    labelTypes: objToRegex(labels),
    segmentViewTypes: objToRegex(segmentViews),
    viewTypes: objToRegex(views),
  };
};

const mapErrors = (results) => {
  const errorList = [];
  // if there is an error we want to push it in an array that we can display or notify
  results.forEach((result) => {
    if (result.err) {
      const detailedErrorMessages = result.err.errors.map(
        (error) => `Inside ${result.key}: ${error}`,
      );
      errorList.push(detailedErrorMessages);
    }
  });

  // if there are no errors, the validation is successful
  return errorList;
};

const validateData = (schema, data, helpers = {}) => {
  return Object.entries(data).map(([key, dataValues]) => {
    return schema(helpers)
      .validate(dataValues, {abortEarly: false})
      .catch((err) => {
        return {err, key};
      });
  });
};

export {loadValidationHelpers, mapErrors, validateData};

export default loadValidationHelpers;
