// eslint-disable-next-line react/button-has-type
import React from "react";
import classnames from "classnames";
import Styled from "styled-components";
import {useTemplateContext} from "../../providers/template";
import {styleObjectToCSSString, selectorGenerator} from "../utils";
import styles from "./ThemeText.module.css";

const withTemplate = (Component) => (props) => {
  const {
    parsedTheme: {labels},
  } = useTemplateContext();

  return <Component {...props} label={labels[props.type]} />;
};

const ThemeText = Styled(
  ({type, children, className, label, Component = "span", ...props}) => {
    const classes = classnames(
      props.block ? styles.block : undefined,
      className,
    );
    return (
      <Component className={classes} {...props}>
        {children}
      </Component>
    );
  },
)`
  ${({label: {view, ...label}}) => {
    let t = "";
    if (view) {
      const CSSString = Object.entries(view).reduce((accu, [key, value]) => {
        if (!Object.entries(value).length) return accu;
        const selector = selectorGenerator(key, "&");
        if (selector) {
          accu.push(styleObjectToCSSString(selector, value));
        }
        return accu;
      }, []);
      t = CSSString;
    }
    const x = Object.entries(label)
      .map(([style, value2]) => `${style}: ${value2}`)
      .join(";");
    return [x, t].join(";");
  }}
`;

export default React.memo(withTemplate(ThemeText));
