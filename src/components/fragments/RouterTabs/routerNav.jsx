/* eslint-disable react/no-children-prop */
import React from "react";
import {withRouter} from "react-router-dom";
import styles from "./routerNav.module.css";

const Nav = ({children, component = "div"}) =>
  React.createElement(component, {
    children,
    className: styles.nav,
  });

const NavItem = withRouter(({children, to, location, history}) => (
  <div
    className={styles["nav-item"]}
    onClick={() => {
      location.pathname !== to && history.replace(to);
    }}
  >
    {children}
  </div>
));

export {Nav, NavItem};
export default Nav;
