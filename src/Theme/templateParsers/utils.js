const objectToCSSString = (selector, styleObject) => `${selector} {
    ${Object.entries(styleObject)
      .map(([style, value2]) => `${style}: ${value2}`)
      .join(";")}
  }`;

const selectorGenerator = (key, className) => {
  switch (key) {
    case "unselected": {
      return `.${className}`;
    }
    case "selected": {
      return `.${className}:active`;
    }
    case "disabled": {
      return `.${className}:disabled`;
    }
    default:
      return "";
  }
};

export {objectToCSSString, selectorGenerator};

export default {
  objectToCSSString,
  selectorGenerator,
};
