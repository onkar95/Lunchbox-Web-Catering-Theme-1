/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import {Elements, ElementsThemed} from "components";
import styles from "./navIcon.module.scss";

const {Logo} = Elements;
const {ThemeText} = ElementsThemed;

const NavIcon = ({icon, children, type, onClick}) => {
  return (
    <div className={styles["nav-item"]} onClick={onClick}>
      <Logo src={icon} />
      <ThemeText type={type}>{children}</ThemeText>
    </div>
  );
};
export default NavIcon;
