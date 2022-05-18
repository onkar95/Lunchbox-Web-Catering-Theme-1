import React from "react";
import {config} from "utils";
import Type1 from "./Type1";
import Type2 from "./Type2";
import Type3 from "./Type3";
import Type4 from "./Type4";
import Type5 from "./Type5";
import Type6 from "./Type6";
import Type7 from "./Type7";
import Type9 from "./Type9";

const ItemSelector = (props) => {
  let Component = null;

  switch (config.theme.menu.item_card) {
    case "Type1":
      Component = Type1;
      break;
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
    case "Type7":
      Component = Type7;
      break;
    case "Type9":
      Component = Type9;
      break;
    default:
      Component = Type6;
  }

  return <Component {...props} />;
};

export default ItemSelector;
