import React from "react";
import Styled from "styled-components";
import classnames from "classnames";
import withButton from "../withButton";
import {styleObjectToCSSString, radioSelectorGenerator} from "../utils";
import styles from "./radioButton.module.css";

const RadioButton = Styled(({className, type, button, children, ...props}) => {
  const classes = classnames(
    styles.wrapper,
    styles["radio-btn"],
    className,
    props.value ? "checked" : undefined,
  );
  return (
    <label className={classes}>
      <input type="checkbox" checked={!!props.value} {...props} />
      {children && <span className="label">{children}</span>}
    </label>
  );
})`

  ${({button}) => {
    const buttonCSSString = Object.entries(button.button).reduce(
      (accu, [key, value]) => {
        if (!Object.entries(value).length) return accu;
        let selector = `${radioSelectorGenerator(key, "&")}`;
        if (key === "selected") {
          selector = "&.checked";
        }
        if (selector) {
          accu.push(styleObjectToCSSString(selector, value));
        }
        return accu;
      },
      [],
    );
    const textCSSString = Object.entries(button.text).reduce(
      (accu, [key, value]) => {
        if (!value) return accu;
        let selector = `${radioSelectorGenerator(key, "&")} > span`;
        if (key === "selected") {
          selector = "&.checked > span";
        }
        if (selector) {
          accu.push(styleObjectToCSSString(selector, value));
        }
        return accu;
      },
      [],
    );
    return [...buttonCSSString, ...textCSSString].join("");
  }}

`;

export default withButton(RadioButton);
