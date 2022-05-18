import React from "react";
import {withRouter} from "react-router-dom";
import classnames from "classnames";
import Styled from "styled-components";
import {ElementsThemed} from "components";
import styles from "./nav.module.scss";

const {ThemeButton} = ElementsThemed;

const NavLink = (props) => {
  return (
    <li {...props} ref={props.innerRef}>
      {props.children}
    </li>
  );
};

const NavItem = withRouter(
  ({name, type, className, innerRef, location, history, onNavClick}) => {
    const classes = classnames(styles["nav-item"], "nav-item", className);
    return (
      <ThemeButton
        type={type}
        Component={NavLink}
        id={`${name}-nav`}
        innerRef={innerRef}
        className={classes}
        onClick={() => onNavClick(name)}
      >
        {name}
      </ThemeButton>
    );
  },
);

export default Styled(NavItem)`
  ${(props) => {
    const {
      theme: {buttons},
    } = props;
    const color = buttons[props.type]
      ? buttons[props.type].stateBackgroundColors.selected
      : "#000";
    return `
      &[active="1"]{
        background-color:${props.theme.colors[color]};
      }

      &:not([active]), &[active="0"]{
        border-bottom-color: transparent;
      }`;
  }}
`;
