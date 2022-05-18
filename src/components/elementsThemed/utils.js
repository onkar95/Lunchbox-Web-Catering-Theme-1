const styleObjectToString = (styleObject) =>
  Object.entries(styleObject)
    .map(([style, value2]) => `${style}: ${value2}`)
    .join(";");

const styleObjectToCSSString = (selector, styleObject) => `${selector} {
    ${styleObjectToString(styleObject)}
  }`;

const selectorGenerator = (key, className) => {
  switch (key) {
    case "unselected": {
      return className;
    }
    case "selected": {
      return `${className}:active`;
    }
    case "disabled": {
      return `${className}:disabled`;
    }
    default:
      return "";
  }
};

const radioBtnSelectorGenerator = (key, className) => {
  switch (key) {
    case "unselected": {
      return className;
    }
    case "selected": {
      return `${className}.active`;
    }
    case "disabled": {
      return `${className}:disabled`;
    }
    default:
      return "";
  }
};

const radioSelectorGenerator = (key, className) => {
  switch (key) {
    case "unselected": {
      return className;
    }
    case "selected": {
      return `${className}:checked`;
    }
    case "disabled": {
      return `${className}:disabled`;
    }
    default:
      return "";
  }
};

const emptyObject = (obj) => Object.entries(obj).length === 0;

export {
  styleObjectToString,
  styleObjectToCSSString,
  selectorGenerator,
  radioSelectorGenerator,
  radioBtnSelectorGenerator,
  emptyObject,
};
export default {
  emptyObject,
  radioBtnSelectorGenerator,
  radioSelectorGenerator,
  selectorGenerator,
  styleObjectToCSSString,
  styleObjectToString,
};
