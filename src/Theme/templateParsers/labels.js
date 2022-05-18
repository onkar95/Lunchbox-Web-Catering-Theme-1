import {parseView} from "./views";

const parseLabel = (value, theme) => {
  return {
    color: theme.colors[value.textColor],
    "font-family": theme.fonts[value.font].name,
    "font-size": `${theme.fonts[value.font].size}px`,
    "font-weight": `${theme.fonts[value.font].weight || 400}`,
    "text-transform": value.isUppercase ? "uppercase" : "initial",
    view: value.view
      ? parseView(theme.elements.views[value.view], theme)
      : null,
  };
};

export default (labels, theme) => {
  const parsedValues = Object.entries(labels).reduce((accu, [name, value]) => {
    if (!value) return accu;
    accu[name] = parseLabel(value, theme);
    return accu;
  }, {});
  // `.${name}{
  //   text-transform: ${rules.isUppercase ? 'uppercase' : 'initial'};
  //   font-family: ${theme.fonts[rules.font].name};
  //   font-size: ${theme.fonts[rules.font].size}px;
  //   color: ${theme.colors[rules.textColor]};
  // }`,
  return parsedValues;
};
