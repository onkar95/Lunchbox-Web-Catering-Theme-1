import React from "react";
import Styled from "styled-components";
import classnames from "classnames";
import styles from "./Text/text.module.css";

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
      value = props.theme.colors.baseBlack;
  }
  return value;
};

const TextBase = Styled(({className, letterCase, children, ...props}) => {
  const classes = classnames(
    styles[letterCase] ? styles[letterCase] : undefined,
    props.onClick ? styles.clickable : undefined,
    className,
  );
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
})`
  display: block;
  color: ${colorSelector};
`;

const H1 = Styled(TextBase)`
  font-family: '${(props) => props.theme.fonts.title1.name}';
  font-size: ${(props) => `${props.theme.fonts.title1.size / 16}rem`};
`;
const H2 = Styled(TextBase)`
  font-family: ${(props) => props.theme.fonts.title2.name};
  font-size: ${(props) => `${props.theme.fonts.title2.size / 16}rem`};
`;
const H3 = Styled(TextBase)`
  font-family: ${(props) => props.theme.fonts.title3.name};
  font-size: ${(props) => `${props.theme.fonts.title3.size / 16}rem`};
`;

export {H1, H2, H3};
export default {
  H1,
  H2,
  H3,
};
