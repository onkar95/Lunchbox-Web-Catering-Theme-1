import React from "react";
import {config} from "utils";
import Type1 from "./Type1";
import Type2 from "./Type2";
import Type3 from "./Type3";

const Selector = (props) => {
  let Component = null;
  switch (config.theme.menu.info) {
    case "Type2":
      Component = Type2;
      break;
    case "Type3":
      Component = Type3;
      break;
    default:
      Component = Type1;
  }

  return <Component {...props} />;
};

export default Selector;
