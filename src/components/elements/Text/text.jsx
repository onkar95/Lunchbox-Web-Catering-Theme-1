import React from "react";
import Styled from "styled-components";
import classnames from "classnames";
import styles from "./text.module.css";

const colorSelector = (props) => {
  let value = "";
  switch (props.color) {
    case "black":
      value = props.theme.colors.baseBlack;
      break;
    case "white":
      value = props.theme.colors.baseWhite;
      break;

    case "gray":
      value = props.theme.colors.baseGray;
      break;
    case "alt":
      value = props.theme.colors.alternateGray;
      break;

    case "bg":
      value = props.theme.colors.backgroundGray;
      break;
    case "warning":
      value = props.theme.colors.baseWarning;
      break;

    case "primary":
      value = props.theme.colors.accentLight;
      break;
    case "primaryDark":
      value = props.theme.colors.accentDark;
      break;

    case "secondary":
      value = props.theme.colors.secondary;
      break;
    case "secondaryDark":
      value = props.theme.colors.secondaryDark;
      break;

    case "link":
      value = props.theme.colors.baseLink;
      break;

    default:
      value = props.theme.colors.baseGray;
  }
  return value;
};

const TextBase = Styled(({className, letterCase, children, ...props}) => {
  const classes = classnames(
    styles[letterCase] ? styles[letterCase] : undefined,
    className,
  );
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
})`
  color: ${colorSelector};
`;

const T1 = Styled(TextBase)`
  font-family: '${(props) => props.theme.fonts.body1.name}';
  font-size: ${(props) => `${props.theme.fonts.body1.size}px`};
`;
const T2 = Styled(TextBase)`
  font-family: ${(props) => props.theme.fonts.body2.name};
  font-size: ${(props) => `${props.theme.fonts.body2.size}px`};
`;

export {TextBase, T1, T2};
export default {
  T1,
  T2,
  TextBase,
};
