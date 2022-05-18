import React from "react";
import {useTemplateContext} from "../providers/template";

const withButton = (Component) => ({type, ...props}) => {
  const {
    parsedTheme: {buttons},
  } = useTemplateContext();
  const buttonType = buttons[type];
  return <Component {...props} button={buttonType} />;
};

export default withButton;
