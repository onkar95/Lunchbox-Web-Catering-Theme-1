/* eslint-disable react/no-children-prop */
import React from "react";
import css from "./login.module.scss";

const Nav = ({children, component = "div"}) => {
  return (
    <>
      {React.createElement(component, {
        children,
        className: css.navContainer,
      })}
    </>
  );
};

export {Nav};
export default Nav;
