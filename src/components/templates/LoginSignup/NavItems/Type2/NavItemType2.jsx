import React from "react";
import {withRouter} from "react-router-dom";
import {withTheme} from "styled-components";
import styles from "./navItemType2.module.css";
import {ThemeText, View} from "../../../../elementsThemed";

const NavItem = withTheme(
  withRouter(
    ({
      children,
      route,
      location,
      history,
      viewType,
      textTypes,
      backgroundTypes,
      theme,
    }) => {
      const {selected, unselected} = backgroundTypes;
      const isActive = location.pathname === route;
      return (
        <View
          type={viewType}
          className={styles["nav-item"]}
          style={{
            backgroundColor: theme.colors[isActive ? selected : unselected],
          }}
          onClick={() => history.replace(route)}
        >
          <div />
          <ThemeText
            type={isActive ? textTypes.selected : textTypes.unselected}
          >
            {children}
          </ThemeText>
        </View>
      );
    },
  ),
);

export default NavItem;
