const parseView = (value, theme) => {
  const stateStylings = {
    disabled: {},
    selected: {},
    unselected: {},
  };

  Object.entries(value).forEach(([key, style]) => {
    if (!style) return;
    switch (key) {
      case "cornerRadius":
        stateStylings.unselected["border-radius"] = `${style}px`;
        break;
      case "backgroundColor":
        stateStylings.unselected["background-color"] = theme.colors[style];
        break;
      case "border": {
        stateStylings.unselected["border-width"] = `${style.width}px`;
        stateStylings.unselected["border-style"] = "solid";
        Object.entries(style.colors).forEach(([key2, style2]) => {
          if (style2) {
            switch (key2) {
              case "unselected":
                stateStylings.unselected["border-color"] = theme.colors[style2];
                break;
              case "selected":
                stateStylings.selected["border-color"] = theme.colors[style2];
                break;
              case "disabled":
                stateStylings.disabled["border-color"] = theme.colors[style2];
                break;
              default:
            }
          }
        });
        break;
      }
      default:
    }
  });

  return stateStylings;
};

export {parseView};
export default (views, theme) => {
  const parsedValues = Object.entries(views).reduce(
    (accu, [viewName, value]) => {
      if (!value) return accu;
      accu[viewName] = parseView(value, theme);
      return accu;
    },
    {},
  );

  return parsedValues;
};
