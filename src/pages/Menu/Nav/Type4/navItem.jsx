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
      ? props.theme.colors[
          `${buttons[props.type].stateBackgroundColors.selected}`
        ]
      : "#000";

    return `
      &[active="1"]{
        border:2px solid ${color}
        border-radius:25px
        padding:5px 15px;
        background-color:transparent !important;
      }

      &:active{
        background-color:transparent !important;
      }

      &[active="1"] span{
        color:${color}
      }

      &:not([active]), &[active="0"]{
        border-bottom-color: transparent;
      }`;
  }}
`;
