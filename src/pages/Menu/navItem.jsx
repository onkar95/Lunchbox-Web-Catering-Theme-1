import React from "react";
import {withRouter} from "react-router-dom";
import classnames from "classnames";
import Styled from "styled-components";
import {ElementsThemed} from "components";
import styles from "./nav.module.css";

const {ThemeButton} = ElementsThemed;

const scrollWithOffset = (el, offset) => {
  const elementPosition = el.offsetTop - offset;
  window.scroll({
    behavior: "smooth",
    left: 0,
    top: elementPosition,
  });
};

const NavLink = (props) => {
  const hashLinkScroll = (e) => {
    if (props.onClick) props.onClick(e);

    // Push onto callback queue so it runs after the DOM is updated
    setTimeout(() => {
      const {hash} = window.location;
      if (hash !== "") {
        const id = decodeURI(hash.replace("#", ""));
        const el = document.getElementById(id);
        if (el) {
          scrollWithOffset(el, 120);
        }
      }
    }, 0);
  };
  return (
    <li {...props} ref={props.innerRef} onClick={hashLinkScroll}>
      {props.children}
    </li>
  );
};

const NavItem = withRouter(
  ({name, type, className, innerRef, location, history}) => {
    const classes = classnames(styles["nav-item"], className);
    return (
      <ThemeButton
        type={type}
        Component={NavLink}
        id={`#${name}-nav`}
        innerRef={innerRef}
        className={classes}
        onClick={() => history.push(`${location.pathname}#${name}`)}
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

    const bgcolor = buttons[props.type]
      ? buttons[props.type].stateBackgroundColors.selected
      : "#000";
    const textColor = buttons[props.type]
      ? buttons[props.type].stateTextStyles.selected.split("_")[1]
      : "#000";

    return `
    &[active="1"]{
      background-color: ${props.theme.colors[bgcolor]}
    }
    
    &[active="1"] span{
      color: ${props.theme.colors[textColor]}
    }`;
  }}
`;
// export default NavItem
