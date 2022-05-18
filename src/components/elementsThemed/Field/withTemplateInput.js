import React from "react";
import {useTemplateContext} from "../../providers/template";

const withTemplateInput = (Component) => (props) => {
  const {
    parsedTheme: {labels},
    theme: {
      elements: {inputs},
    },
  } = useTemplateContext();

  const inputType = inputs[props.type];
  const textLabel = labels[inputType.field];
  const placeholderLabel = labels[inputType.placeholder];

  return (
    <Component
      {...props}
      input={{...inputType, field: textLabel, placeholder: placeholderLabel}}
    />
  );
};

export default withTemplateInput;
