/* eslint-disable react/no-children-prop */
import React from "react";
import {withTheme} from "styled-components";
import {ThemeText, View} from "../../elementsThemed";
import styles from "./nav.module.css";

// const childrenCount = React.Children.children(children);
const Nav = ({children, component = "div"}) => (
  <>
    {React.createElement(component, {
      children,
      style: {display: "flex"},
    })}
    {/* <InkBar active={null} inactive={null} /> */}
  </>
);
const NavItem = withTheme(
  ({
    children,
    to,
    location,
    viewType,
    textTypes,
    backgroundTypes,
    theme,
    onClick,
  }) => {
    const {selected, unselected} = backgroundTypes;
    const isActive = location === to;
    return (
      <View
        type={viewType}
        className={styles["nav-item"]}
        style={{
          borderBottomColor: theme.colors[isActive ? selected : unselected],
        }}
        onClick={() => onClick(to)}
      >
        <div />
        <ThemeText type={isActive ? textTypes.selected : textTypes.unselected}>
          {children}
        </ThemeText>
      </View>
    );
  },
);

export {Nav, NavItem};
export default Nav;
