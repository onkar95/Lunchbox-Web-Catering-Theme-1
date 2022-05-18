// eslint-disable-next-line react/button-has-type
import React from "react";
import classnames from "classnames";
import Styled from "styled-components";
import {Button} from "components/elements";
import withButton from "../withButton";
import {styleObjectToCSSString, selectorGenerator} from "../utils";
import styles from "./button.module.css";

const ThemeButton = Styled(
  ({
    type,
    children,
    className,
    htmlType,
    button,
    "data-test": dataTest,
    Component = Button,
    ...props
  }) => {
    const classes = classnames(styles.base, className);
    return (
      <Component
        className={classes}
        {...props}
        ref={props.innerRef}
        type={htmlType}
      >
        <span>{children}</span>
      </Component>
    );
  },
)`

  ${({button}) => {
    const buttonCSSString = Object.entries(button.button).reduce(
      (accu, [key, value]) => {
        if (!Object.entries(value).length) return accu;
        const selector = selectorGenerator(key, "&&");
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
        const selector = selectorGenerator(key, "&&");
        if (selector) {
          accu.push(styleObjectToCSSString(`${selector} span`, value));
        }
        return accu;
      },
      [],
    );
    return [...buttonCSSString, ...textCSSString].join("");
  }}
`;
export default React.memo(withButton(ThemeButton));
