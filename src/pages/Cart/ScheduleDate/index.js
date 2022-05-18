import React from "react";
import {config} from "utils";
import Type1 from "./Type1";
import Type2 from "./Type2";

const Selector = (props) => {
  let Component = null;
  switch (config?.components?.home_template) {
    case "Type1":
      Component = Type1;
      break;
    case "Type2":
      Component = Type1;
      break;
    case "Type3":
      Component = Type2;
      break;
    default:
      Component = Type1;
  }

  return <Component {...props} />;
};

export default Selector;
