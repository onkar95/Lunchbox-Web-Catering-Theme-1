import React, {useState, createContext, useContext, Children} from "react";
import cloneDeep from "lodash/cloneDeep";
import themeData from "ThemeData";
import templateParsers from "../../Theme/templateParsers";

const TemplateContext = createContext();

const parseTheme = ({fonts, colors, elements}) => {
  const views = templateParsers.viewToCSS(elements.views, {colors, fonts});
  const labels = templateParsers.labelToCSS(elements.labels, {
    colors,
    elements,
    fonts,
  });
  const buttons = templateParsers.buttonToCSS(elements.buttons, views, labels, {
    colors,
    fonts,
  });
  return {buttons, labels, views};
};

const TemplateStore = ({children}) => {
  const [theme] = useState(() => {
    const data = cloneDeep(themeData);
    Object.keys(data.colors).forEach((color) => {
      data.colors[color] = `#${data.colors[color]}`;
    });
    return data;
  });
  const [parsedTheme] = useState(parseTheme(theme));
  const [style] = useState("normal");

  const contextValues = {
    parsedTheme,
    style,
    theme,
  };

  return (
    <TemplateContext.Provider value={contextValues}>
      {typeof children === "function"
        ? Children.only(children(contextValues))
        : Children.only(children)}
    </TemplateContext.Provider>
  );
};

const useTemplateContext = () => {
  const contextValues = useContext(TemplateContext);
  if (!contextValues) {
    throw new Error(
      "useTemplateContext must be used within TemplateContext Provider",
    );
  }
  return contextValues;
};

export {useTemplateContext};

export default {
  TemplateContext,
  TemplateStore,
};
