import React from "react";
import {useTemplateContext} from "../providers/template";

const withTemplate = (Component, name) => (props) => {
  const {style, theme} = useTemplateContext();
  return <Component style={theme.styles[style][name]} {...props} />;
};

export default withTemplate;
