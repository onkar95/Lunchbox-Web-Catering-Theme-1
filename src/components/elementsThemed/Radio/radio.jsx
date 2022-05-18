import React from "react";
import Styled from "styled-components";
import classnames from "classnames";
import withButton from "../withButton";
import {styleObjectToCSSString, radioSelectorGenerator} from "../utils";
import css from "./radio.module.css";

const Radio = Styled(({className, type, button, label, ...props}) => {
  const classes = classnames(css.checkbox, className);
  return (
    <span className={classes}>
      <input
        className={css.radio}
        type="checkbox"
        checked={!!props.value}
        {...props}
      />
      <label className={css.label} />
      {label && <div className={css.label}>{label}</div>}
    </span>
  );
})`
  ${({button}) => {
    const CSSString = Object.entries(button.button).reduce(
      (accu, [key, value]) => {
        if (!Object.entries(value).length) return accu;
        const selector = `${radioSelectorGenerator(key, "input")} ~ label`;
        if (selector) {
          accu.push(styleObjectToCSSString(selector, value));
        }
        return accu;
      },
      [],
    );
    return CSSString.join("");
  }}
`;

export default withButton(Radio);
