import React from "react";
import {withRouter} from "react-router-dom";
import classnames from "classnames";
import Styled from "styled-components";
import {ThemeButton} from "components/elementsThemed";
import css from "./nav.module.css";

const NavLink = (props) => {
  return (
    <li {...props} ref={props.innerRef}>
      {props.children}
    </li>
  );
};

const NavItem = withRouter(
  ({name, type, innerRef, className, history, location, onNavClick}) => {
    const classes = classnames(css["nav-item"], className);

    return (
      <ThemeButton
        type={type}
        Component={NavLink}
        id={`#${name}-nav`}
        innerRef={innerRef}
        className={classes}
        onClick={() => onNavClick(name)}
      >
        <span className={css.name}>{name}</span>
        <div className={css.shape} />
      </ThemeButton>
    );
  },
);
NavItem.displayName = "NavItemType4";

export default Styled(NavItem)`
  ${(props) => {
    const {
      theme: {colors, buttons},
    } = props;
    const color = buttons[props.type]
      ? buttons[props.type].stateBackgroundColors.selected
      : "#000";
    const textColor = buttons[props.type]
      ? buttons[props.type].stateBackgroundColors.disabled
      : "#000";

    return `
      &[active="1"] .${css.shape}{
        background-color: ${colors[color]};
      }
      &[active="1"] .${css.shape} span{
        color: ${colors[textColor]}
      }
      &:not([active]) .${css.shape}, &[active="0"] .${css.shape}{
        background-color: transparent;
      }
      
      &:not([active]) .${css.shape}, &[active="0"] span{
        color: ${colors[textColor]}
      }
      `;
  }}
`;
