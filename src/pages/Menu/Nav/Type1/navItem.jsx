import React from "react";
import {withRouter} from "react-router-dom";
import classnames from "classnames";
import Styled from "styled-components";
import {ElementsThemed} from "components";
import styles from "./nav.module.css";

const {Button} = ElementsThemed;

const NavLink = (props) => {
  return (
    <li {...props} ref={props.innerRef}>
      {props.children}
    </li>
  );
};

const NavItem = withRouter(
  ({name, type, className, innerRef, location, history, onNavClick}) => {
    const classes = classnames(styles["nav-item"], className);
    return (
      <Button
        type={type}
        Component={NavLink}
        id={`${name}-nav`}
        innerRef={innerRef}
        className={classes}
        onClick={() => onNavClick(name)}
      >
        {name}
      </Button>
    );
  },
);

export default Styled(NavItem)`
  ${(props) => {
    const {
      theme: {buttons},
    } = props;

    const color = buttons[props.type]
      ? buttons[props.type].stateTextStyles.selected.split("_")[1]
      : "#000";
    return `
      &[active="1"]{
        color: ${props.theme.colors[color]}
      }

      &[active="1"] span{
        color: ${props.theme.colors[color]}
      }`;
  }}
`;
