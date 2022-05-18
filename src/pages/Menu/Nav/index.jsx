import React from "react";

import {ElementsThemed} from "components";
import {config, helpers} from "utils";
import Type1 from "./Type1";
import Type2 from "./Type2";
import Type3 from "./Type3";
import Type4 from "./Type4";
import Type5 from "./Type5";
import Type6 from "./Type6";
import css from "./nav.module.scss";

const {View, Cell} = ElementsThemed;
const {disableScroll, enableScroll, onWheelElementHandler} = helpers;

const Selector = ({
  type,
  navItems,
  innerRef,
  activeLink,
  style,
  onNavClick,
}) => {
  let Component = null;
  switch (config.theme.menu.nav) {
    case "Type2":
      Component = Type2;
      break;
    case "Type3":
      Component = Type3;
      break;
    case "Type4":
      Component = Type4;
      break;
    case "Type5":
      Component = Type5;
      break;
    case "Type6":
      Component = Type6;
      break;
    default:
      Component = Type1;
      break;
  }

  return (
    <Cell
      type={type}
      render={({views, button}) => (
        <View
          type={views.background}
          id="nav"
          className={css["nav-container"]}
          style={style}
          onWheel={(e) =>
            onWheelElementHandler(e, document.getElementById("nav"))
          }
          onMouseEnter={disableScroll}
          onMouseLeave={enableScroll}
        >
          <ul className={css["nav-list"]}>
            {navItems.map((i) => (
              <Component
                key={i.id}
                type={button}
                innerRef={(node) => innerRef(node, i.name)}
                {...i}
                onNavClick={onNavClick}
                active={activeLink === i.name}
              />
            ))}
          </ul>
        </View>
      )}
    />
  );
};

export default Selector;
