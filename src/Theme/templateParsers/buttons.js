import _cloneDeep from "lodash/cloneDeep";

const parseButton = (name, button, views, labels, theme) => {
  const buttonViewCSS = views[button.view] || {
    disabled: {},
    selected: {},
    unselected: {},
  };
  const stateStylings = _cloneDeep(buttonViewCSS);

  Object.entries(button.stateBackgroundColors).forEach(([key, value]) => {
    if (value) {
      stateStylings[key]["background-color"] = theme.colors[value];
    }
  });

  const textViewCSS = Object.entries(button.stateTextStyles).reduce(
    (accu, [key, value]) => {
      accu[key] = labels[value];
      return accu;
    },
    {},
  );

  return {
    button: stateStylings,
    text: textViewCSS,
  };
};

export default (buttons, views, labels, theme) =>
  Object.entries(buttons).reduce((accu, [name, rules]) => {
    accu[name] = parseButton(name, rules, views, labels, theme);
    return accu;
  }, {});
